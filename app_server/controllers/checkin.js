var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var moment = require ('moment');

module.exports = new Checkin();

function Checkin() {
	this.validatePromocodes = function (req, res, next){
		// validate if exist and if not expire
		var codes = req.query.codes.split (',');
		Promocodes.find ({name: {$in: codes}, start: {$lte: new Date ()}, end: {$gte: new Date ()}}, {name: 1, conflictCodes: 1}, function (err, pc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			pc = Promocodes.checkCodeConflict (pc);

			res.json ({data: pc});
		});
	};

	// assume promocode are validated
	this.checkin = function(req, res, next) {
		var order = new Orders (req.body.data);
		order.save (function (err, newOrder){
			if (err){
				console.log (err);
				next (err);
				return
			}

			Customers.findByIdAndUpdate (req.params.cusId,
				{$push: {orders: newOrder._id}, checkinStatus: true},
				{upsert: true, new: true},
				function (err, customer){
					if (err) {
						next (err);
						return
					}
					
					if (!customer){
						next ();
						return
					}
					else {
						if (customer.checkinStatus == true && newOrder._id.equals (customer.orders.pop())){
							res.json ({data: newOrder});
							return
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

	this.searchCheckingCustomers = function (req, res, next){
		var input = req.query.input; // email, phone, fullname
		input = validator.trim (input);
		var splited = input.split (' ');
		var projections = {firstname: 1, lastname: 1, middlename: 1, phone: 1, email: 1, checkinStatus: 1};

		var nameValidator = {firstname: splited[splited.length - 1], lastname: splited[0]};
		var query;

		if (splited.length > 1){
			query = Customers.find (nameValidator, projections);
		}

		else if (validator.isEmail (input)){
			query = Customers.find ({email: input}, projections);
		}

		else if (validator.isMobilePhone (input, 'vi-VN')){
			query = Customers.find ({phone: input}, projections);
		}

		query.exec (function (err, cus){
			if (err){
				next (err);
				return
			}

			res.json ({data: cus});
		});
	};


	this.readCheckinList = function (req, res) {
		var today = moment ();
		var start = req.query.start ? moment(req.query.start) : moment (today.format ('YYYY-MM-DD'));
		var end = req.query.end ? moment(req.query.end + ' 23:59:59') : moment (today.format ('YYYY-MM-DD') + ' 23:59:59');
		var checkinStatus = req.query.status ? req.query.status : 1; // get checked-in by default
		 var q = Orders.find (
			{
				checkinTime: {
					$gte: start, 
					$lte: end,
				},
				storeId: req.query.storeId,
			});

		if (checkinStatus == 4){
			// do nothing and get all checked-in and checked-out
			q.$where ('this.status == ' + 1 + ' || this.status == ' + 2);
		}
		else {
			q.$where ('this.status == ' + checkinStatus);
		}

		q.exec(function (err, ords){
				if (err){
					console.log (err);
					next (err);
					return
				}
				else {
					res.json ({data: ords});
				}
			}
		); 

	};

	this.updateCheckin = function(req, res, next) {
		Orders.findByIdAndUpdate (req.params.orderId, req.body.data, {new: true}, function (err, updatedOrder){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			res.json ({data: updatedOrder});
		});	
	};

	//Render ng-view main checkin
	this.readAngularCheckin = function(req, res) {
		helper.angularRender( req, res,'checkin/Checkin')
	};


	this.cancelCheckin = function (req, res) {

	}

};