var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption();

var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancy = mongoose.model ('occupancy')
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var moment = require ('moment');

module.exports = new Checkin();

function Checkin() {
	this.validatePromocodes = function (req, res, next){
		// validate if exist and if not expire

		var q = JSON.parse(req.query.data);
		console.log (q)
		var codes = q.codes;
		var studentCode = 'studentprice';

		if (q.isStudent && q.service){
			var i = codes.indexOf (studentCode);
			var validService = ['group common', 'individual common'];
			if (validService.indexOf (q.service.toLowerCase ()) != -1 && i == -1){
				codes.push (studentCode);
			}
			else if (validService.indexOf (q.service.toLowerCase ()) == -1 && i != -1){
				codes.splice (i, 1);
			}
		}
		else if (!q.isStudent){
			var i = codes.indexOf (studentCode);
			if (i != -1){
				codes.splice (i, 1);
			}			
		}

		Promocodes.find ({name: {$in: codes}, start: {$lte: new Date ()}, end: {$gte: new Date ()}}, {name: 1, conflicted: 1, codeType: 1, override: 1}, function (err, pc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (pc.length){
				pc = Promocodes.validateCodes (pc);
			}

			// important to return pc regardless empty or not
			res.json ({data: pc});
		});
	};

	// assume promocode are validated
	this.checkin = function(req, res, next) {
		var occ = new Occupancy (req.body.data.occupancy);

		if (req.body.data.order && req.body.data.order.orderline && req.body.data.order.orderline.length){
			var order = new Orders (req.body.data.order);
			order.getSubTotal ();
			order.getTotal ();
			// order.staffId = occ.staffId;
			// order.storeId = occ.storeId;
			// order._id = new mongoose.Types.ObjectId ();
			// occ.orders = [order._id];
		};

		occ.save (function (err, newOcc){
			if (err){
				// console.log (err);
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
							console.log (order)
							if (order){
								res.json ({data: {occupancy: newOcc, order: order}});
								return								
								// order.occupancyId = newOcc._id;
								// order.getSubTotal ();
								// order.getTotal ();
								// order.save (function (err, newOrder){
								// 	if (err) {
								// 		// console.log (err);
								// 		next (err);
								// 		return
								// 	}

								// 	res.json ({data: {order: newOrder, occupancy: newOcc}});
								// 	return
								// });
							}
							else {
								res.json ({data: {occupancy: newOcc, order: null}});
								return
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
		var input = req.query.input; // email, phone, fullname
		if (!input){
			next (); // 
		}

		input = validator.trim (input);
		var splited = input.split (' ');
		var projections = {firstname: 1, lastname: 1, middlename: 1, fullname: 1, phone: {$slice: [0,1]}, email: {$slice: [0,1]}, checkinStatus: 1, isStudent: 1, edu: 1};

		var query;

		if (validator.isEmail (input)){
			query = Customers.find ({email: input, checkinStatus: false}, projections);
		}

		else if (validator.isMobilePhone (input, 'vi-VN')){
			query = Customers.find ({phone: input, checkinStatus: false}, projections);
		}
		else { 
			query = Customers.find ({fullname: {$regex: input.toUpperCase ()}, checkinStatus: false}, projections);
		}		


		query.exec (function (err, cus){
			if (err){
				next (err);
				return
			}

			res.json ({data: cus});
		});
	};


	this.readCheckinList = function (req, res, next) {
		var today = moment ();
		var start = req.query.start ? moment(req.query.start) : moment (today.format ('YYYY-MM-DD'));
		var end = req.query.end ? moment(req.query.end + ' 23:59:59') : moment (today.format ('YYYY-MM-DD') + ' 23:59:59');
		var checkinStatus = req.query.status ? req.query.status : 1; // get checked-in by default

		var stmt = 	{
			checkinTime: {
				$gte: start, 
				$lte: end,
			},
			storeId: req.query.storeId,
		};

		if (req.query.service){
			stmt['service.name'] = {$in: []};
			req.query.service.map (function (x, i, arr){
				stmt['service.name'].$in.push (x.toLowerCase ());
			})
		}

		var q = Occupancy.find (stmt, {updatedAt: 0, orders: 0, staffId: 0, storeId: 0, createdAt: 0, bookingId: 0});

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

		Occupancy.findByIdAndUpdate (req.params.occId, req.body, {new: true}, function (err, updatedOcc){
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
		var q = Occupancy.find (
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