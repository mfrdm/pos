var moment = require ('moment');
var mongoose = require ('mongoose');
var request = require ('request');
var Promocodes = mongoose.model ('Promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Occupancies = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');
var Rewards = mongoose.model ('Rewards');

var AccountsCtrl = require ('./accounts.ctrl');
var RewardsCtrl = require ('./rewards.ctrl');

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
				foundOcc.getTotal ();

				req.query = {
					customerId: foundOcc.customer._id,
					service: foundOcc.service.name.toLowerCase (),
				};

				function acc_cb (acc){
					function rw_cb (reward){
						if (foundOcc.service.name.indexOf ('private') != -1 && reward.length > 0){
							reward = []; // not return reward with private service
						}

						res.json ({occ: foundOcc, acc: acc, reward: reward});	
					}
					RewardsCtrl.getReward (req, res, next, rw_cb)			
				}

				AccountsCtrl.getAccounts (req, res, next, acc_cb);
			}
			else{
				next ();
			}
		});
	};

	// assume call createInvoice beforehand, and an account passed is valid
	// at this moment only allow paid by one account at a checkout time
	// Apply only usage account, whose unit is hour
	// move to account.ctrl
	this.preparWithdraw = function (req, res, next){
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
				}

				var beforeAccAmount = foundAcc.amount;
				var beforeTotal = occ.total;
				var context = occ.getAccContext ();
				foundAcc.withdraw (context);
				var data = {
					occ:{
						total: occ.total,
					},
					acc: {
						_id: foundAcc._id,
						name: 'account',
						unit: foundAcc.unit,
						paidTotal: beforeTotal - occ.total,
						paidAmount: beforeAccAmount - foundAcc.amount, // already paid hours
						amount: foundAcc.amount, // remain of account
						recursive: foundAcc.recursive,
						activate: foundAcc.activate,
						expireDateNum: foundAcc.expireDateNum,					
					}						
				};
				res.json ({data: data});

			}
			else{
				res.json ({data: []});
			}
			
		});
	};

	this.confirmCheckout = function(req, res, next) {
		// only one account is used at a time
		// reward is accepted as a payment method. reward and account can be used together
		var paid = req.body.data.total;
		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var oriUsage = req.body.data.oriUsage;
		var price = req.body.data.price;
		var checkoutTime = req.body.data.checkoutTime;
		var promocodes = req.body.data.promocodes;
		var paymentMethod = req.body.data.paymentMethod ? req.body.data.paymentMethod : [];
		var note = req.body.data.note ? req.body.data.note : ''; // optional
		var service = req.body.data.service; 
		var status = 2;

		paymentMethod.map (function (x, i, arr){
			paid = paid - x.paidTotal;
		});

		Customers.findOneAndUpdate({_id:req.body.data.customer._id}, {$set:{checkinStatus:false}}, function(err, cus){
			if (err){
				console.log (err)
				next (err)
				return
			}

			var updateOcc = {
				status: status, 
				total: total, 
				paid: paid,
				usage: usage, 
				oriUsage: oriUsage,
				price: price,
				promocodes: promocodes,
				checkoutTime: checkoutTime,
				paymentMethod: paymentMethod,
				note: note
			}

			Occupancies.findOneAndUpdate ({_id: req.body.data._id}, {$set: updateOcc}, {new: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function (err, occ){
				if (err){
					console.log (err)
					next (err)
					return
				}

				if (occ){
					if (paymentMethod && paymentMethod.length){
						paymentMethod.map (function (x, i, arr){
							if (x.name == 'reward'){
								req.body.rwd = x;
								req.body.rwd.source = {
									_id: occ._id,
									amount: -x.paidAmount,
								}
							}
							else if (x.name == 'account'){
								req.body.acc = x;
							}
						});
					}

					// to reward
					if (service.name != 'Medium group private' && service.name != 'Large group private' && service.name != 'Small group private'){
						req.body.context = {
							getTotal: function (){return occ.paid},
							cus: cus,
						}
					}
					else{
						req.body.context = null;
					}

					req.body.rwd = req.body.rwd ? req.body.rwd : null;
					req.query.customerId = cus._id;

					function _acc_cb (updatedAcc){
						function _rwd_cb (rwd){
							res.json ({data: {message: 'success'}});
						}
						if (occ.paid > 0){
							RewardsCtrl.withdraw (req, res, next, _rwd_cb);
						}
						else{
							_rwd_cb ();
						}
					}

					AccountsCtrl.withdraw (req, res, next, _acc_cb);
				}
				else{
					next ();
					return
				}

			});
		})
	};

	// Automate process 
	// FIX: handle when prepaid by account
	this.creatOccupancies = function (req, res, next){
		var occ = req.body.data;
		newOcc = new Occupancies (occ);
		newOcc.getTotal ();
		newOcc.status = 2;

		newOcc.save (function (err, returnedOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			Customers.findOneAndUpdate ({_id: returnedOcc.customer._id}, {$push: {occupancy: returnedOcc._id}}, function (err, cus){
				if (err){
					console.log (err);
					next (err);
					return;
				} 

				if (cus){

					res.json ({data: {message: 'success'}});
				}
				else{
					next ();
				}
				
			});
		})
	}

	// checkout customer using group common
	this.checkoutGroup = function(req, res, next){
		//
	}
};