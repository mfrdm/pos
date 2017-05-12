var mongoose = require('mongoose');

// redeem price, usage, or total for student
var redeemStudentAccount = function (codes, productName, price){
	var result = {
		price: price
	};

	var studentPrice = {
		'group common': 10000,
		'individual common': 10000,
	};

	var productNames = ['group common', 'individual common', 'medium group private', 'small group private'];

	codes.map (function (code, i, arr){
		code = code.toLowerCase ();
		if (code && code == 'student' && (productName == productNames[0] || productName ==productNames[1])){
			result.price = studentPrice[productName];
		}
	});

	return result;
}

var redeemHourUsage = function (price, productName, usage){
	var newPrice = price;
	var productNames = ['group common', 'individual common', 'medium group private', 'small group private'];
	var discountPrice = {
		'medium group private': 200000,
		'small group private': 120000,
	};

	var rewardHour = 1; // get discount for using above one hour

	usage = usage ? usage : 0;
	productName = productName.toLowerCase ();

	if (usage > rewardHour && (productName == productNames[2] || productName == productNames[3])){
		newPrice = discountPrice[productName];
	}

	return newPrice;
}

// method to convert a value according to a promotion code
// assume code is an array
// assume code values are validated before redeemed
var redeemTotal = function (code, total){
	var newTotal = total;
	code = code ? code.toLowerCase () : code;

	if (code === 'yeugreenspace'){
		newTotal = total * 0.5;
	}

	return newTotal;
};

var redeemPrice = function (code, price){
	return price
}

var redeemUsage = function (code, usage){

	code = code ? code.toLowerCase () : code;

	if (code === 'free1hourcommon'){
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}
	else if (code === 'free2hourscommon'){
		if (usage <= 2) usage = 0;
		else usage = usage - 2;		
	}

	return usage
};

// FIX: Build actual test. This is just an placeholder, and assume no conflict.
// Some codes cannot be used with another. The function checks and return list of conflicts if any
var checkCodeConflict = function (codes){
	codes.map (function (c, i , arr){
		c.conflicted = [];
	});

	return codes
};


// represent all codes that give customer some values like free seat or discount
var promocodesSchema = mongoose.Schema ({
	name: {type: String, required: true},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	desc: {type: String}, // describe what is the promotion about and how to apply
	promoType: {type: Number, default: 1}, // default: apply to one
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],
	conflictCodes: [{name: String, _id: mongoose.Schema.Types.ObjectId}],
	conflicted: [{name: String, _id: mongoose.Schema.Types.ObjectId}], // used temporary when check conflict. Never insert into db.
});

promocodesSchema.statics.redeemPrice = redeemPrice;
promocodesSchema.statics.redeemUsage = redeemUsage;
promocodesSchema.statics.redeemTotal = redeemTotal;
promocodesSchema.statics.checkCodeConflict = checkCodeConflict;
promocodesSchema.statics.redeemStudentAccount = redeemStudentAccount;
promocodesSchema.statics.redeemHourUsage = redeemHourUsage;

module.exports = mongoose.model ('promocodes', promocodesSchema);