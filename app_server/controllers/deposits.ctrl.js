var validator = require ('validator');
var mongoose = require ('mongoose');
var Deposits = mongoose.model ('Deposits');
var Accounts = mongoose.model ('Accounts');
var Customers = mongoose.model ('customers');
var moment = require ('moment');

module.exports = new DepositsCtrl();

function DepositsCtrl (){
	this.createOneDeposit = function (req, res, next){
		var deposit = req.body.data;
		var account = new Accounts (deposit.account);
		account.customer = {
			_id: deposit.customer._id
		}

		account.initAccount ();

		account.save (function (err, newAcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			Customers.update ({_id: deposit.customer._id}, {$push: {accounts: newAcc._id}}, function (err, result){
				if (err){
					console.log (err);
					next (err);
					return
				}

				deposit.account = newAcc;
				deposit.status = 1; // paid

				Deposits.create (deposit, function (err, newDeposit){
					if (err){
						console.log (err);
						next (err);
						return
					}

					// Don't add up if not cash account
					if (newAcc['label']['en'] != 'Cash'){
						if (deposit.paymentMethod.length){
							Accounts.update ({_id: deposit.paymentMethod[0]._id}, {$inc: {amount: - deposit.paymentMethod[0].paidAmount}}, function (err, result){
								if (err){ // FIX: this should undo everything
									next (err);
									return
								}

								res.json ({data: {message: 'success', _id: newDeposit._id}});
								return;															
							});

							return;
						}

						res.json ({data: {message: 'success', _id: newDeposit._id}});
						return;
					}

					// Expecte to find at most one cash account available
					Accounts.findOneAndUpdate ({'label.en': 'Cash', 'amount': {$gt: 0}, end: {$gte: moment()}, _id: {$not: {$in: [newAcc._id]}}, 'customer._id': deposit.customer._id}, {$set: {amount: 0}}, {new: false, fields: {'amount': 1}}, function (err, previousAccount){
						if (err){
							next (err);
							return;
						}

						if (previousAccount){
							Accounts.update ({_id: newAcc._id}, {$inc: {amount: previousAccount.amount}}, function (){
								if (err){
									next (err);
									return;
								};

								if (deposit.paymentMethod.length){
									Accounts.update ({_id: deposit.paymentMethod[0]._id}, {$inc: {amount: - deposit.paymentMethod[0].paidAmount}}, function (err, result){
										if (err){ // FIX: this should undo everything
											next (err);
											return
										}

										res.json ({data: {message: 'success', _id: newDeposit._id}});
										return;															
									});

									return;
								}

								res.json ({data: {message: 'success', _id: newDeposit._id}})
								return;
							});
						}
						else{
							if (deposit.paymentMethod.length){
								Accounts.update ({_id: deposit.paymentMethod[0]._id}, {$inc: {amount: - deposit.paymentMethod[0].paidAmount}}, function (err, result){
									if (err){ // FIX: this should undo everything
										next (err);
										return
									}

									res.json ({data: {message: 'success', _id: newDeposit._id}});
									return;															
								});

								return;
							}

							res.json ({data: {message: 'success', _id: newDeposit._id}})
							return;
						}
					});
				});

			})

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
							remain: foundAcc.amount							
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