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

	this.readOrders = function (req, res, next){

		

	};

	this.readAnOrder = function (){

	};

	this.updateAnOrder = function (){
		
	};
}