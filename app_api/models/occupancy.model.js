var mongoose = require('mongoose');
var Promocodes = mongoose.model ('promocodes');
var moment = require ('moment');

var productNames = ['group common', 'individual common', 'medium group private', 'small group private']; // FIX: avoid hardcode

function normalizeTotal (total){
	return Math.round(total / 1000) * 1000;
}

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

function getTotal (){
	var occ = this;
	occ.usage = occ.usage ? occ.usage : occ.getUsageTime ();

	if (occ.parent){
		occ.total = 0;
	}
	else{
		// add default codes
		Promocodes.addDefaultCodes (occ);
		
		if (occ.promocodes && occ.promocodes.length){
			
			// sort to prioritize codes applied
			occ.promocodes = occ.promocodes.sort (function (code1, code2){
				return code1.codeType > code2.codeType;
			});

			occ.promocodes.map (function (code, k, t){
				
				if (code.codeType == 1){
					occ.usage = Promocodes.redeemUsage (code.name, occ.usage);
				}

				if (code.codeType == 2){
					occ.service.price = Promocodes.redeemPrice (code.name, occ.service.price, occ.service.name);
				}

				// Important to get subtotal before redeem total
				occ.total = occ.service.price * occ.usage;

				if(code.codeType == 3){
					occ.total = Promocodes.redeemTotal (code.name, occ.total);
				}
				else if (code.codeType == 4){
					occ.total = Promocodes.redeemMixed (code.name, occ.usage, occ.service.price, occ.service.name)
				}

			});
		}
		else {
			occ.total = occ.service.price * occ.usage;
		}

		occ.total = normalizeTotal (occ.total);					
	}	
}

var OccupancySchema = new mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId},
	total: {type: Number, min: 0, default: 0},
	usage: {type: Number, min: 0}, // in hour
	paymentMethod: Number, // required. card, cash, account
	parent: mongoose.Schema.Types.ObjectId, // id of parent occ. used for group private
	checkinTime: {type: Date, default: Date.now},
	checkoutTime: {type: Date},	
	service: {
		price: {type: Number, required: true},
		name: {type: String, required: true},
		quantity: {type: Number},
	},
	promocodes: [{
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
		codeType: Number,
	}], // expect only one code applied at a time
	orders: [mongoose.Schema.Types.ObjectId], // id of occ
	customer: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		fullname: {type: String},
		phone: {type: String},
		email: {type: String}, // optional. added if exists
		isStudent: {type: Boolean},
	},
	location: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		name: String,
	},
	staffId: {type: mongoose.Schema.Types.ObjectId},	
	status: {type: Number, default: 1}, // 1: checked in, 2: paid and checked out, 3: cancel
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
	bookingId: {type: mongoose.Schema.Types.ObjectId}, // if any
	note: String, // note if something unexpected happens
});

OccupancySchema.methods.getUsageTime = getUsageTime;
OccupancySchema.methods.getTotal = getTotal;

module.exports = mongoose.model ('occupancy', OccupancySchema);