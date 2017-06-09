var mongoose = require('mongoose');
var Promocodes = mongoose.model ('NewPromocodes');
var moment = require ('moment');

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
// FIX: keep all number after decimal point. No need to keep only the the tenth. Present in client in different way
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
	else if (quotient == 0 && tenths >= minMin){
		usage = 1;
	}

	return usage;
}

// get usage and total after applied codes
function getTotal (){
	var occ = this;
	occ.usage = occ.usage || occ.usage == 0 ? occ.usage : occ.getUsageTime ();

	if (occ.parent){
		occ.total = 0;
	}

	else{
		// the context in strategy design
		var context = {
			productName: 'service',
			price: occ.service.price,
			usage: occ.usage,
			total: null,
			getService: function (){ return occ.service.name.toLowerCase() },
			getUsage: function (){ return this.usage },
			getPrice: function (){return this.price},
			getTotal: function (){return this.total},
			getPromocodes: function (){ return occ.promocodes },
			setPromocodes: function (codes){ occ.promocodes = codes },
			isStudent: function (){ return occ.customer.isStudent }
		}		

		Promocodes.preprocessCodes (context);

		// assume, at this point codes are validate and good to use

		if (occ.promocodes && occ.promocodes.length){
			occ.promocodes.map (function (code, k, t){
				var pc = new Promocodes (code);
				var discountedResult = pc.redeem (context);
				Object.assign (context, discountedResult);
			});

			if (context.total){
				occ.total = context.total;
			}
			else{
				occ.total = context.price * context.usage;
			}

		}
		else {
			occ.total = occ.service.price * occ.usage;
		}

		occ.total = normalizeTotal (occ.total);	

	}	
}


var NewOccupanciesSchema = new mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId},
	total: {type: Number, min: 0},
	usage: {type: Number, min: 0},
	paymentMethod: [{
		_id: mongoose.Schema.Types.ObjectId, // for account and other methods. Not cash
		name: {type: String}, // cash, card, account, ...
		paid: Number, // amount paid using the account
	}],
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
		priority: Number,
		redeemData: mongoose.Schema.Types.Mixed,		
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

NewOccupanciesSchema.methods.getUsageTime = getUsageTime;
NewOccupanciesSchema.methods.getTotal = getTotal;

module.exports = mongoose.model ('NewOccupancies', NewOccupanciesSchema);