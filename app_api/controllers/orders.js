var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var Orders = mongoose.model('orders');
var moment = require ('moment');

module.exports = new OrdersCtrl();

function OrdersCtrl() {

	this.readTotal = function (req, res, next){
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var conditions = {
			createdAt: {
				$gte: start, 
				$lte: end,
			},
			status: 1,
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		var q = Orders.aggregate ([
			{
				$match: conditions
			}, 
			{
				$group: {
					_id: 'All Orders', total: {$sum: "$total"}
				}
			}
		]);

		q.exec(function (err, ord){
				if (err){
					console.log (err);
					next (err);
					return
				}
				else {
					console.log (ord)
					res.json ({data: ord});
				}
			}
		); 			
	};

	this.readOrderline = function (req, res){
		//
	};

	this.readSomeOrders = function (req, res) {
		try {
			if(req.query.status){
				Orders.find (
					{
						// checkinTime: {
						// 	$gte: req.query.start, 
						// 	$lt: req.query.end,
						// },
						status: req.query.status,
						orderline:{$elemMatch:{productName:{$in:['medium group private', 'small group private']}}},
						parent:{$exists: false}
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
			else{
				Orders.find (
				{},
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
		}
		catch (err){
			console.log (err)
			next (err)
		}

	};

	this.readOneOrderById = function(req, res) {
		dbHelper.findOneById(req, res, Orders, 'orderId')
	};

	this.createOneOrder = function(req, res, next) {
		req.body._id = new mongoose.Types.ObjectId
		var obj = new Orders (req.body);
		obj.save (function (err, data){
			if (err) { next (err) }
			else {
				res.json ({data: data});
				return
			}

		});

	};

	this.updateOneOrderById = function(req, res) {
		dbHelper.updateOneById(req, res, Orders, 'orderId')
	};

};