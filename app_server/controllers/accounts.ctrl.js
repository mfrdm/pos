var moment = require ('moment');
var mongoose = require ('mongoose');
var request = require ('request');
var Accounts = mongoose.model ('Accounts');

module.exports = new AccountsCtrl();

function AccountsCtrl() {
	this.createAccount = function (req, res, next, cb){
		var acc = new Accounts (req.body.acc);
		acc.initAccount ();
		acc.save (function (err, newAcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (cb){
				cb (newAcc);
			}
			else{
				res.json ({data: newAcc});
			}						
		});
	};

	this.getAccounts = function (req, res, next, cb){
		var condition = {
			'customer._id': req.query.customerId,
			end: {$gte: new Date ()},
			services: req.query.service, 
			$or: [
				{$and: [{amount: {$gt: 0}}, {'recursive.isRecursive': false}]}, 
				{$and: [{'recursive.isRecursive': true}, {$where: 'this.recursive.renewNum < this.recursive.maxRenewNum'}]},
				{$and: [{'recursive.isRecursive': true}, {amount: {$gt: 0}}, {$where: 'this.recursive.renewNum == this.recursive.maxRenewNum'}]}, // renewNum cannot be greater than maxRenewNum!
			]
		};
		
		Accounts.find (condition, function (err, foundAcc){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			foundAcc.map (function (x, i, arr){
				if (x.recursive.isRecursive){
					x.renew (); // No need to update yet. Only update after being used!
				}
			})

			if (cb){
				cb (foundAcc);
			}
			else{
				res.json ({data: foundAcc});
			}
		});
	}

	this.prepareWithdraw = function (){
	}

	this.withdraw = function (req, res, next, cb){
		var acc = req.body.acc;
		if (!acc){
			if (cb){
				cb (null);
			}
			else{
				next ();
			}
			return;
		}

		acc = new Accounts (acc);
		var condition = {_id: acc._id};
		var update = {
			$set: {
				amount: acc.amount,
			}
		};

		if (acc.recursive) update.$set.recursive = acc.recursive;

		if (!acc.activate){
			acc.activate = true;
			acc.initAccount ();
			update.$set.activate = true;
			update.$set.start = acc.start;
			update.$set.end = acc.end;
		}

		Accounts.update (condition, update, function (err, result){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (cb){
				cb (result);
			}
			else{
				res.json ({data: result});
			}

		});
	};

	this.withdrawCash = function (req, res, next, cb){
		var acc = req.body.acc;
		var deposit = req.body.deposit;
		if (!acc){
			if (cb){
				cb (null);
			}
			else{
				next ();
			}
			return;
		}

		var condition = {_id: acc._id};
		var update = {$inc: {amount: deposit.account.amount}};

		if (!acc.activate){
			update.$set = {
				activate: true,
				start: deposit.account.start,
				end: deposit.account.end,
			}
		}

		Accounts.findOneAndUpdate (condition, update, function (err, updatedAcc){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (cb){
				cb (updatedAcc);
			}
			else{
				res.json ({data: updatedAcc});
			}

		});		
	}

	this.depositCash = function (req, res, next, cb){
		var acc = req.body.acc;
		var deposit = req.body.deposit;
		if (!acc){
			if (cb){
				cb (null);
			}
			else{
				next ();
			}
			return;
		}

		var condition = {_id: acc._id};
		var update = {
			$inc: {amount: deposit.account.amount},
			$set:{
				price: deposit.account.price,
				services: deposit.account.services,
				start: deposit.account.start, 
				end: deposit.account.end,
				expireDateNum: deposit.account.expireDateNum
			}
		};

		Accounts.findOneAndUpdate (condition, update, {new: true}, function (err, updatedAcc){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (cb){
				cb (updatedAcc);
			}
			else{
				res.json ({data: updatedAcc});
			}

		});			
	}

	this.findCashAccount = function (req, res, next, cb){
		var condition = {
			'customer._id': req.body.acc.customer._id,
			name: 'cash',
			end: {$gte: new Date ()},
		}

		Accounts.findOne (condition, function (err, foundAcc){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (cb){
				cb (foundAcc);
			}
			else{
				res.json ({data: foundAcc});
			}						
		})

	}

}