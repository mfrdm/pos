var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Checkout();

function Checkout() {

	// assume promotion codes, if provided, are valid, since checked when checking in
	this.createInvoice = function (req, res, next){
		Orders.findOne ({_id: req.params.orderId}, function (err, ord){
			if (err){
				console.log (err);
				next (err);
				return
			}

			ord.getSubTotal ();
			ord.getTotal ();
			res.json ({data: ord});
		})
	}

	this.confirmCheckout = function(req, res, next) {
		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var checkoutTime = new Date ();
		var orderline = req.body.data.orderline;
		var status = 2;
		console.log(req.body.data.customer)
		Customers.findOneAndUpdate({_id:req.body.data.customer._id}, {$set:{checkinStatus:false}}, function(err, cus){
			if (err){
				next (err)
				return
			}else{
				Orders.findOneAndUpdate ({_id: req.body.data._id}, {$set: {status: status, total: total, usage: usage, checkoutTime: checkoutTime, orderline: orderline}}, {new: true, fields: {usage: 1, total: 1, status: 1, orderline: 1}}, function (err, ord){
					if (err){
						next (err)
						return
					}
					if (ord && Object.keys (ord).length){
						res.json ({data: ord});
					}
					else{
						next ();
					}

				})
			}
		})
		
	};
};