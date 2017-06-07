var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
// var Occupancy = mongoose.model ('occupancy');
var Occupancy = mongoose.model ('NewOccupancies');
var Deposits = mongoose.model ('deposits');

module.exports = new Checkout();

function Checkout() {

	// assume promotion codes, if provided, are valid, since checked when checking in
	this.createInvoice = function (req, res, next){
		Occupancy.findOne ({_id: req.params.occId}, {location: 0, staffId: 0, updateAt: 0}, function (err, foundOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (foundOcc){
				foundOcc.checkoutTime = foundOcc.checkoutTime ? foundOcc.checkoutTime : moment ();
				foundOcc.getTotal ();

				
				Customers.findOne ({_id: foundOcc.customer._id})
					.populate ({
						path: 'deposits',
						match: 	{
							start: {$lte: new Date ()},
							end: {$gte: new Date ()},
							amount: {$gt: 0}
						},
						select: 'amount service unit label'
					}) 
					.exec (function (err, cus){
						if (err){
							console.log (err);
							next (err);
						}

						console.log (cus)

						foundOcc = foundOcc.toObject (); // convert to add data
						foundOcc.deposits = cus.deposits ? cus.deposits : [];
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
	// return reduced total, usage
	this.withdrawUsageHourAccount = function (req, res, next){
		var depositId = req.query.depositId;
		var unit = 'hour';
		var occ = JSON.parse (req.query.occ);
		occ = new Occupancy (occ);
		var remain;

		Deposits.findOne ({_id: depositId}, function (err, deposit){
			if (err) {
				console.log (err);
				next (err);
			}
 			
			if (deposit){
				var accAmountRemain = deposit.account.amount;
				var oriUsage = occ.usage;
				occ.promocodes = Promocodes.removeDefaultCode (occ.promocodes); // necessary to reset effect of default codes
				occ.usage = deposit.withdraw (occ.usage, unit, occ.service.name);
				occ.getTotal ();

				// console.log (occ.total, oriUsage - occ.usage, deposit.account.amount)

				res.json ({data: {
					total: occ.total,
					withdraw: Number((oriUsage - occ.usage).toFixed(1)),
					accountRemain: deposit.account.amount
				}})
			}
			else{
				res.json (); // may not the best way to indicate 
			}
			
		});

	};

	this.confirmCheckout = function(req, res, next) {
		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var checkoutTime = req.body.data.checkoutTime;
		var promocodes = req.body.data.promocodes;
		var paymentMethods = req.body.data.paymentMethod ? req.body.data.paymentMethod : [];
		var note = req.body.data.note ? req.body.data.note : ''; // optional
		var status = 2;

		if (req.body.data.paymentMethod && req.body.data.paymentMethod.length){
			req.body.data.paymentMethod.map (function (x, i, arr){
				if (x.name == 'account'){
					total -= x.paid;
				}
			});
		}

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
					promocodes: promocodes,
					checkoutTime: checkoutTime, 
					note: note
				}

				// add payment method if it is not cash. Not id means cash
				req.body.data.paymentMethod.map (function (x, i, arr){
					if (x.methodId){
						updateOcc.paymentMethod = req.body.data.paymentMethod;
					}
				});	

				Occupancy.findOneAndUpdate ({_id: req.body.data._id}, {$set: updateOcc}, {new: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function (err, occ){
					if (err){
						next (err)
						return
					}


					if (occ){

						// update acc if being used
						// At this moment. Only one method is used at a time
						if (occ.paymentMethod && occ.paymentMethod.length){
							var deposit;
							occ.paymentMethod.map (function (x, i, arr){
								if (x.name == 'account'){
									deposit = x;
								}
							});

							if (deposit){
								Deposits.findOneAndUpdate ({_id: deposit.methodId}, {$inc: {amount: - deposit.amount}}, function (err, acc){
									if (err){
										console.log (err);
										next (err);
										return
									}

									if (acc){
										res.json ({data: occ});
									}
									else{
										next ();
									}

									return

								});
							}

						}
						else{
							res.json ({data: occ});
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