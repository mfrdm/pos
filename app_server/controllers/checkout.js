// var helper = require('../../libs/node/helper')
// var dbHelper = require('../../libs/node/dbHelper')
// var requestHelper = require('../../libs/node/requestHelper')
// var request = require('request')
// var apiOptions = helper.getAPIOption();

var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');

module.exports = new Checkout();

function Checkout() {

	this.createInvoice = function(req, res, next) {

		Orders.findOne ({_id: req.params.orderId}, function (err, foundOrder){
			if (err){
				next (err)
				return
			}

			if (!foundOrder){
				next ()
				return
			}
			else{
				if (foundOrder.promocodes.length){ 
					var codeNames = foundOrder.promocodes.map (function (x, i, arr){
						return x.name;
					});

					Promocodes.find ({name: {$in: codeNames}, start: {$lte: new Date ()}, end: {$gte: new Date ()}}, {name: 1}, function (err, foundCodes){
						if (err){
							next (err)
							return
						}

						if (!foundCodes.length){
							next ()
						}
						else{
							foundOrder.promocodes = foundCodes;
							foundOrder.usage = foundOrder.getUsageTime ();
							foundOrder.total = foundOrder.getTotal ();

							foundOrder.total = foundCodes.reduce (function (acc, val){
								return Promocodes.redeem (val.name, acc);
							}, foundOrder.total);
							res.json ({data: foundOrder});
						}
					})
				}
				else{
					foundOrder.usage = foundOrder.getUsageTime ();
					foundOrder.total = foundOrder.getTotal ();				
					res.json ({data: foundOrder})
				}
				
			}
		})

	};

	this.confirmCheckout = function(req, res) {
		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var status = 2;
		Orders.findOneAndUpdate ({_id: req.body.data._id}, {$set: {status: status, total: total, usage: usage}}, {new: true, fields: {usage: 1, total: 1, status: 1}}, function (err, data){
			if (err){
				next (err)
				return
			}
			if (data && Object.keys (data).length){
				res.json ({data: data});
			}
			else{
				next ()
			}

		})
	};
};