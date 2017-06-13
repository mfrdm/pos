var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('Promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Occupancies = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');

module.exports = new Checkout();

function Checkout() {

	// assume promotion codes, if provided, are valid, since checked when checking in
	this.createInvoice = function (req, res, next){
		Occupancies.findOne ({_id: req.params.occId}, {location: 0, staffId: 0, updateAt: 0}, function (err, foundOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (foundOcc){
				foundOcc.checkoutTime = foundOcc.checkoutTime ? foundOcc.checkoutTime : moment ();
				
				try{
					foundOcc.getTotal ();
				}
				catch (err){
					next (err);
					return;
				}

				Customers.findOne ({_id: foundOcc.customer._id})
					.populate ({
						path: 'accounts',
						match: 	{
							start: {$lte: new Date ()},
							end: {$gte: new Date ()},
							$or: [{amount: {$gt: 0}}, {$and: [{'recursive.isRecursive': true}, {amount: {$lte: 0}}]}]
							
						},
						// select: 'amount service unit label'
					}) 
					.exec (function (err, cus){
						if (err){
							console.log (err);
							next (err);
						}


						if (cus.accounts.length){
							cus.accounts = cus.accounts.filter (function (acc, i, arr){
								acc.renew ();
								if (acc.amount > 0){
									return acc;
								}

								return false
							});
						}

						console.log (cus.accounts)


						foundOcc = foundOcc.toObject (); // convert to add data
						foundOcc.accounts = cus.accounts ? cus.accounts : [];

						res.json ({data: foundOcc});
					});

			}
			else{
				next ();
			}

		});
	};

	// assume call createInvoice beforehand
	// at this moment only allow paid by one account at a checkout time
	// Apply only usage account, whose unit is hour
	this.withdrawUsageHourAccount = function (req, res, next){
		var accId = req.params.accId;
		var occ = JSON.parse (req.query.occ);
		occ = new Occupancies (occ);

		Accounts.findOne ({_id: accId}, function (err, foundAcc){
			if (err) {
				console.log (err);
				next (err);
			}
 			
			if (foundAcc){

				if (foundAcc.isRenewable ()){
					foundAcc.renew ();

					var accUpdate = {
						amount: foundAcc.amount,
						'recursive.lastRenewDate': foundAcc.recursive.lastRenewDate,
						'recursive.renewNum': foundAcc.recursive.renewNum,
					}

					Accounts.findOneAndUpdate ({_id: foundAcc._id}, {$set: accUpdate}, {new: true}, function (err, updatedAcc){
						if (err){
							console.log (err);
							next (err);
							return
						}

						if (!updatedAcc){
							next ();
							return
						}

						var beforeAccAmount = updatedAcc.amount;
						var beforeTotal = occ.total;
						var context = occ.getAccContext ();

						updatedAcc.withdraw (context);

						res.json ({
							data: {
								occ:{
									total: occ.total,
								},
								acc: {
									_id: updatedAcc._id,
									name: 'account',
									unit: updatedAcc.unit,
									paidTotal: beforeTotal - occ.total,
									paidAmount: beforeAccAmount - updatedAcc.amount,
									remain: updatedAcc.amount,
								}
							}
						});
					});

				}
				else{
					var beforeAccAmount = foundAcc.amount;
					var beforeTotal = occ.total;
					var context = occ.getAccContext ();

					foundAcc.withdraw (context);

					res.json ({
						data: {
							occ:{
								total: occ.total,
							},
							acc: {
								_id: foundAcc._id,
								name: 'account',
								unit: foundAcc.unit,
								paidTotal: beforeTotal - occ.total,
								paidAmount: beforeAccAmount - foundAcc.amount, // already paid hours
								remain: foundAcc.amount,

							}
						}
					});
				}

			}
			else{
				res.json (); // may not the best way to indicate 
			}
			
		});
	};

	this.confirmCheckout = function(req, res, next) {
		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var price = req.body.data.price;
		var checkoutTime = req.body.data.checkoutTime;
		var promocodes = req.body.data.promocodes;
		var paymentMethods = req.body.data.paymentMethod ? req.body.data.paymentMethod : [];
		var note = req.body.data.note ? req.body.data.note : ''; // optional
		var status = 2;

		Customers.findOneAndUpdate({_id:req.body.data.customer._id}, {$set:{checkinStatus:false}}, function(err, cus){
			if (err){
				next (err)
				return
			}
			else{

				var updateOcc = {
					status: status, 
					total: total, 
					usage: usage, 
					price: price,
					promocodes: promocodes,
					checkoutTime: checkoutTime,
					paymentMethod: paymentMethods,
					note: note
				}

				Occupancies.findOneAndUpdate ({_id: req.body.data._id}, {$set: updateOcc}, {new: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function (err, occ){
					if (err){
						next (err)
						return
					}

					if (occ){

						// update acc if being used
						// At this moment. Only one method is used at a time
						if (occ.paymentMethod && occ.paymentMethod.length){
							var acc;
							occ.paymentMethod.map (function (x, i, arr){
								if (x.name == 'account'){
									acc = x;
								}
							});

							if (acc){
								Accounts.findOneAndUpdate ({_id: acc._id}, {$inc: {amount: - acc.paidAmount}}, function (err, foundAcc){
									if (err){
										console.log (err);
										next (err);
										return
									}

									if (foundAcc){
										res.json ({data: {message: 'success'}});
									}
									else{
										next ();
									}

									return

								});
							}

						}
						else{
							res.json ({data: {message: 'success'}});
						}
					}
					else{
						next ();
					}

				})
			}
		})
	};
};