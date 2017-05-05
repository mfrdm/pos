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
					var promocodeIds = foundOrder.promocodes.map (function (x, i, arr){
						return x._id
					});

					Promocodes.find ({_id: {$in: promocodeIds}, start: {$lte: new Date ()}, end: {$gte: new Date ()}}, {name: 1}, function (err, foundCodes){
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
							console.log ('total', foundOrder.total);
							res.json ({data: foundOrder})
						}
					})
				}
				else{
					res.json ({data: foundOrder})
				}
				
			}
		})

		// Promocodes.find ({name: req.body.data.Promocodes.name}, function (err, data){
		// 	if (err){
		// 		// console.log (err)
		// 		next ()
		// 		return
		// 	}
			
		// 	if (!data){
		// 		res.json ({data: {}});
		// 		return
		// 	}

		// 	else{
		// 		res.json ({data: data})
		// 	}


		// })

	};

	this.checkout = function(req, res) {
		// calculate total amount, considering promotion code, and add to db
		// // return invoice data 

		// var apiUrl = apiOptions.server + "/api/orders/order/"+req.body.orderId+"/edit";
		// var view = null;
		// var body = {"$set": {"status":"2", "checkoutTime":Date.now()}};
		// var dataFilter = null;
		// var send = function(req, res, view, data, cb){
		// 	requestHelper.sendJsonRes(res, 200, data);
		// }
		// requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};
};