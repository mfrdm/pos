var mongoose = require('mongoose');
var moment = require ('moment');

var validateCodes = function (context){
	// Need to build
}

var preprocessCodes = function (context){
	removeDefaultCodes (context);
	context.setPromocodes (resolveConflict (context.getPromocodes ()));
	addDefaultCodes (context);
	context.getPromocodes ().sort (function (code1, code2){
		return code1.codeType > code2.codeType;
	});
}

// use temporary. Need to move all or part of them to database.
var getAccountDefaultCodes = function (){
	var studentCommon1day = {
		name: 'student_common1d',
		desc: {type: 'Price of 1-day common for students'},
		label: {
			vn: 'Combo 1 ngày cho sinh viên',
		},	
		codeType: 2,
		accounts: ['1dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 59000
			}
		}	
	};

	var studentCommon3days = {
		name: 'student_common3d',
		desc: {type: 'Price of 3-days combo for students'},
		label: {
			vn: 'Combo 3 ngày cho sinh viên',
		},	
		codeType: 2,
		accounts: ['3dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 150000
			}
		}			
	}

	var studentGroup3Common1day = {
		name: 'student_group3_common1d',
		desc: {type: 'Price of 1-day common for 3 students'},
		label: {
			vn: 'Combo 1 ngày cho nhóm 3 sinh viên',
		},	
		codeType: 2,
		accounts: ['1dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 49000
			}
		}	
	};

	var studentGroup5Common1day = {
		name: 'student_group5_common1d',
		desc: {type: 'Price of 1-day common for 5 students'},
		label: {
			vn: 'Combo 1 ngày cho nhóm 5 sinh viên',
		},	
		codeType: 2,
		accounts: ['1dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 39000
			}
		}	
	};	

	var group3Common1day = {
		name: 'group3_common1d',
		desc: {type: 'Price of 3 common accounts'},
		label: {
			vn: 'Combo 1 ngày cho nhóm 3 người',
		},	
		codeType: 2,
		accounts: ['1dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 69000
			}
		}			
	}

	var group5Common1day = {
		name: 'group5_common1d',
		desc: {type: 'Price of 5 common accounts'},
		label: {
			vn: 'Combo 1 ngày cho nhóm 5 người',
		},	
		codeType: 2,
		accounts: ['1dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 59000
			}
		}	
	}

	return {
		studentCommon1day: studentCommon1day,
		studentCommon3days: studentCommon3days,
		studentGroup3Common1day: studentGroup3Common1day,
		studentGroup5Common1day: studentGroup5Common1day,
		group3Common1day: group3Common1day,
		group5Common1day: group5Common1day
	}
}

