var mongoose = require('mongoose');
var Promocodes = require ('NewPromocodes');

var addDefaultCodes = function (){

}

var getTotal = function (){

}

// Represent a pre paid amount of cash or hour usage number. Can be used later to pay for service usage
var depositsSchema = new mongoose.Schema({
	total: Number,
	orderline: [
		{
			account: mongoose.Schema.Types.Mixed,
			start: {type: Date, default: Date.now},
			end: Date,
			receiver: {_id: type: mongoose.Schema.Types.ObjectId}, // customer who receives the account
		}
	],
	promocodes: [
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
		codeType: Number,
		priority: Number,
		redeemData: {
			price: { value: Number, formula: String },
			usage: { value: Number, formula: String },
			total: { value: Number, formula: String }
		}		
	],
	paymentMethod: {
		name: String
	},
	customer: { // the person make purchase
		_id: {type: mongoose.Schema.Types.ObjectId, ref: 'customers'}
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

depositsSchema.methods.withdraw = withdraw;
depositsSchema.methods.discount = discount;

module.exports = mongoose.model ('deposits', depositsSchema);


