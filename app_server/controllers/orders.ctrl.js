var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancies = mongoose.model ('Occupancies')
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var moment = require ('moment');
var request = require ('request');
var MakeTransaction = require('../../tools/node/makeTransaction.tool');

module.exports = new OrdersCtrl();

function OrdersCtrl() {
	this.checkout = function (req, res, next){
		var order = new Orders (req.body.data);
		order.getSubTotal ();
		order.getTotal ();

		res.json ({data: order});
	};

	this.confirmCheckout = function (req, res, next){
		console.log(req.body.data)
		var order = new Orders (req.body.data);
		order.status = 1;

		order.save (function (err, newOrder){
			if (err){
				console.log (err);
				next (err);
				return
			}
			console.log(newOrder)
			// deal with storage
			var storage = {};
			storage.itemList = [];
		    req.body.data.orderline.map(function(ele){
		    	var item = {};
		    	item.name = ele.productName;
		    	item.itemId = ele._id;
		    	item.quantity = -ele.quantity;
		    	storage.itemList.push(item)
		    	
		    })
		    if (process.env.NODE_ENV === 'development'){
				var host = process.env.LOCAL_HOST;
			}else{
				var host = process.env.REMOTE_HOST;
			}
		    var reqOptions =({
		    	url: host+'/storages/create',
				method: 'POST',
				body:{data:storage},
				json: true
		    })
			request (reqOptions, function(err, response, body){
				if(err){
					console.log(err)
				}
				console.log(newOrder)
				MakeTransaction.makeTrans(2,'order trans',newOrder.total,newOrder._id, res)
			})
		})		
	};

	this.readOrders = function (req, res, next){
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var q = Orders.find (
			{
				createdAt: {
					$gte: start, 
					$lte: end,
				},
				'location._id': req.query.storeId,
			});

		q.exec(function (err, ord){
				if (err){
					console.log (err);
					next (err);
					return
				}
				else {
					res.json ({data: ord});
				}
			}
		); 		
	};

	// Anyone can make an order, not just checked-in customer
	this.searchCustomers = function (req, res, next){
		var input = req.query.input; // email, phone, fullname
		if (!input){
			next (); // 
		}

		input = validator.trim (input);
		var splited = input.split (' ');
		var projections = {firstname: 1, lastname: 1, middlename: 1, fullname: 1, phone: {$slice: [0,1]}, email: {$slice: [0,1]}, checkinStatus: 1, isStudent: 1, edu: 1};

		var query;

		if (validator.isEmail (input)){
			query = Customers.find ({email: input}, projections);
		}

		else if (validator.isMobilePhone (input, 'vi-VN')){
			query = Customers.find ({phone: input}, projections);
		}
		else { 
			query = Customers.find ({fullname: {$regex: input.toUpperCase ()}}, projections);
		}		


		query.exec (function (err, cus){
			if (err){
				next (err);
				return
			}

			res.json ({data: cus});
		});		
	}

	this.readAnOrder = function (){
		// later
	};

	this.updateAnOrder = function (){
		// later
	};
}