var mongoose = require('mongoose');
var moment = require ('moment');

var validateCodes = function (){
}

// use temporary
var getDefaultCodes = function (){
	var studendPrice = {
		name: 'studentprice',
		desc: {type: 'Price of common service for students'},
		label: {
			vn: 'Giá cho sinh viên',
			en: 'Student price',
		},	
		codeType: 2,
		services: ['group common', 'individual common'],
		priority: 1,
		redeemData: {
			price: {
				value: 10000
			}
		}			
	}

	var smallPrivateDiscountPrice = {
		name: 'smallprivatediscountprice',
		desc: {type: 'Discount the price for small private service after the first hour'},
		label: {
			vn: 'Giảm giá sau giờ đầu',
			en: 'Private discount after first hour',
		},	
		codeType: 3,
		services: ['small group private'],
		priority: 1,
		redeemData: {
			total: {
				value: 120000,
				formula: 1
			}
		}			
	}

	var mediumPrivateDiscountPrice = {
		name: 'mediumprivatediscountprice',
		desc: {type: 'Discount the price for medium private service after the first hour'},
		label: {
			vn: 'Giảm giá sau giờ đầu',
			en: 'Private discount after first hour',
		},	
		codeType: 3,
		services: ['medium group private'],
		priority: 1,
		redeemData: {
			total: {
				value: 200000,
				formula: 1
			}
		}			
	};

	var largePrivateDiscountPrice = {
		name: 'largeprivatediscountprice',
		desc: {type: 'Discount the price for large private service after the first hour'},
		label: {
			vn: 'Giảm giá sau giờ đầu',
			en: 'Private discount after first hour',
		},	
		codeType: 3,
		services: ['large group private'],
		priority: 1,
		redeemData: {
			total: {
				value: 450000,
				formula: 1
			}
		}			
	};

	return {
		'studentprice': studendPrice,
		'smallprivatediscountprice': smallPrivateDiscountPrice,
		'mediumprivatediscountprice': mediumPrivateDiscountPrice,
		'largeprivatediscountprice': largePrivateDiscountPrice
	};
}

var redeemPrice = function (price){
	var result = {};

	if (this.redeemData.price.formula == 1){
		result.price = price * this.redeemData.price.value;
	}
	else{
		result.price = this.redeemData.price.value;
	}

	return result;
}

var redeemUsage = function (usage){

	var result = {};

	// Subtract
	if (this.redeemData.usage.formula == 1){
		var remain = usage - this.redeemData.usage.value;
		if (remain > 0){
			result.usage = Math.abs(remain);
		}
		else{
			result.usage = 0;
		}
	}
	else{
		result.usage = this.redeemData.usage.value;
	}

	return result;
}

var redeemTotal = function (price, usage){
	var result = {};

	// apply a new price after first hour
	if (this.redeemData.total.formula == 1){
		var remain = usage - 1;
		result.total = price + (remain > 0 ? this.redeemData.total.value * Math.abs (remain) : 0);
	}
	// multiple total with x % 
	else if (this.redeemData.total.formula == 2){
		result.total = price * usage * this.redeemData.total.value;
	}
	else{
		result.total = this.redeemData.total.value;
	}

	return result;
}

var redeem = function (price, usage){
	if (this.codeType == 1){
		return this.redeemUsage (usage);
	}	
	else if (this.codeType == 2){
		return this.redeemPrice (price);
	}
	else if (this.codeType == 3){
		return this.redeemTotal (price, usage);
	}	
}

var resolveConflict = function (codes){
	var max = {};
	// get max of each type
	codes.map (function (x, i, arr){
		if (!max[x.codeType]){
			max[x.codeType] = x;
		}
		else {
			if (max[x.codeType].priority > x.priority){
				// do nothing
			}
			else if (max[x.codeType].priority == x.priority){
				throw new Error ('Codes of the same priority are not allowed');
			}
			else{
				max[x.codeType] = x;
			}
		}
	});

	// keep only max of each type
	codes.map (function (x, i, arr){
		if (x.priority < max[x.codeType].priority){
			arr.splice (i, 1);
		}
	});

	// code of type total normally cannot go with other code of other type except studentprice
	if (max['3']){
		var removeTypeTotal = false;
		codes.map (function (x, i, arr){
			if (x.codeType != '3' && x.priority > max['3'].priority){
				removeTypeTotal = true;
			}
		});	

		if (removeTypeTotal){
			codes.map (function (x, i, arr){
				if (x.codeType == '3'){
					codes.splice (i, 1);
				}
			});
		}
		else{
			codes.splice (0, codes.length);
			codes.push (max['3']);

		}
	}

	return codes
};

var NewPromocodesSchema = mongoose.Schema ({
	name: String,
	desc: {type: String}, // describe what is the promotion about and how to apply
	label: {
		vn: String,
		en: String,
	},	
	codeType: Number,
	services: [String],
	priority: Number,
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	redeemData: {
		price: {
			value: Number,
			formula: String,
		},
		usage: {
			value: Number,
			formula: String,
		},
		total: {
			value: Number,
			formula: String,			
		}
	},
	excluded: {type: Boolean, default: false}, // not being fetched by client
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],	
});

NewPromocodesSchema.methods.redeemPrice = redeemPrice;
NewPromocodesSchema.methods.redeemUsage = redeemUsage;
NewPromocodesSchema.methods.redeemTotal= redeemTotal;
NewPromocodesSchema.methods.redeem = redeem;
NewPromocodesSchema.statics.resolveConflict = resolveConflict;
NewPromocodesSchema.statics.getDefaultCodes = getDefaultCodes;

module.exports = mongoose.model ('NewPromocodes', NewPromocodesSchema);