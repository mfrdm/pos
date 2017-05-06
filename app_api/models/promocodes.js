var mongoose = require('mongoose');

// method to convert a value according to a promotion code
var redeem = function (code, val){
	if (code.toLowerCase () == 'yeugreenspace'){
		return Number((val * 0.5).toFixed(1))
	}
	else{ // not found any code
		return val
	}
}

var promocodesSchema = mongoose.Schema ({
	name: {type: String, required: true},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	desc: {type: String}, // describe what is the promotion about and how to apply
	promoType: {type: Number, default: 1}, // default: apply to one
	createdAt: {type: Date, default: Date.now},
});

promocodesSchema.statics.redeem = redeem;

module.exports = mongoose.model ('promocodes', promocodesSchema);