var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption();
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');

module.exports = new Checkin();

function Checkin() {
	
	// FIX rollback if error
	this.checkin = function(req, res, next) {
		try{
			// console.log (req.body)

			var id = new mongoose.Types.ObjectId;
			req.body.data._id = id;
			var order = new Orders (req.body.data);
			order.save (function (err, orderData){
				if (err) { 
					// console.log (err)
					res.json (err)
				}
				else {
					// update customer order
					Customers.findByIdAndUpdate (
						req.params.cusId,
						{ $push: {orders: id} },
						{upsert: true},
						function (err, cusData){
							if (err) { 
								// console.log (err)
								res.json (err)
							}
							else {
								// console.log (cusData)
								res.json ({order: orderData, customer: cusData});
							}
						}
					)

				}

			});

		}
		catch (err) {
			// console.log (err)
			next (err)
		}

	};

	this.readCheckinList = function (req, res) {
		Orders.find (
			{
				checkinTime: {
					$gte: req.query.start, 
					$lt: req.query.end,
				},
				status: req.query.status,
				storeId: mongoose.Types.ObjectId(req.query.storeId)
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
	};

	this.updateCheckin = function(req, res) {
		try{
			Orders.findByIdAndUpdate (
				req.body._id,
				req.body.data,
				function (err, orderData){
					if (err) {
						// console.log (err)
						res.json (err);
					}
					else {
						res.json ({data: {orderData: orderData}}) 
					}
				}
			);
		}
		catch (err) {
			// console.log (err)
			next (err)
		}
	};

	//Render ng-view main checkin
	this.readAngularCheckin = function(req, res) {
		helper.angularRender( req, res,'checkin/Checkin')
	};


};