var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption();
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');

module.exports = new Checkin();

function Checkin() {
	this.checkin = function(req, res, next) {
		var order = new Orders (req.body.data);
		console.log(order)
		if (order.promocodes.length){
			var codeNames = order.promocodes.map (function (x, i, arr){
				return x.name;
			});

			Promocodes.find ({name: {$in : codeNames}, start: {$lte: new Date ()}, end: {$gte: new Date ()}}, {name: 1}, function (err, foundCodes){
				if (err){
					next (err);
				}
				if (Object.keys (foundCodes).length){
					order.save (function (err, newOrder){
						if (err) {
							next (err)
							return
						}
						else {
							Customers.findByIdAndUpdate (req.params.cusId,
								{$push: {orders: newOrder._id}},
								{upsert: true},
								function (err, customer){
									if (err) {
										next (err);
										return
									}
									
									if (!customer){
										next ();
									}
									else {
										if (order)

										res.json ({data: newOrder});
									}
								}
							)

						}

					});					
				}
				else{
					// console.log({message: 'Promo codes not found / promo codes are expired'})
					next()
				}
			})
		}
		else{
			order.save (function (err, newOrder){
				if (err) {
					next (err)
					return
				}
				else {
					Customers.findByIdAndUpdate (req.params.cusId,
						{$push: {orders: newOrder._id}},
						{upsert: true},
						function (err, customer){
							if (err) {
								next (err);
								return
							}
							
							if (!customer){
								next ();
							}
							else {
								if (order)

								res.json ({data: newOrder});
							}
						}
					)

				}

			});
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


	this.cancelCheckin = function (req, res) {

	}

};