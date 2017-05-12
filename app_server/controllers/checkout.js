var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
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
		var checkoutTime = req.body.data.checkoutTime;
		var orderline = req.body.data.orderline;
		var status = 2;
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
	};
};