var mongoose = require('mongoose');
var Promocodes = mongoose.model ('Promocodes');

function normalizeTotal (total){
	return Math.round(total / 1000) * 1000;
}

function getContext (){
	var deposit = this;
	var minGrouponNumber = 3; // IMPORTANT

	return {
		productName: 'account',
		price: deposit.account.price,
		quantity: deposit.quantity,
		total: null,
		getAccount: function (){return deposit.account.name },
		getServices: function (){ return deposit.account.services },
		getPromocodes: function (){ return deposit.promocodes },
		setPromocodes: function (codes) { deposit.promocodes = codes },
		isStudent: function (){ return deposit.customer.isStudent },
		isGroupon: function (){ return deposit.groupon && deposit.groupon.quantity && deposit.groupon.quantity >= minGrouponNumber ? true : false },	
		getGroupMemberNumber: function (){ return this.isGroupon () ? deposit.groupon.quantity : 0},
		getPrice: function (){return this.price},
		getTotal: function (){return deposit.total},
		getQuantity: function (){return this.quantity},
		setTotal: function (total){deposit.total = total},
	}	
} 

var prepare = function (){
	var groupQuantityMin = 3;
	if (this.groupon && !this.groupon.leaderId && this.groupon.quantity >= groupQuantityMin){
		this.groupon.isLeader = true;
		this.groupon.leaderId = this._id;
	}
}

var getTotal = function (){
	var deposit = this;

	// the context in strategy design
	var context = deposit.getContext ();

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
	quantity: {type: Number, default: 1}, // not use yet. Default is one
	groupon:{
		isLeader: {type: Boolean, default: false},
		quantity: Number, // number of members. May not accurate. Better query the _id to get price number of member if needed
		leaderId: {type: mongoose.Schema.Types.ObjectId, ref: 'customers'}
	},
	account: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		services: mongoose.Schema.Types.Mixed,
		price: Number,
		name: String
	},
	promocodes: [{
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
		codeType: Number,
		priority: Number,
		redeemData: mongoose.Schema.Types.Mixed
	}],
	paymentMethod: [{
		_id: mongoose.Schema.Types.ObjectId, // for account and other methods. Not cash
		name: {type: String}, // cash, card, account, ...
		paidTotal: Number, // total paid using the account
		paidAmount: Number, // amount withdraw from an account
	}],
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
DepositsSchema.methods.getContext = getContext;
DepositsSchema.methods.prepare = prepare;

module.exports = mongoose.model ('Deposits', DepositsSchema);