// use temporary. Need to move all or part of them to database.
var getServiceDefaultCodes = function (){
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

var getDefaultCodes = function (productName){
	if (productName == 'service'){
		return getServiceDefaultCodes ();
	}
	else if (productName == 'order'){
		//
	}
	else if (productName == 'account'){
		return getAccountDefaultCodes ();
	}
}

var addDefaultCodes = function (context){
	if (context.productName == 'service'){
		addServiceDefaultCodes (context);
	}
	else if (context.productName == 'order'){
		//
	}
	else if (context.productName == 'account'){
		addAccountDefaultCodes (context);
	}	
}

var addAccountDefaultCodes = function (context){

	var productName = context.productName;
	var defaultCodes = getDefaultCodes (productName);

	var services = context.getServices ();
	var account = context.getAccount ();
	var promocodes = context.getPromocodes ();
	var isStudent = context.isStudent ();
	var isGroupon = context.isGroupon ();
	var groupMemberNumber = context.getGroupMemberNumber ();
	var quantity = context.getQuantity ();

	// check if there any any code of the same type but higher priority
	var higherType1 = false;
	var higherType2 = false;
	var higherType3 = false;
	var targetServices = false;
	var basePriority = 1;

	promocodes.map (function (x, i, arr){
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
	
	var _addDefaultCode = function (targetCode){
		var targetAccount = false;
		// if target accounts

		targetAccount = targetCode.accounts.indexOf (account) == -1 ? targetAccount : true;

		if (targetAccount){
			promocodes.push (targetCode);
		}
	} 

	if (!higherType2 && isStudent){
		var targetCodes = [
			defaultCodes ['studentCommon3days']
		];

		targetCodes.map (function (x, i, arr){
			_addDefaultCode (x);
		});		
	}

	if (!higherType2 && isStudent && !isGroupon){
		var targetCodes = [
			defaultCodes ['studentCommon1day']
		];

		targetCodes.map (function (x, i, arr){
			_addDefaultCode (x);
		});
	}
	else if (!higherType2 && isStudent && isGroupon && groupMemberNumber >= 3 && groupMemberNumber <= 4){
		var targetCode = defaultCodes ['studentGroup3Common1day'];
		_addDefaultCode (targetCode);
	}
	else if (!higherType2 && isStudent && isGroupon && groupMemberNumber >= 5){
		var targetCode = defaultCodes ['studentGroup5Common1day'];
		_addDefaultCode (targetCode);
	}		
	else if (!higherType2 && !isStudent && isGroupon && groupMemberNumber >= 3 && groupMemberNumber <= 4){
		var targetCode = defaultCodes ['group3Common1day'];
		_addDefaultCode (targetCode);
	}	
	else if (!higherType2 && !isStudent && isGroupon && groupMemberNumber >= 5){
		var targetCode = defaultCodes ['group5Common1day'];
		_addDefaultCode (targetCode);

	}

	context.setPromocodes (resolveConflict (promocodes));
}

var addServiceDefaultCodes = function (context){
	var occ = this;

	var service = context.getService ();
	var usage = context.getUsage ();
	var productName = context.productName;
	var promocodes = context.getPromocodes ();
	var isStudent = context.isStudent ();
	// var service = occ.service.name.toLowerCase ();
	// var usage = occ.usage;
	
	var defaultCodes = getDefaultCodes (productName);
	// occ.promocodes = occ.promocodes ? occ.promocodes : [];

	// check if there any any code of the same type but higher priority
	var higherType1 = false;
	var higherType2 = false;
	var higherType3 = false;
	var basePriority = 1;

	promocodes.map (function (x, i, arr){
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
	if (!higherType2 && isStudent && (defaultCodes ['studentprice'].services.indexOf (service) != -1)){
		promocodes.push (defaultCodes ['studentprice']);
	}

	// discount price for small group private
	if (!higherType1 && !higherType2 && !higherType3 && usage > 1 && (defaultCodes ['smallprivatediscountprice'].services.indexOf (service) != -1)){
		promocodes.push (defaultCodes ['smallprivatediscountprice']);
	}

	// discount price for medium group private
	if (!higherType1 && !higherType2 && !higherType3 && usage > 1 && (defaultCodes ['mediumprivatediscountprice'].services.indexOf (service) != -1)){
		promocodes.push (defaultCodes ['mediumprivatediscountprice']);
	}

	// discount price for large group private
	if (!higherType1 && !higherType2 && !higherType3 && usage > 1 && (defaultCodes ['largeprivatediscountprice'].services.indexOf (service) != -1)){
		promocodes.push (defaultCodes['largeprivatediscountprice']);
	}

	context.setPromocodes (promocodes);
}

var redeemPrice = function (context){
	var result = {};
	var price = context.getPrice ();

	if (this.redeemData.price.formula == 1){
		result.price = price * this.redeemData.price.value;
	}
	else{
		result.price = this.redeemData.price.value;
	}

	return result;	
};

var redeemUsage = function (context){
	var result = {};
	var usage = context.getUsage ();

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
};

var redeemQuantity = function (context){
	var result = {};
	var quantity = context.getQuantity ();

	// Subtract
	if (this.redeemData.quantity.formula == 1){
		var remain = quantity - this.redeemData.quantity.value;
		if (remain > 0){
			result.quantity = Math.abs(remain);
		}
		else{
			result.quantity = 0;
		}
	}
	else{
		result.quantity = this.redeemData.quantity.value;
	}

	return result;
}

var redeemTotal = function (context){
	var result = {};
	var price = context.getPrice ? context.getPrice () : null;
	var usage = context.getUsage ? context.getUsage () : null;

	// apply a new price after first item
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

var redeem = function (context){
	if (this.codeType == 1){
		return this.redeemUsage (context);
	}	
	else if (this.codeType == 2){
		return this.redeemPrice (context);
	}
	else if (this.codeType == 3){
		return this.redeemTotal (context);
	}	
	else if (this.codeType == 4){
		return this.redeemQuantity (context);
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

// priority of 1 is only for default codes
var removeDefaultCodes = function (context){
	var originalCodes = context.getPromocodes ().filter (function (x, i, arr){
		if (x.priority == 1){
			return false
		}
		else{
			return true
		}
	});

	context.setPromocodes (originalCodes);
}

var PromocodesSchema = mongoose.Schema ({
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
		quantity: {
			value: Number,
			formula: String,
		},
		total: {
			value: Number,
			formula: String,			
		},
		usage: {
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

PromocodesSchema.methods.redeemUsage = redeemUsage;
PromocodesSchema.methods.redeemPrice = redeemPrice;
PromocodesSchema.methods.redeemQuantity = redeemQuantity;
PromocodesSchema.methods.redeemTotal= redeemTotal;
PromocodesSchema.methods.redeem = redeem;
PromocodesSchema.statics.resolveConflict = resolveConflict;
PromocodesSchema.statics.getDefaultCodes = getDefaultCodes;
PromocodesSchema.statics.addDefaultCodes = addDefaultCodes;
PromocodesSchema.statics.preprocessCodes = preprocessCodes;

module.exports = mongoose.model ('Promocodes', PromocodesSchema);