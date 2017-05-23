var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancy = mongoose.model ('occupancy')
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var moment = require ('moment');

module.exports = new OrdersCtrl();

function OrdersCtrl() {
	this.checkout = function (req, res, next){
		var order = new Orders (req.body.data);
		order.getSubTotal ();
		order.getTotal ();

		res.json ({data: order});
	};

	this.confirmCheckout = function (req, res, next){
		var order = new Orders (req.body.data);
		order.status = 1;

		order.save (function (err, newOrder){
			if (err){
				console.log (err);
				next (err);
				return
			}

			res.json ({data: newOrder});
		})		
	};

	this.readOrders = function (req, res, next){
		var today = moment ();
		var start = req.query.start ? new Date (req.query.start) : new Date (today.format ('YYYY-MM-DD'));
		var end = req.query.end ? new Date(req.query.end + ' 23:59:59') : new Date (today.format ('YYYY-MM-DD') + ' 23:59:59');

		var q = Orders.find (
			{
				createdAt: {
					$gte: start, 
					$lte: end,
				},
				'location._id': req.query.storeId,
			});

		q.exec(function (err, ord){
				if (err){
					console.log (err);
					next (err);
					return
				}
				else {
					res.json ({data: ord});
				}
			}
		); 		
	};

	// Anyone can make an order, not just checked-in customer
	this.searchCustomers = function (req, res, next){
		var input = req.query.input; // email, phone, fullname
		if (!input){
			next (); // 
		}

		input = validator.trim (input);
		var splited = input.split (' ');
		var projections = {firstname: 1, lastname: 1, middlename: 1, fullname: 1, phone: {$slice: [0,1]}, email: {$slice: [0,1]}, checkinStatus: 1, isStudent: 1, edu: 1};

		var query;

		if (validator.isEmail (input)){
			query = Customers.find ({email: input}, projections);
		}

		else if (validator.isMobilePhone (input, 'vi-VN')){
			query = Customers.find ({phone: input}, projections);
		}
		else { 
			query = Customers.find ({fullname: {$regex: input.toUpperCase ()}}, projections);
		}		


		query.exec (function (err, cus){
			if (err){
				next (err);
				return
			}

			res.json ({data: cus});
		});		
	}

	this.readAnOrder = function (){
		// later
	};

	this.updateAnOrder = function (){
		// later
	};
}