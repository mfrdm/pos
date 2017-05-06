var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var OrdersModel = mongoose.model('orders');

module.exports = new Orders();

function Orders() {

	this.readSomeOrders = function (req, res) {
		try {
			OrdersModel.find (
				{
					// checkinTime: {
					// 	$gte: req.query.start, 
					// 	$lt: req.query.end,
					// },
					status: req.query.status,
					// storeId: mongoose.Types.ObjectId(req.query.storeId)
				},
				function (err, docs){
					if (err){
						res.json (err);
					}
					else {
						res.json ({data: docs});
					}
				}
			)

		}
		catch (err){
			console.log (err)
			next (err)
		}

	};

	this.readOneOrderById = function(req, res) {
		dbHelper.findOneById(req, res, OrdersModel, 'orderId')
	};

	this.createOneOrder = function(req, res, next) {
		req.body._id = new mongoose.Types.ObjectId
		var obj = new OrdersModel (req.body);
		obj.save (function (err, data){
			if (err) { next (err) }
			else {
				res.json ({data: data});
				return
			}

		});

	};

	this.updateOneOrderById = function(req, res) {
		dbHelper.updateOneById(req, res, OrdersModel, 'orderId')
	};

};