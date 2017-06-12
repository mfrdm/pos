var mongoose = require('mongoose');
var Promocodes = mongoose.model ('Promocodes');

function normalizeTotal (total){
	return Math.round(total / 1000) * 1000;
}

function preprocess (){
	deposit = this;
	deposit.quantity = deposit.quantity ? deposit.quantity : 1;
}

var getTotal = function (){
	var deposit = this;
	deposit.preprocess ();

	// the context in strategy design
	var context = {
		productName: 'account',
		price: deposit.account.price,
		quantity: deposit.quantity,
		total: null,
		getServices: function (){ return deposit.account.services },
		getPromocodes: function (){ return deposit.promocodes },
		setPromocodes: function (codes) { deposit.promocodes = codes },
		isStudent: function (){ return deposit.customer.isStudent },	
		getPrice: function (){return this.price},
		getTotal: function (){return this.total},
		getQuantity: function (){return this.quantity},
	}

	Promocodes.preprocessCodes (context);

	if (deposit.promocodes && deposit.promocodes.length){
		deposit.promocodes.map (function (code, k, t){
			var pc = new Promocodes (code);
			var discountedResult = pc.redeem (context);
			Object.assign (context, discountedResult);
		});

		if (context.total){
			deposit.total = context.total;
		}
		else{
			deposit.total = context.price * context.quantity;
		}		
	}
	else{
		deposit.total = deposit.quantity * deposit.account.price;
	}
}

// Represent a pre paid amount of cash or hour usage number. Can be used later to pay for service usage
var DepositsSchema = new mongoose.Schema({
	total: Number,
	quantity: Number,
	account: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		services: mongoose.Schema.Types.Mixed,
		price: Number 
	},
	promocodes: [{
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
		codeType: Number,
		priority: Number,
		redeemData: mongoose.Schema.Types.Mixed
	}],
	paymentMethod: {
		name: String
	},
	customer: { // the person make purchase
		_id: {type: mongoose.Schema.Types.ObjectId},
		isStudent: Boolean,
		fullname: String,
		email: String,
		phone: String,
	},
	location: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		name: String,
	},
	staffId: {type: mongoose.Schema.Types.ObjectId},	
	status: {type: Number, default: 2}, // 1: paid, 2: not paid yet
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
	note: String,
});	

DepositsSchema.methods.getTotal = getTotal;
DepositsSchema.methods.preprocess = preprocess;

module.exports = mongoose.model ('Deposits', DepositsSchema);


