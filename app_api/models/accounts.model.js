var mongoose = require('mongoose');
var moment = require ('moment');

var renew = function (){
	var acc = this;
	var today = moment ().hour (0).minute (0);
	if (acc.recursive && acc.recursive.isRecursive && (acc.recursive.renewNum < acc.recursive.maxRenewNum)){
		if (acc.recursive.recursiveType == 1){
			if (moment (acc.recursive.lastRenewDate) >= today){
				return 
			}
			else {
				acc.amount = acc.recursive.baseAmount;
				acc.lastRenew = moment ();
				acc.recursive.renewNum++;
			}			
		}
	}
}

// default solution
var _withdraw = function (amount, acc){
	var remain = amount;

	if (amount > acc.amount){
		remain = amount - acc.amount;
		acc.amount = 0;
	}
	else if (amount <= acc.amount){
		remain = 0;
		acc.amount = acc.amount - amount >= 0 ? acc.amount - amount : 0;
	}

	return remain;
}

// return the remain to be paid
var withdraw = function (amount){
	return _withdraw (amount, this);
}

// Represent a pre paid amount of cash or hour usage number. Can be used later to pay for service usage
var AccountsSchema = new mongoose.Schema({
	name: String,
	price: Number, // 
	amount: Number,
	unit: String,
	desc: String,
	services: [String], // name of service applied
	label: {
		vn: String,
		en: String,
	},
	recursive: {
		isRecursive: {type: Boolean, default: false},
		lastRenewDate: Date,
		renewNum: {type: Number, default: 0}, // number of renew
		maxRenewNum: Number, // 
		recursiveType: {type: Number}, // daily: 1, monthly: 2, annually: 3
		baseAmount: Number
	},
	start: Date,
	end: Date,
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
});	

AccountsSchema.methods.renew = renew;
AccountsSchema.methods.withdraw = withdraw;

module.exports = mongoose.model ('Accounts', AccountsSchema);


