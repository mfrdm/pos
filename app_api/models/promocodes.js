var mongoose = require('mongoose');
var productNames = ['group common', 'individual common', 'medium group private', 'small group private', 'large group private'];

var rewardUsagePrice = {
	'medium group private': 200000,
	'small group private': 120000,
	'large group private': 450000,
};

var studentPrice = {
	'group common': 10000,
	'individual common': 10000,
};

// change total only. Assume total is calculated using current price and usage
var redeemTotal = function (code, total){
	var newTotal = total;
	code = code ? code.toLowerCase () : code;

	if (code === 'yeugreenspace'){
		newTotal = total * 0.5;
	}

	return newTotal;
};

// change the price only
var redeemPrice = function (code, price, productName){
	var newPrice = price;
	productName = productName ? productName.toLowerCase () : productName;
	code = code.toLowerCase ();
	
	if (code && code == 'studentprice' && (productName == productNames[0] || productName == productNames[1])){
		newPrice = studentPrice[productName];
	}

	return newPrice;
}

// change usage only
var redeemUsage = function (code, usage, productName){

	code = code ? code.toLowerCase () : code;
	productName = productName ? productName.toLowerCase () : '';

	if (code === 'v01h06' && (productName == productNames[0] || productName == productNames[1])){ // change name later
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}
	else if (code === 'v02h06' && (productName == productNames[0] || productName == productNames[1])){ // change name later
		if (usage <= 2) usage = 0;
		else usage = usage - 2;		
	}
	else if (code === 'gs05' && (productName == productNames[0] || productName == productNames[1])){
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}
	else if (code === 'mar05' && (productName == productNames[0] || productName == productNames[1])){
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}
	else if (code === 'freewed' && (productName == productNames[0] || productName == productNames[1])){
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}		

	usage = Number(Math.round(usage+'e1')+'e-1');

	return usage
};

// involve more than one type of redeem: total, usage, and price.
// assume codes are checked and can be used concurrecy and in correct order
var redeemMixed = function (code, usage, price, productName){
	var total;
	productName = productName ? productName.toLowerCase() : productName;
	code = code ? code.toLowerCase () : code;

	if (code == "privatediscountprice" && usage > 1 && (productName == productNames[2] || productName == productNames[3] || productName == productNames[4])){
		total = price * 1 + rewardUsagePrice[productName] * (usage - 1);
	}
	else if (code == 'free1daycommon' && (productName == productNames[0] || productName == productNames[1])){
		total = 0;
	}
	else if (code == 'privatehalftotal' && (productName == productNames[2] || productName == productNames[3] || productName == productNames[4])){
		total = price * usage * 0.5;
	}

	return total;	
}

// Some codes cannot be used together. The function select code with higher priority in its type
// default code should have lowest priority, which is 1
// codeType of 4 should be conflict with the rest.

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

	// resolve type 4 conflict
	if (max['4']){
		var removeType4 = false;
		codes.map (function (x, i, arr){
			if (x.codeType != '4' && x.priority > max['4'].priority){
				removeType4 = true;
			}
		});	

		if (removeType4){
			codes.map (function (x, i, arr){
				if (x.codeType == '4'){
					codes.splice (i, 1);
				}
			});
		}
		else{
			codes.splice (0, codes.length);
			codes.push (max['4'])	
		}
	}

};

// remove code added by server so that calling getTotal again will not cause problems having codes same priority
var removeDefaultCode = function (codes){
	return codes.filter (function (x, i, arr){
		if (x.priority == 1){
			return false
		}
		else{
			return true
		}
	})
}

// FIX: Build actual test. This is just an placeholder, and assume no conflict and no override
// Some codes cannot be used with another. The function checks and return list of conflicts if any.
// Some codes has higher priority and so uwill remove other codes' effect. Need to detect and override the codes with lower priority .
// Detect and remove duplicate codes

var validateCodes = function (codes){
	codes.map (function (c, i , arr){
		c.conflicted = [];
		c.override = [];
	});

	return codes
};


// represent all codes that give customer some values like free seat or discount
var PromocodesSchema = mongoose.Schema ({
	name: {type: String, required: true},
	services: [String], // all for all service. otherwises, specified applied services
	label: {
		vn: String,
		en: String,
	},
	priority: {type: Number},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	desc: {type: String}, // describe what is the promotion about and how to apply
	codeType: Number, // 1, 2, 3, 4 = 'usage', 'price', 'total', 'mix'
	createdAt: {type: Date, default: Date.now},
	excluded: {type: Boolean, default: false}, // not being fetched by client
	updatedAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],
	conflict: [{name: String, _id: mongoose.Schema.Types.ObjectId}],
	override: [{name: String, _id: mongoose.Schema.Types.ObjectId}] // code that are not used when the code is apply
});

PromocodesSchema.statics.redeemPrice = redeemPrice;
PromocodesSchema.statics.redeemUsage = redeemUsage;
PromocodesSchema.statics.redeemTotal = redeemTotal;
PromocodesSchema.statics.redeemMixed = redeemMixed;
PromocodesSchema.statics.validateCodes = validateCodes;
PromocodesSchema.statics.resolveConflict = resolveConflict;
PromocodesSchema.statics.removeDefaultCode = removeDefaultCode;

module.exports = mongoose.model ('promocodes', PromocodesSchema);
