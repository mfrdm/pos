var mongoose = require('mongoose');

var withdraw = function (amount, unit, serviceName){
	var total = amount;
	if (this.amount && this.unit == unit && this.services.indexOf (serviceName) != -1){
		if (amount > this.amount){
			total = amount - this.amount;
			this.amount = 0;
		}
		else if (amount <= this.amount){
			total = 0;
			this.amount = this.amount - amount;
		}
	}
	
	return total;

}

var accountsSchema = new mongoose.Schema({
	codeName: String, // used to add to promocode
	active: {type: Boolean, default: false}, // once active, auto add to occupancies as long as not expired
	amount: Number,
	unit: String,
	services: [String], // name of service applied
	start: Date,
	end: Date,
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