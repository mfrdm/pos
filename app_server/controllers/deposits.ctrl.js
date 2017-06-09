var validator = require ('validator');
var mongoose = require ('mongoose');
var Deposits = mongoose.model ('Deposits');
var Customers = mongoose.model ('customers');
var moment = require ('moment');

module.exports = new DepositsCtrl();

function DepositsCtrl (){
	this.createOneDeposit = function (req, res, next){
		var deposit = new Deposits (req.body.data);

		deposit.save (function (err, newDeposit){
			if (err){
				console.log (err);
				next (err);
				return
			}

			Customers.findOneAndUpdate ({_id: newDeposit.customer._id}, {$push: {accounts: newDeposit._id}}, function (err, updatedCus){
				if (err){
					console.log (err);
					next (err);
					return
				}
				
				if (updatedCus){
					res.json ({data: newDeposit});
				}	
				else{
					next ();
				}
			});

		});
	}

	this.updateOneDeposit = function (req, res, next){

	}

	this.readDepositsByCustomerId = function (req, res, next){
		// later
	}

}