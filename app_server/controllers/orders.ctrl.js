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

			Customers.findByIdAndUpdate (req.body.data.customer._id, {$push: {orders: newOrder._id}}, function (err, updatedCustomer){
				if (err){
					console.log (err);
					next (err);
					return
				}

				if (updatedCustomer){			
					res.json ({data: newOrder});
				}
				else{
					next ();
				}
			})

		})		
	};

	this.readOrders = function (){
		var today = moment ();
		var start = req.query.start ? moment(req.query.start) : moment (today.format ('YYYY-MM-DD'));
		var end = req.query.end ? moment(req.query.end + ' 23:59:59') : moment (today.format ('YYYY-MM-DD') + ' 23:59:59');

		var q = Orders.find (
			{
				createdAt: {
					$gte: start, 
					$lte: end,
				},
				storeId: req.query.storeId,
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
		});

	};

	this.readAnOrder = function (){

	};

	this.updateAnOrder = function (){
		
	};
}