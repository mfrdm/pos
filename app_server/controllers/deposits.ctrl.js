var validator = require ('validator');
var mongoose = require ('mongoose');
var Deposits = mongoose.model ('Deposits');
var Accounts = mongoose.model ('Accounts');
var Customers = mongoose.model ('customers');
var moment = require ('moment');

module.exports = new DepositsCtrl();

function DepositsCtrl (){
	this.createOneDeposit = function (req, res, next){
		
		var account = new Accounts (req.body.account);
		account.init ();

		Accounts.save (function (err, newAcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			Customers.update ({_id: req.body.customer._id}, {$push: {accounts: newAcc._id}}, function (err, result){
				if (err){
					console.log (err);
					next (err);
					return
				}

				deposit.account = newAcc;

				Deposits.create (deposit, function (err, newDeposit){
					if (err){
						console.log (err);
						next (err);
						return
					}

					res.json ({data: {message: 'success'}})
					
				});

			})

		});


	}

	this.updateOneDeposit = function (req, res, next){

	}

	this.readDepositsByCustomerId = function (req, res, next){
		// later
	}

	this.readDefaultAccounts = function (req, res, next){
		var defaultAcc = Accounts.getDefaultAccounts ();
		res.json ({data: defaultAcc});
	}

	this.readInvoice = function (req, res, next){
		var deposit = JSON.parse (req.query.deposit);
		deposit = new Deposits (deposit);
		deposit.getTotal ();
		res.json ({data: deposit});

	}

}