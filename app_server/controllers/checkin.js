var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancies = mongoose.model ('Occupancies');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Bookings = mongoose.model ('bookings');
var moment = require ('moment');
var Promise = require ('bluebird')

module.exports = new Checkin();

function Checkin() {

	// FIX: encapsulate validate into Promocode
	// only validate one code at a time
	// codes is an array of strings of code names
	this.validatePromocodes = function (req, res, next){
		var q = req.query;
		if (!q.codes || (q.codes && !q.codes.length)){
			next ();
			return;
		}

		var query = Promocodes.find ({name: q.codes, start: {$lte: new Date ()}, end: {$gte: new Date ()}, excluded: false}, {name: 1, codeType: 1, priority: 1, services: 1, label:1, redeemData: 1});

		// FIX: find better solution. Not work if a code is used for more than one services
		// query.$where ('this.services.indexOf ("' + q.service.toLowerCase () + '") != -1 || this.services.indexOf ("all") != -1');

		query.exec(function (err, pc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			// if (pc.length){
			// 	pc = Promocodes.validateCodes (pc);
			// }

			console.log (pc)

			res.json ({data: pc});

		});
	};

	// assume promocode are validated
	this.checkin = function(req, res, next) {
		var occ = new Occupancies (req.body.data.occupancy);

		if (req.body.data.order && req.body.data.order.orderline && req.body.data.order.orderline.length){
			var order = new Orders (req.body.data.order);
			order.getSubTotal ();
			order.getTotal ();
		};

		var prepareCreateOcc = function (occ){
			return function (resolve, reject){
				return occ.save (function (err, newOcc){
					if (err){
						reject (err);
						return;
					}

					resolve (newOcc);
				});
			};
		}

		var prepareUpdateCus = function (newOcc, cusId){
			return function (resolve, reject){
				var update = {
					$push: {occupancy: newOcc._id}, 
					$set:{checkinStatus: true}
				};	
								
				return Customers.findByIdAndUpdate (cusId, update, {upsert: true, new: true}, function (err, updatedCustomer){
					if (err) {
						reject (err);
						return
					}
					if (!updatedCustomer){
						resolve ({});
						return
					}
					else {
						resolve (updatedCustomer);
					}
				});	
			}
		};

		var prepareUpdateBooking = function (newOcc, order){
			return function (resolve, reject) {
				return Bookings.update ({_id: newOcc.bookingId}, {status: 5}, function (err, updatedBooking){
					if (err){
						reject (err);
						return;
					}

					resolve (updatedBooking);
				});
			};	
		};

		var getSaveOccPromise = prepareCreateOcc (occ);

		new Promise (getSaveOccPromise).then (
			function success (newOcc){
				var getUpdateCusPromise = prepareUpdateCus (newOcc, req.params.cusId);
				new Promise (getUpdateCusPromise).then (
					function success (updatedCustomers){
						var _getResponse = function (){
							if (order){
								res.json ({data: {occupancy: newOcc, order: order}});
								return
							}
							else {
								res.json ({data: {occupancy: newOcc, order: null}});
								return
							}								
						};

						if (newOcc.bookingId){
							var getUpdateBooking = prepareUpdateBooking (newOcc, order);
							new Promise (getUpdateBooking).then (
								function success (updatedBooking){
									_getResponse ();		
								},
								function error (err){
									next (err)
								}
							)
						}
						else{
							_getResponse ();							
						}
					},
					function error (err){
						next (err);
					}
				);
			},
			function error (err){
				next (err)
			}
		);
	};

	// Only return non-checked-in customers
	this.searchCheckingCustomers = function (req, res, next){
		var query;
		var input = req.query.input; // email, phone, fullname
		if (!input){
			next (); // 
			return;
		}

		// Temporary not check. Need to figure out better solution.
		var stmt = {
			// checkinStatus: false, 
		}

		input = validator.trim (input);
		var projections = {fullname: 1, phone: {$slice: [0,1]}, email: {$slice: [0,1]}, checkinStatus: 1, isStudent: 1, edu: 1, birthday: 1};

		if (validator.isEmail (input)){
			stmt.email = input;
			query = Customers.find (stmt, projections);
		}
		else if (validator.isMobilePhone (input, 'vi-VN')){
			stmt.phone = input;
			query = Customers.find (stmt, projections);
		}
		else { 
			stmt.fullname = {$regex: input.toUpperCase ()}
			query = Customers.find (stmt, projections);
		}		

		// get non-expired accounts
		query.populate ({
			path: 'accounts',
			match: {
				start: {$lte: new Date ()},
				end: {$gte: new Date ()},
				amount: {$gt: 0}				
			},
			select: 'amount service unit',
		})

		query.exec (function (err, cus){
			if (err){
				next (err);
				return
			}

			// Check if the service used by the customers who has been checked in is private 
			var notCheckedinCustomers = [];
			var checkedinCustomerIds = [];
			var checkedinCustomers = cus.filter (function (x, i, arr){
				if (x.checkinStatus){
					checkedinCustomerIds.push (x._id);
					return true;
				}
				else{
					notCheckedinCustomers.push (x);
					return false;
				}
			});

			if (checkedinCustomerIds.length){
				Occupancies.find ({'customer._id': {$in: checkedinCustomerIds}, 'service.name': /private/i}, {'customer._id': 1}, function (err, foundOcc){

					if (err){
						console.log (err);
						next (err);
						return;
					}

					if (foundOcc.length){
						var validCheckedinCustomerId = foundOcc.map (function (x, i, arr){
							return x.customer._id.toString ();
						});

						var validCheckedinCustomers = checkedinCustomers.filter (function (x, i, arr){
							if (validCheckedinCustomerId.indexOf (x._id.toString ()) >= 0){
								return true;
							}
							else{	
								return false;
							}
						});

						res.json ({data: notCheckedinCustomers.concat (validCheckedinCustomers)});
						return;					
					}
					else{
						res.json ({data: notCheckedinCustomers});
						return;
					}
				});
			}
			else{
				res.json ({data: cus});
			}
		});
	};

	this.readCheckinList = function (req, res, next) {
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var checkinStatus = req.query.status ? req.query.status : 1; // get checked-in by default

		var stmt = 	{
			checkinTime: {
				$gte: start, 
				$lte: end,
			},
			'location._id': req.query.storeId,
		};

		if (req.query.service){
			stmt['service.name'] = {$in: []};
			req.query.service.map (function (x, i, arr){
				stmt['service.name'].$in.push (x.toLowerCase ());
			})
		}

		var q = Occupancies.find (stmt, {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0});

		if (checkinStatus == 4){
			// do nothing and get all checked-in and checked-out
			q.$where ('this.status == ' + 1 + ' || this.status == ' + 2);
		}
		else {
			q.$where ('this.status == ' + checkinStatus);
		}

		q.exec(function (err, occ){
				if (err){
					console.log (err);
					next (err);
					return
				}
				else {
					res.json ({data: occ});
				}
			}
		); 
	};

	this.updateCheckin = function (req, res, next){
		console.log (req.body.data)
		res.json ({})
		return
		
		var update = {$set: {}};

		if (!req.body.data._id){
			next ();
		}

		if (req.body.data.customer){
			update.$set.customer = req.body.data.customer;
		}

		var prepareUpdateOcc = function (occid, update){
			return function (resolve, refuse){
				return Occupancies.findByIdAndUpdate ({_id: occid}, update, function (err, updatedOcc){
					if (err){
						refuse (err);
					}else{
						resolve (updatedOcc);
					}
				})
			}
		};

		var prepareUpdateUnselectedCustomer = function (cusid){
			return function (resolve, refuse){
				return Customers.findByIdAndUpdate ({_id: cusid}, {$pop: {occupancy: 1}}, function (err, cus){
					if (err){
						refuse (err);
					}
					else {
						resolve (cus);
					}
				})
			}
		};

		var prepareUpdateSelectedCustomer = function (cusid, occid){
			return function (resolve, refuse){
				return Customers.findByIdAndUpdate ({_id: cusid}, {$push: {occupancy: occid}}, function (err, cus){
					if (err){
						refuse (err);
					}
					else {
						resolve (cus);
					}
				})
			}
		}

		var updateOccPromise = prepareUpdateOcc (req.body.data._id, update);
		new Promise (updateOccPromise)
			.then (function success (updatedOcc){
				var updateSelectedCustomer = prepareUpdateSelectedCustomer (req.body.data.customer._id, updatedOcc._id);

				new Promise (updateSelectedCustomer)
					.then (function success (selectedCustomer){
						var updateUnselectedCustomer = prepareUpdateUnselectedCustomer (updatedOcc.customer._id);
						new Promise (updateUnselectedCustomer)
							.then (function success (unselectedCustomer){
								updatedOcc.customer = selectedCustomer;
								res.json ({data: updatedOcc});
							}, function error (err){
								next (err);
							});
						
					},
					function error (err){
						next (err);
					});

				
			},
			function error (err){
				next (err);
			});
	};

	this.cancelCheckin = function (req, res) {
		// later
	}

	this.readOccupancies = function(req, res){
		var q = Occupancies.find (
			{
				status:req.query.status
			});

		q.exec(function (err, occ){
			if (err){
				console.log (err);
				next (err);
				return
			}
			else {
				res.json ({data: occ});
			}
		});
	};

};