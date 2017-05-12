var mongoose = require('mongoose');

// method to convert a value according to a promotion code
// assume code is an array
// assume code values are validated before redeemed
var redeemPrice = function (code, total){
	return code.reduce (function (acc, x, i, arr){
		var c = x.name.toLowerCase ();
		if (c === 'yeugreenspace'){
			return acc * 0.5;
		}
		else if (c === 'student'){
			return acc * 0.5;
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
});

promocodesSchema.statics.redeemPrice = redeemPrice;
promocodesSchema.statics.redeemUsage = redeemUsage;

module.exports = mongoose.model ('promocodes', promocodesSchema);