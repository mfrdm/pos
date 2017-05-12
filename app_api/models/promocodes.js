var mongoose = require('mongoose');

// method to convert a value according to a promotion code
// assume code is an array
// assume code values are validated before redeemed
var redeemPrice = function (code, total, productname){
	var productNames = ['group common', 'individual common', 'medium group private', 'small group private'];	
	productname = productname ? productname.toLowerCase () : null;
	return code.reduce (function (acc, x, i, arr){
		var c = x.name.toLowerCase ();
		if (c === 'yeugreenspace'){
			return acc * 0.5;
		}
		else if (c === 'student' && (productname == productNames[0] || productname == productNames[1])){
			return acc * (2/3);
		}
		else {
			// throw new Error ('Invalid code');
			return acc
		}
	}, total);
}

var redeemUsage = function (code, usage){
	return code.reduce (function (acc, x, i, arr){
		var c = x.name.toLowerCase ();
		if (c === 'free1hourcommon'){
			if (usage < 1) return 0
			else return usage - 1;
		}
		else if (c === 'free2hourscommon'){
			if (usage < 2) return 0
			else return usage - 2;
		}
		else {
			// throw new Error ('Invalid code');
			return acc
		}
	}, usage);
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
promocodesSchema.statics.checkCodeConflict = checkCodeConflict;

module.exports = mongoose.model ('promocodes', promocodesSchema);