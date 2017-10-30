var moment = require ('moment');
var mongoose = require ('mongoose');
var request = require ('request');
var Accounts = mongoose.model ('Accounts');

module.exports = new AccountsCtrl();

function AccountsCtrl() {
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
		})
	}

	this.prepareWithdraw = function (){

	}

	this.withdraw = function (){

	}

}