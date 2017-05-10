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

// not actually code. But discount when meet condition, checked programmatically
var discount = function (code, product){
	if (code.toLowerCase () === 'student'){
		var name = product.productName;
		
		// if (name === 'group common' || name === 'individual common'){
		if (name == "Phòng Chung Dành Cho Cá Nhân" || name == "Phòng Chung Dành Cho Nhóm"){
			return 10000
		}
		else{
			return product.price
		}
	}
	return product.price
}

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

promocodesSchema.statics.redeem = redeem;
promocodesSchema.statics.discount = discount;

module.exports = mongoose.model ('promocodes', promocodesSchema);