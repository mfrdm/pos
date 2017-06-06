var mongoose = require('mongoose');
var moment = require ('moment');

var renew = function (acc){
	var today = moment ().hour (0).minute (0);
	if (acc.recursive && acc.recursive.isRecursive){
		if (acc.recursive.recursiveType == 1){
			if (moment (acc.recursive.lastRenew) >= today){
				return 
			}
			else {
				acc.amount = acc.recursive.baseAmount;
				acc.lastRenew = moment ();
			}			
		}
	}
}


// Represent a pre paid amount of cash or hour usage number. Can be used later to pay for service usage
var accountsSchema = new mongoose.Schema({
	name: String,
	price: Number, // 
	amount: Number,
	unit: String,
	services: [String], // name of service applied
	label: {
		vn: String,
		en: String,
	},
	recursive: {
		isRecursive: {type: Boolean, default: false},
		lastRenew: Date,
		recursiveType: {type: Number}, // daily: 1, monthly: 2, annually: 3
		baseAmount: Number
	},
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
});	

accountsSchema.statics.renew = renew;

module.exports = mongoose.model ('accounts', accountsSchema);


