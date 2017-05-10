var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption();


var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');



module.exports = new Checkin();

function Checkin() {
	this.checkin = function(req, res, next) {
		var order = new Orders (req.body.data);

		if (order.promocodes.length){
			var codeNames = order.promocodes.map (function (x, i, arr){
				return x.name;
			});
			console.log(codeNames, 'te')

			Promocodes.find ({name: {$in : codeNames}, start: {$lte: new Date ()}, end: {$gte: new Date ()}}, {name: 1}, function (err, foundCodes){
				if (err){
					console.log(err)
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

	this.searchCheckingCustomers = function (req, res, next){
		var input = req.query.input; // email, phone, fullname
		input = validator.trim (input);
		var splited = input.split (' ');
		var projections = {firstname: 1, lastname: 1, middlename: 1, phone: 1, email: 1};

		var nameValidator = {firstname: splited[splited.length - 1], lastname: splited[0]};
		var query;

		if (splited.length > 1){
			query = Customers.find (nameValidator, projections);
		}

		else if (validator.isEmail (input)){
			query = Customers.find ({email: input}, projections);
		}

		else if (validator.isMobilePhone (input, 'vi-VN')){
			query = Customers.find ({phone: input}, projections);
		}

		query.exec (function (err, cus){
			if (err){
				next (err);
			}

			res.json ({data: cus});
		});
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