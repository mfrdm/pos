var validator = require ('validator');
var mongoose = require ('mongoose');
var Accounts = mongoose.model ('accounts');
var Customers = mongoose.model ('customers');
var moment = require ('moment');

module.exports = new AccountCtrl();

function AccountCtrl (){
	this.createOneAccount = function (req, res, next){
		var acc = new Accounts (req.body.data);

		acc.save (function (err, newAcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			Customers.findOneAndUpdate ({_id: newAcc.customer._id}, {$push: {accounts: newAcc._id}}, function (err, updatedCus){
				if (err){
					console.log (err);
					next (err);
					return
				}
				
				if (updatedCus){
					res.json ({data: newAcc});
				}	
				else{
					next ();
				}
			});

		});
	}

	this.updateOneAccount = function (req, res, next){

	}

	this.readAccountsByCustomerId = function (req, res, next){
		// later
	}

}