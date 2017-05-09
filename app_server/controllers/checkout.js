var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
module.exports = new Checkout();

function Checkout() {

	this.createInvoice = function(req, res, next) {

		// FIX: should not assume the current title is the lastest one in the edu array
		function isStudent (cus){
			var title = cus.edu[cus.edu.length-1].title;
			return title == 1
		};

		function getDiscount (customer, foundOrder){
			if (customer.edu.length){
				var discountCode;
				if (isStudent (customer)){
					discountCode = 'student';
				}

				foundOrder.orderline = foundOrder.orderline.map (function (x, i, arr){
					x.price = Promocodes.discount (discountCode, x);
					return x
				});
			}			
		};

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
				foundOrder.checkoutTime = foundOrder.checkoutTime ? foundOrder.checkoutTime : moment ();

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
							Customers.findOne ({_id: foundOrder.customer._id}, {'edu': 1}, function (err, foundCustomer){
								if (err) {
									next (err)
									return
								}

								if (foundCustomer){
									getDiscount (foundCustomer, foundOrder);

									foundOrder.usage = foundOrder.getUsageTime ();
									foundOrder.total = foundOrder.getTotal ();
									foundOrder.total = foundCodes.reduce (function (acc, val){
										return Promocodes.redeem (val.name, acc);
									}, foundOrder.total);
									res.json ({data: foundOrder});

								}	
								else{
									next ()
								}
							})
						}
					});
				}
				else{
					Customers.findOne ({_id: foundOrder.customer._id}, {'edu': 1}, function (err, foundCustomer){
						if (err) {
							next (err)
							return
						}

						if (foundCustomer){
							getDiscount (foundCustomer, foundOrder);

							foundOrder.usage = foundOrder.getUsageTime ();
							foundOrder.total = foundOrder.getTotal ();				
							res.json ({data: foundOrder})
						}
						else{
							next ();
						}
					});
				}
				
			};
		});

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