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

var redeemPrice = function (code, price, productName){
	var newPrice = price;
	productName = productName ? productName.toLowerCase () : productName;
	code = code.toLowerCase ();
	
	if (code && code == 'studentprice' && (productName == productNames[0] || productName == productNames[1])){
		newPrice = studentPrice[productName];
	}

	return newPrice;
}

var redeemUsage = function (code, usage){

	code = code ? code.toLowerCase () : code;

	if (code === 'v01h06'){ // change name later
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}
	else if (code === 'v02h06'){ // change name later
		if (usage <= 2) usage = 0;
		else usage = usage - 2;		
	}
	else if (code === 'gs05'){
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}
	else if (code === 'mar05'){
		if (usage <= 1) usage = 0;
		else usage = usage - 1;
	}
	else if (code === 'freewed'){
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

	return total;	
}


var addDefaultCodes = function (occ){
	var service = occ.service.name.toLowerCase ();
	var usage = occ.usage;
	if (occ.customer.isStudent && (service == productNames[0] || service == productNames[1])){
		occ.promocodes = occ.promocodes ? occ.promocodes : [];
		occ.promocodes.push ({name: 'studentprice', codeType: 2})
	}
	if (usage > 1 && (service == productNames[2] || service == productNames[3])){
		occ.promocodes = occ.promocodes ? occ.promocodes : [];
		occ.promocodes.push ({name: 'privatediscountprice', codeType: 4});
	}
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
PromocodesSchema.statics.addDefaultCodes = addDefaultCodes;

module.exports = mongoose.model ('promocodes', PromocodesSchema);
