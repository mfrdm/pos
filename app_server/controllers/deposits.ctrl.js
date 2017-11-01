var validator = require ('validator');
var mongoose = require ('mongoose');
var Deposits = mongoose.model ('Deposits');
var Accounts = mongoose.model ('Accounts');
var Customers = mongoose.model ('customers');
var moment = require ('moment');

var AccountsCtrl = require ('./accounts.ctrl');
var CustomersCtrl = require ('./customers');
var RewardsCtrl = require ('./rewards.ctrl');

module.exports = new DepositsCtrl();

function DepositsCtrl (){
	var thisDepositCtrl = this;
	this.createOneDeposit = function (req, res, next){
		function reward_cb (){
			function _cb (){
				res.json ({data: {message: 'success'}});
			}

			req.body.rwd = null;
			req.query.customerId = req.body.cus._id;
			req.body.context = {
				getTotal: function (){return req.body.dep.total},
				cus: req.body.cus,
			};

			RewardsCtrl.withdraw (req, res, next, _cb);
		};

		function after_create_dep_cb (dep){
			req.body.dep = dep;
			if (req.body.acc['label']['en'] != 'Cash' && deposit.paymentMethod.length){ // not cash account and paid by cash account
				req.body.acc = deposit.paymentMethod[0];
				AccountsCtrl.withdraw (req, res, next, reward_cb);
			}
			else{
				reward_cb ();
			}
		};

		function after_update_cus_cb (cus){
			deposit.account = req.body.acc;
			deposit.status = 1; // paid
			req.body.deposit = deposit;
			req.body.cus = cus;
			thisDepositCtrl.insertOne (req, res, next, after_create_dep_cb);
		};

		function after_withdraw_cb (acc){
			req.body.acc = acc;
			req.body.cus = deposit.customer;
			CustomersCtrl.findOne (req, res, next, after_update_cus_cb); // replace the step by get customer infor beforehand
		}

		function after_find_cash_acc_cb (foundAcc){
			if (foundAcc){
				req.body.acc = foundAcc;
				req.body.deposit = deposit;
				AccountsCtrl.depositCash (req, res, next, after_withdraw_cb);
			}
			else{
				AccountsCtrl.createAccount (req, res, next, after_create_acc_cb);
			}
		}

		function after_create_acc_cb (acc){
			req.body.acc = acc;
			CustomersCtrl.addAccount (req, res, next, after_update_cus_cb);
		}

		var deposit = req.body.data;
		req.body.acc = deposit.account;
		req.body.acc.customer = deposit.customer;
		if (deposit.account.name == 'cash'){
			AccountsCtrl.findCashAccount (req, res, next, after_find_cash_acc_cb);
		}
		else{
			AccountsCtrl.createAccount (req, res, next, after_create_acc_cb);
		}
	}

	this.insertOne = function (req, res, next, cb){
		var deposit = req.body.deposit;
		Deposits.create (deposit, function (err, newDeposit){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (cb){
				cb (newDeposit)
			}
			else{
				res.json ({data: newDeposit});
			}	
		});
	}

	this.readInvoice = function (req, res, next){
		var deposit = JSON.parse (req.query.deposit);
		deposit = new Deposits (deposit);
		deposit.prepare ();
		deposit.getTotal ();

		Accounts.find ({
			'customer._id': deposit.customer._id,
			name: 'cash',
			amount: {$gt: 0}
		}, function (err, foundAccount){
			if (err){
				next (err);
				return;
			}

			deposit = deposit.toObject (); // convert to add data
			deposit.curAccounts = foundAccount;			
			res.json ({data: deposit});
		});
	}

	this.updateOneDeposit = function (req, res, next){
	}

	this.readDepositsByCustomerId = function (req, res, next){
	}

	this.readDeposits = function (req, res, next) {
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var stmt = 	{
			createdAt: {
				$gte: start, 
				$lte: end,
			},
			'location._id': req.query.storeId,
		};	

		var projections = {total: 1, customer: 1, createdAt: 1, account: 1, note: 1};

		Deposits.find (stmt, projections, function (err, foundDeposits){
			if (err){
				console.log (err);
				next (err);
				return
			}

			res.json ({data: foundDeposits});
		})	
	}

	this.readDefaultAccounts = function (req, res, next){
		var defaultAcc = Accounts.getDefaultAccounts ();
		res.json ({data: defaultAcc});
	}

	this.readGroupon = function (req, res, next){
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);	

		var stmt = 	{
			createdAt: {
				$gte: start, 
				$lte: end,
			},
			'groupon.isLeader': true,
			'location._id': req.query.storeId,
		};

		Deposits.find (stmt, {groupon: 1, customer: 1}, function (err, newDeposit){
			if (err){
				console.log (err);
				next (err);
				return
			}

			res.json ({data: newDeposit});

		});

	}

	this.withdrawCash = function (req, res, next){
		var deposit = JSON.parse(req.query.data);
		var accId = deposit.selectedAccount._id; 
		Accounts.findOne ({_id: accId}, function (err, foundAcc){
			if (err) {
				console.log (err);
				next (err);
			}
			if (foundAcc){
				foundAcc.initAccount ();
				deposit = new Deposits (deposit);
				var beforeAccAmount = foundAcc.amount;
				var beforeTotal = deposit.total;
				var context = deposit.getContext ();

				foundAcc.withdraw (context);

				res.json ({
					data: {
						deposit:{
							total: deposit.total,
						},
						acc: {
							_id: foundAcc._id,
							name: 'account',
							unit: foundAcc.unit,
							paidTotal: beforeTotal - deposit.total,
							paidAmount: beforeAccAmount - foundAcc.amount, // already paid hours
							amount: foundAcc.amount,
							start: foundAcc.start,
							end: foundAcc.end,
							activate: foundAcc.activate,
						}
					}
				});
			}
			else{
				res.json (); // may not the best way to indicate 
			}
			
		});		
	}

}