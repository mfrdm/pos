var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancies = mongoose.model ('Occupancies');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Bookings = mongoose.model ('bookings');
var moment = require ('moment');

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

		console.log (q.codes)

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

		occ.save (function (err, newOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			var customerUpdate = {
				$push: {occupancy: newOcc._id}, 
				$set:{checkinStatus: true}
			};

			Customers.findByIdAndUpdate (req.params.cusId, customerUpdate, {upsert: true, new: true}, function (err, customer){
					if (err) {
						// console.log (err);
						next (err);
						return
					}
					
					if (!customer){
						next ();
						return
					}
					else {
						if (customer.checkinStatus == true && newOcc._id.equals (customer.occupancy.pop())){
							if (newOcc.bookingId){
								Bookings.update ({_id: newOcc.bookingId}, {status: 5}, function (err, b){
									if (err){
										console.log (err);
										next (err);
										return
									}

									if (order){
										res.json ({data: {occupancy: newOcc, order: order}});
										return
									}
									else {
										res.json ({data: {occupancy: newOcc, order: null}});
										return
									}
								});
							}
							else{
								if (order){
									res.json ({data: {occupancy: newOcc, order: order}});
									return
								}
								else {
									res.json ({data: {occupancy: newOcc, order: null}});
									return
								}
							}
						}
						else{
							next ();
							return					
						}

						
					}
				}
			)

		});
	};

	// Only return non-checked-in customers
	this.searchCheckingCustomers = function (req, res, next){
		var query;
		var input = req.query.input; // email, phone, fullname
		if (!input){
			next (); // 
		}

		input = validator.trim (input);
		var projections = {fullname: 1, phone: {$slice: [0,1]}, email: {$slice: [0,1]}, checkinStatus: 1, isStudent: 1, edu: 1, birthday: 1};

		if (validator.isEmail (input)){
			query = Customers.find ({email: input, checkinStatus: false}, projections);
		}
		else if (validator.isMobilePhone (input, 'vi-VN')){
			query = Customers.find ({phone: input, checkinStatus: false}, projections);
		}
		else { 
			query = Customers.find ({fullname: {$regex: input.toUpperCase ()}, checkinStatus: false}, projections);
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

			res.json ({data: cus});
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

	this.updateCheckin = function(req, res, next) {
		var updateQuery = {}; 

		Occupancies.findByIdAndUpdate (req.params.occId, req.body, {new: true}, function (err, updatedOcc){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			res.json ({data: updatedOcc});
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