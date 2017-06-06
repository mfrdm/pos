var mongoose = require('mongoose');

var withdraw = function (amount, unit, serviceName){
	var remain = amount;
	var deposit = this;
	serviceName = serviceName ? serviceName.toLowerCase () : '';
	
	if (deposit.account.amount && deposit.account.unit == unit && (deposit.account.services.indexOf (serviceName) != -1 || deposit.account.services.indexOf('all'))){
		if (amount > deposit.account.amount){
			remain = amount - deposit.account.amount;
			deposit.account.amount = 0;
		}
		else if (amount <= deposit.account.amount){
			remain = 0;
			deposit.account.amount = deposit.account.amount - amount >= 0 ? Number((deposit.account.amount - amount).toFixed(1)) : 0;
		}
	}
	
	return remain;
}

var discount = function (){
	var deposit = this;

	if (this.account.name == 'combo24h1d_common'){
		if (deposit.customer.isStudent){
			var prices = [this.account.price, 59000, 59000, 49000, 49000, 39000]; // order depends on member number
		}
		else{
			var prices = [this.account.price, 79000, 79000, 69000, 69000, 59000];	
		}

		if (deposit.parent.memNumber < prices.length){
			this.account.price = prices[deposit.parent.memNumber];
		}
		else{
			this.account.price = prices[prices.length - 1];
		}		
	}
	else if (this.account.name == 'combo3h1d1m_common'){
		// later
	}
}

// Represent a pre paid amount of cash or hour usage number. Can be used later to pay for service usage
var depositsSchema = new mongoose.Schema({
	account: mongoose.Schema.Types.Mixed, // insert all account data here
	start: Date,
	end: Date,	
	parent: {
		_id: {type: mongoose.Schema.Types.ObjectId}, // id of leader of the group that deposite together
		memNumber: Number, // number of members in the group
	},
	paymentMethod: {
		name: String
	},
	customer: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		isStudent: {type: Boolean},	
	},
	location: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		name: String,
	},
	staffId: {type: mongoose.Schema.Types.ObjectId},	
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
});	

depositsSchema.methods.withdraw = withdraw;
depositsSchema.methods.discount = discount;

module.exports = mongoose.model ('deposits', depositsSchema);


