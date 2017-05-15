var mongoose = require('mongoose');
var Promocodes = mongoose.model ('promocodes');
var moment = require ('moment');

// method to calculate total usage time
// below 6 mins, return as 0.
function getUsageTime (){
	var checkoutTime = moment (this.checkoutTime);
	var checkinTime = moment(this.checkinTime);
	var diff = checkoutTime.diff (checkinTime, 'minutes');
	return normalizeUsage (diff);
}

// unit of usage: minutes
function normalizeUsage (diff){
	var minMin = 0.1; // minimum hour
	var mod = diff % 60;
	var quotient = (diff - mod) / 60;
	var tenths = mod / 60;
	var tenthsFixed = Number(tenths.toFixed(1));
	var usage;

	if (quotient > 0){
		usage = (quotient + tenthsFixed);
	}
	else if (quotient == 0 && tenths < minMin) {
		usage = 0;
	}
	else {
		usage = 1;
	}

	return usage;
}

function getSubTotal () {
	this.usage = this.usage ? this.usage : this.getUsageTime ();
	var order = this;
	var productNames = ['group common', 'individual common', 'medium group private', 'small group private']; // FIX: avoid hardcode
	
	this.orderline.map (function (x, i, arr){
		var subTotal;


		var pn = x.productName.toLowerCase ();

		if (productNames.indexOf (pn) != -1){
			if (order.parent){
				subTotal = 0;
			}
			else{
				if (x.promocodes.length){
					x.promocodes.map (function (code, k, t){

						if (code.codeType == 1){
							order.usage = Promocodes.redeemUsage (code.name, order.usage);
						}

						if (code.codeType == 2){
							x.price = Promocodes.redeemPrice (code.name, x.price, pn);
						}

						// Important to get subtotal before redeem total
						subTotal = x.price * order.usage;

						if(code.codeType == 3){
							subTotal = Promocodes.redeemTotal (code.name, subTotal);
						}
						else if (code.codeType == 4){
							subTotal = Promocodes.redeemMixed (code.name, order.usage, x.price, pn)
						}

					});
				}
				else {
					subTotal = x.price * order.usage;
				}					
			}

		}
		else{
			subTotal = x.price * x.quantity;
		}

		x.subTotal = subTotal;
	});
}

// Assume at calling time, this.total is null
function getTotal (){
	var order = this;
	order.total = 0;

	order.orderline.map (function (x, i, arr){
		order.total += x.subTotal;
	});	

}

var combosSchema = new mongoose.Schema({
	name: String,
	usage: Number, // percentage
	createdAt: {type: Date, default: Date.now},
}); 

var ordersSchema = new mongoose.Schema({
	total: {type: Number, min: 0},
	usage: {type: Number, min: 0}, // in hour
	paymentMethod: Number, // required. card, cash, account
	parent: mongoose.Schema.Types.ObjectId, // id of parent order. used for group private
	checkinTime: {type: Date, default: Date.now},
	checkoutTime: {type: Date},	
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
		subTotal: {type: Number, min: 0},	
	}],
	customer: {
		_id: {type: mongoose.Schema.Types.ObjectId, required: true},
		firstname: {type:String, required: true},
		middlename: {type:String},
		lastname: {type:String, required: true},
		phone: {type: String, required: true},
		email: {type: String}, // optional. added if exists
	},
	storeId: {type: mongoose.Schema.Types.ObjectId, required: true},
	staffId: {type: mongoose.Schema.Types.ObjectId, required: true},	
	status: {type: Number, default: 1}, // 1: checked in, 2: paid and checked out, 3: cancel
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}]
});

ordersSchema.methods.getUsageTime = getUsageTime;
ordersSchema.methods.getTotal = getTotal;
ordersSchema.methods.getSubTotal = getSubTotal;

module.exports = mongoose.model ('orders', ordersSchema);