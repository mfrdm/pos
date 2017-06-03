var mongoose = require('mongoose');

var withdraw = function (amount, unit, serviceName){
	var remain = amount;
	serviceName = serviceName ? serviceName.toLowerCase () : '';
	if (this.amount && this.unit == unit && (this.services.indexOf (serviceName) != -1 || this.services.indexOf('all'))){
		if (amount > this.amount){
			remain = amount - this.amount;
			this.amount = 0;
		}
		else if (amount <= this.amount){
			remain = 0;
			this.amount = this.amount - amount >= 0 ? Number((this.amount - amount).toFixed(1)) : 0;
		}
	}
	
	return remain;
}

var to1Decimal = function (x){
	return Number((x).toFixed(1));
}

var deposite = function (){
	// may not need this function 
}

var accountsSchema = new mongoose.Schema({
	active: {type: Boolean, default: false}, // once active, auto add to occupancies as long as not expired
	amount: {type: Number, get: to1Decimal},
	unit: String,
	services: [String], // name of service applied
	start: Date,
	end: Date,
	label: {
		vn: String,
		en: String,
	},
	paymentMethod: {
		name: String,
	},
	customer: {
		_id: {type: mongoose.Schema.Types.ObjectId}	
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

accountsSchema.methods.withdraw = withdraw;

module.exports = mongoose.model ('accounts', accountsSchema);


