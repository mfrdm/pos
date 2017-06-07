var mongoose = require('mongoose');
var NewPromocodes = mongoose.model ('NewPromocodes');
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
		occ.promocodes = NewPromocodes.resolveConflict (occ.promocodes);
		occ.addDefaultCodes ();
		occ.promocodes.sort (function (code1, code2){
			return code1.codeType > code2.codeType;
		});

		var discountResult = {
			usage: occ.usage,
			price: occ.service.price,
			total: null,
		}

		// assume, at this point codes are validate and good to use

		if (occ.promocodes && occ.promocodes.length){
			occ.promocodes.map (function (code, k, t){
				var pc = new NewPromocodes (code);
				var newResult = pc.redeem (discountResult.price, discountResult.usage);
				Object.assign (discountResult, newResult);
			});

			if (discountResult.total){
				occ.total = discountResult.total;
			}
			else{
				occ.total = discountResult.price * discountResult.usage;
			}

		}
		else {
			occ.total = occ.service.price * occ.usage;
		}

		occ.total = normalizeTotal (occ.total);	

	}	
}

// Auto add codes when meet conditions
// FIX
var addDefaultCodes = function (){
	var occ = this;
	var service = occ.service.name.toLowerCase ();
	var usage = occ.usage;
	occ.promocodes = occ.promocodes ? occ.promocodes : [];
	var defaultCodes = NewPromocodes.getDefaultCodes ();

	// check if there any any code of the same type but higher priority
	var higherType1 = false;
	var higherType2 = false;
	var higherType3 = false;
	var basePriority = 1;

	occ.promocodes.map (function (x, i, arr){
		if (x.codeType == 1 && x.priority > basePriority){
			higherType1 = true;
		}
		else if (x.codeType == 2 && x.priority > basePriority){
			higherType2 = true;
		}
		else if (x.codeType == 3 && x.priority > basePriority){
			higherType3 = true;
		}
	});

	// student price code
	if (!higherType2 && occ.customer.isStudent && (defaultCodes ['studentprice'].services.indexOf (service) != -1)){
		occ.promocodes.push (defaultCodes ['studentprice']);
	}

	// discount price for small group private
	if (!higherType3 && usage > 1 && (defaultCodes ['smallprivatediscountprice'].services.indexOf (service) != -1)){
		occ.promocodes.push (defaultCodes ['smallprivatediscountprice']);
	}

	// discount price for medium group private
	if (!higherType3 && usage > 1 && (defaultCodes ['mediumprivatediscountprice'].services.indexOf (service) != -1)){
		occ.promocodes.push (defaultCodes ['mediumprivatediscountprice']);
	}

	// discount price for large group private
	if (!higherType3 && usage > 1 && (defaultCodes ['largeprivatediscountprice'].services.indexOf (service) != -1)){
		occ.promocodes.push (defaultCodes['largeprivatediscountprice']);
	}
}

var NewOccupanciesSchema = new mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId},
	total: {type: Number, min: 0},
	usage: {type: Number, min: 0},
	paymentMethod: [{
		methodId: mongoose.Schema.Types.ObjectId, // for account and other methods. Not cash
		name: {type: String}, // cash, card, account, ...
		amount: Number, // may exist or not depending on the type of method
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
		redeemData: {
			price: { value: Number, formula: String },
			usage: { value: Number, formula: String },
			total: { value: Number, formula: String }
		}		
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
NewOccupanciesSchema.methods.addDefaultCodes = addDefaultCodes;

module.exports = mongoose.model ('NewOccupancies', NewOccupanciesSchema);