var mongoose = require('mongoose');
var Promocodes = mongoose.model ('promocodes');
var moment = require ('moment');

function normalizeTotal (total){
	return Math.round(total / 1000) * 1000;
}

function getSubTotal (){
	var order = this;
	order.orderline.map (function (x, i, arr){
		x.subTotal = x.price * x.quantity;
	});
}

// Assume at calling time, this.total is null
function getTotal (){
	var order = this;
	order.total = 0;

	order.orderline.map (function (x, i, arr){
		order.total += x.subTotal;
	});	

	order.total = normalizeTotal (order.total);
};

var ordersSchema = new mongoose.Schema({
	total: {type: Number, min: 0, default: 0},
	paymentMethod: Number, // required. card, cash, local account
	occupancyId: mongoose.Schema.Types.ObjectId,
	orderline: [{
		_id: {type: mongoose.Schema.Types.ObjectId, required: true},
		productName: {type: String, required: true},
		quantity: {type: String, default: 1, required: true},
		price: {type: Number, required: true},
		promocodes: [{
			_id: mongoose.Schema.Types.ObjectId,
			name: String,
			codeType: Number,
		}], // expect only one code applied at a time
		subTotal: {type: Number, min: 0, default: 0},	
	}],
	customer: {
		_id: {type: mongoose.Schema.Types.ObjectId, required: true},
		fullname: {type:String},
		phone: {type: String, required: true},
		email: {type: String}, // optional. added if exists
	},
	location: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		name: String,
	},
	staffId: {type: mongoose.Schema.Types.ObjectId, required: true},	
	status: {type: Number, default: 2}, // 1: paid, 2: not paid yet
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
	note: String,
});

ordersSchema.methods.getTotal = getTotal;
ordersSchema.methods.getSubTotal = getSubTotal;

module.exports = mongoose.model ('orders', ordersSchema);