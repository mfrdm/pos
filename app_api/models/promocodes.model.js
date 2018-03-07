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
	};

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
				value: 79000
			}
		}			
	};

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
				value: 69000
			}
		}	
	};

	var studentCommon3h1d30d = {
		name: 'student_common3h1d30d',
		desc: {type: 'Price of 3-hour-1-day-30-days common for students'},
		label: {
			vn: 'Combo 30 ngày / 3 giờ mỗi ngày cho sinh viên',
		},	
		codeType: 2,
		accounts: ['3h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 279000
			}
		}	
	};

	var studentCommon5h1d30d = {
		name: 'student_common5h1d30d',
		desc: {type: 'Price of 5-hour-1-day-30-days common for students'},
		label: {
			vn: 'Combo 30 ngày / 5 giờ mỗi ngày cho sinh viên',
		},	
		codeType: 2,
		accounts: ['5h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 379000
			}
		}	
	};

	var studentCommon20h14d = {
		name: 'student_common20h14d',
		desc: {type: 'Price of 20-hour-14-day common for students'},
		label: {
			vn: 'Combo 20 giờ trong 14 ngày cho sinh viên',
		},	
		codeType: 2,
		accounts: ['20h14dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value:  145000
			}
		}			
	};

	var studentGroup3Common20h14d = {
		name: 'student_group3_common20h14d',
		desc: {type: 'Price of 20-hour common for 3 students'},
		label: {
			vn: 'Combo 20 giờ / 7 ngày cho nhóm 3 sinh viên',
		},	
		codeType: 2,
		accounts: ['20h14dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 130000
			}
		}			
	};

	var studentGroup5Common20h14d = {
		name: 'student_group5_common20h14d',
		desc: {type: 'Price of 20-hour common for 5 students'},
		label: {
			vn: 'Combo 20 giờ / 7 ngày cho nhóm 5 sinh viên',
		},	
		codeType: 2,
		accounts: ['20h14dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 110000
			}
		}			
	};

	var group3Common20h14d = {
		name: 'group3_common20h14d',
		desc: {type: 'Price of 20-hour common for a group of 3'},
		label: {
			vn: 'Combo 20 giờ / 7 ngày cho nhóm 3',
		},	
		codeType: 2,
		accounts: ['20h14dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 200000
			}
		}			
	};

	var group5Common20h14d = {
		name: 'group5_common20h14d',
		desc: {type: 'Price of 20-hour common for a group of 5'},
		label: {
			vn: 'Combo 20 giờ / 7 ngày cho nhóm 5',
		},	
		codeType: 2,
		accounts: ['20h14dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 180000
			}
		}			
	};

	var studentCommon30d = {
		name: 'student_common30d',
		desc: {type: 'Price of 30-day common for students'},
		label: {
			vn: 'Combo 30 ngày cho sinh viên',
		},	
		codeType: 2,
		accounts: ['30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value:  899000
			}
		}			
	};

	var studentGroup3Common3h1d30d = {
		name: 'student_group3_common3h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 3 giờ mỗi ngày cho nhóm 3 sinh viên',
		},	
		codeType: 2,
		accounts: ['3h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 240000
			}
		}	
	};

	var studentGroup5Common3h1d30d = {
		name: 'student_group5_common3h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 3 giờ mỗi ngày cho nhóm 5 sinh viên',
		},	
		codeType: 2,
		accounts: ['3h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 200000
			}
		}
	};

	var group3Common3h1d30d = {
		name: 'group3_common3h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 3 giờ mỗi ngày cho nhóm 3',
		},	
		codeType: 2,
		accounts: ['3h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 340000
			}
		}	
	};

	var group5Common3h1d30d = {
		name: 'group5_common3h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 3 giờ mỗi ngày cho nhóm 5',
		},	
		codeType: 2,
		accounts: ['3h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 300000
			}
		}
	};

	var studentGroup3Common5h1d30d = {
		name: 'student_group3_common5h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 5 giờ mỗi ngày cho nhóm 3 sinh viên',
		},	
		codeType: 2,
		accounts: ['5h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 340000
			}
		}
	};

	var studentGroup5Common5h1d30d = {
		name: 'student_group5_common5h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 5 giờ mỗi ngày cho nhóm 5 sinh viên',
		},	
		codeType: 2,
		accounts: ['5h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 300000
			}
		}
	};

	var group3Common5h1d30d = {
		name: 'group3_common5h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 5 giờ mỗi ngày cho nhóm 3',
		},	
		codeType: 2,
		accounts: ['5h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 440000
			}
		}
	};

	var group5Common5h1d30d = {
		name: 'group5_common5h1d30d',
		desc: '',
		label: {
			vn: 'Combo 30 ngày / 5 giờ mỗi ngày cho nhóm 5',
		},	
		codeType: 2,
		accounts: ['5h1d30dCommon'],
		priority: 1,
		redeemData: {
			price: {
				value: 400000
			}
		}
	};	

	return {
		studentCommon1day: studentCommon1day,
		studentCommon3days: studentCommon3days,
		studentGroup3Common1day: studentGroup3Common1day,
		studentGroup5Common1day: studentGroup5Common1day,
		group3Common1day: group3Common1day,
		group5Common1day: group5Common1day,
		studentCommon3h1d30d: studentCommon3h1d30d,
		studentCommon5h1d30d: studentCommon5h1d30d,
		studentCommon20h14d: studentCommon20h14d,
		studentCommon30d: studentCommon30d,
		studentGroup3Common20h14d: studentGroup3Common20h14d,
		studentGroup5Common20h14d: studentGroup5Common20h14d,
		group3Common20h14d: group3Common20h14d,
		group5Common20h14d: group5Common20h14d,
		studentGroup3Common3h1d30d: studentGroup3Common3h1d30d,
		studentGroup5Common3h1d30d: studentGroup5Common3h1d30d,
		group3Common3h1d30d: group3Common3h1d30d,
		group5Common3h1d30d: group5Common3h1d30d,
		studentGroup3Common5h1d30d: studentGroup3Common5h1d30d,
		studentGroup5Common5h1d30d: studentGroup5Common5h1d30d,
		group3Common5h1d30d: group3Common5h1d30d,
		group5Common5h1d30d: group5Common5h1d30d,			
	}
}

// use temporary. Need to move all or part of them to database.
var getServiceDefaultCodes = function (){
	var studendPrice = {
		name: 'STUDENTPRICE',
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
		name: "SMALLPRIVATEDISCOUNTPRICE",
		desc: {type: 'Discount the price for small private service after the first hour'},
		label: {
			vn: 'Giảm giá sau giờ đầu phòng riêng 15',
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
		},
		createdAt: moment ('2017-05-07'),
		start: moment ('2017-05-07'),
		end: moment ('2017-06-30 23:59:00')					
	}

	var mediumPrivateDiscountPrice = {
		name: "MEDIUMPRIVATEDISCOUNTPRICE",
		desc: {type: 'Discount the price for medium private service after the first hour'},
		label: {
			vn: 'Giảm giá sau giờ đầu phòng riêng 30',
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
		},
		createdAt: moment ('2017-05-07'),
		start: moment ('2017-05-07'),
		end: moment ('2017-06-30 23:59:00')					
	};

	var largePrivateDiscountPrice = {
		name: "LARGEPRIVATEDISCOUNTPRICE",
		desc: {type: 'Discount the price for large private service after the first hour'},
		label: {
			vn: 'Giảm giá sau giờ đầu phòng riêng 40',
			en: 'Private discount after first hour',
		},	
		codeType: 3,
		services: ['large group private'],
		priority: 1,
		redeemData: {
			total: {
				value: 200000,
				formula: 1
			}
		},
		createdAt: moment ('2017-05-07'),
		start: moment ('2017-05-07'),
		end: moment ('2017-06-30 23:59:00')					
	};

	// var ftuStudents = { 
	// 	"name" : "PRIVATE/COMMON_VIP_FTU_STUDENTS", 
	// 	"start" : moment ("2017-11-26 17:00:00"), 
	// 	"end" : moment("2017-12-31 17:00:00Z"), 
	// 	"desc" : "", 
	// 	"codeType" : 3,
	// 	"label" : { "vn" : "Common/Private - Giá VIP - Sinh viên FTU" }, 
	// 	"priority" : 1, 
	// 	"services" : [ "small group private", "medium group private", "large group private", "group common", "individual common" ], 
	// 	"redeemData" : { 
	// 		"total" : { "formula" : 2, "value" : 0.8 }, 
	// 		"checkoutTime" : { "hour" : 16, "min" : 0, "total" : 1 }, 
	// 		"dayofweek": [1,3,5],
	// 		'other': {'school': 18} 
	// 	}
	// }

	// var newyear2018 = { 
	// 	"name" : "PRIVATE/COMMON-VIP-NEWYEAR-10pct", 
	// 	"start" : moment ("2018-01-01 17:00:00"), 
	// 	"end" : moment("2018-02-02 17:00:00Z"), 
	// 	"desc" : "", 
	// 	"codeType" : 3,
	// 	"label" : { "vn" : "Private/Common - Giá VIP - Happy New Year 10%" }, 
	// 	"priority" : 1, 
	// 	"services" : [ "small group private", "medium group private", "large group private", "group common", "individual common" ], 
	// 	"redeemData" : { 
	// 		"total" : { "formula" : 2, "value" : 0.9 }, 
	// 		"checkoutTime" : { "hour" : 11, "min" : 0, "total" : 1 }, 
	// 	}
	// }


	return {
		'studentprice': studendPrice,
		'smallprivatediscountprice': smallPrivateDiscountPrice,
		'mediumprivatediscountprice': mediumPrivateDiscountPrice,
		'largeprivatediscountprice': largePrivateDiscountPrice,
		// 'ftuStudents': ftuStudents,
		// newyear2018: newyear2018,
	};
};

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
};

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
};

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

	if (!higherType2 && isStudent && !isGroupon){
		var targetCodes = [
			defaultCodes ['studentCommon1day'],
			defaultCodes ['studentCommon3days'],
			defaultCodes ['studentCommon3h1d30d'],
			defaultCodes ['studentCommon5h1d30d'],
			defaultCodes ['studentCommon20h14d'],
		];

		targetCodes.map (function (x, i, arr){
			_addDefaultCode (x);
		});
	}
	else if (!higherType2 && isStudent && isGroupon && groupMemberNumber >= 3 && groupMemberNumber <= 4){
		var targetCodes = [
			defaultCodes ['studentGroup3Common1day'],
			defaultCodes ['studentGroup3Common20h14d'],
			defaultCodes ['studentGroup3Common3h1d30d'],
			defaultCodes ['studentGroup3Common5h1d30d'],
		];

		targetCodes.map (function (x, i, arr){
			_addDefaultCode (x);
		});		

	}
	else if (!higherType2 && isStudent && isGroupon && groupMemberNumber >= 5){
		var targetCodes = [
			defaultCodes ['studentGroup5Common1day'],
			defaultCodes ['studentGroup5Common20h14d'],
			defaultCodes ['studentGroup5Common3h1d30d'],
			defaultCodes ['studentGroup5Common5h1d30d'],			
		];

		targetCodes.map (function (x, i, arr){
			_addDefaultCode (x);
		});	

	}		
	else if (!higherType2 && !isStudent && isGroupon && groupMemberNumber >= 3 && groupMemberNumber <= 4){
		var targetCodes = [
			defaultCodes ['group3Common1day'],
			defaultCodes ['group3Common20h14d'],
			defaultCodes ['group3Common3h1d30d'],
			defaultCodes ['group3Common5h1d30d'],
		];

		targetCodes.map (function (x, i, arr){
			_addDefaultCode (x);
		});	
	}	
	else if (!higherType2 && !isStudent && isGroupon && groupMemberNumber >= 5){
		var targetCodes = [
			defaultCodes ['group5Common1day'],
			defaultCodes ['group5Common20h14d'],
			defaultCodes ['group5Common3h1d30d'],
			defaultCodes ['group5Common5h1d30d'],			
		];

		targetCodes.map (function (x, i, arr){
			_addDefaultCode (x);
		});
	}

	context.setPromocodes (resolveConflict (promocodes));
};

var addServiceDefaultCodes = function (context){
	var occ = this;

	var service = context.getService ();
	var usage = context.getUsage ();
	var productName = context.productName;
	var promocodes = context.getPromocodes ();
	var isStudent = context.isStudent ();
	// var school = context.getSchool ();
	// var service = occ.service.name.toLowerCase ();
	// var usage = occ.usage;
	
	var defaultCodes = getDefaultCodes (productName);
	// occ.promocodes = occ.promocodes ? occ.promocodes : [];

	// check if there any any code of the same type but higher priority
	var higherType1 = false;
	var higherType2 = false;
	var higherType3 = false;
	var basePriority = 1;

	// check if there is any code of the same type and has higher priority
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

	function _addDefaultCodes (targetCode){
		var today = moment ();
		var targetService = false;

		if (!today.isBetween (targetCode.start, targetCode.end, null, '[]')){
			return
		}

		targetService = targetCode.services.indexOf (service) == -1 ? targetService : true;
		
		if (targetService){
			promocodes.push (targetCode);
		}

	}

	// FIX: build a function to evaluate conditions like add default accounts
	// student price code
	if (!higherType2 && isStudent && (defaultCodes ['studentprice'].services.indexOf (service) != -1)){
		promocodes.push (defaultCodes ['studentprice']);
	}

	// if (!higherType3 && isStudent && school == defaultCodes['ftuStudents'].redeemData.other.school && (defaultCodes ['ftuStudents'].services.indexOf (service) != -1)){
	// 	promocodes.push (defaultCodes ['ftuStudents']);
	// }

	// if (!higherType3 && (defaultCodes ['newyear2018'].services.indexOf (service) != -1)){
	// 	promocodes.push (defaultCodes ['newyear2018']);
	// }		

	// // discount price for small group private
	// if (!higherType1 && !higherType2 && !higherType3 && usage > 1){
	// 	var targetCodes = [
	// 		defaultCodes ['smallprivatediscountprice'],
	// 		defaultCodes ['mediumprivatediscountprice'],
	// 		defaultCodes ['largeprivatediscountprice'],
	// 	];		

	// 	targetCodes.map (function (x, i, arr){
	// 		_addDefaultCodes (x)
	// 	});
	// }

	// // discount price for medium group private
	// if (!higherType1 && !higherType2 && !higherType3 && usage > 1 && (defaultCodes ['mediumprivatediscountprice'].services.indexOf (service) != -1)){
	// 	promocodes.push (defaultCodes ['mediumprivatediscountprice']);
	// }

	// // discount price for large group private
	// if (!higherType1 && !higherType2 && !higherType3 && usage > 1 && (defaultCodes ['largeprivatediscountprice'].services.indexOf (service) != -1)){
	// 	promocodes.push (defaultCodes['largeprivatediscountprice']);
	// }

	context.setPromocodes (promocodes);
};

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
};

// FIX: the first formula does not have proper attribute. change from total value to price value
// Mixin: price, usage, and total can be set by default
var redeemTotal = function (context){
	var result = {};
	var price = context.getPrice ? context.getPrice () : null;
	var usage = context.getUsage ? context.getUsage () : null;
	var checkinTime = context.getCheckinTime ? context.getCheckinTime () : null;

	// apply a new price after first item
	if (this.redeemData.total.formula == 1){
		var remain = usage - 1;	
		result.total = price + (remain > 0 ? this.redeemData.total.value * Math.abs (remain) : 0);
	}
	// multiple total with x % 
	// Something may went wrong. Review. 
	else if (this.redeemData.total.formula == 2 && ((this.redeemData.dayofweek.length == 0) || (this.redeemData.dayofweek && this.redeemData.dayofweek.indexOf(moment().day ()) != -1))){
		if (this.redeemData.checkoutTime){ // depend on some period of time
			checkinTime = moment (checkinTime);
			var expectedcheckoutTime = moment ();
			expectedcheckoutTime.hour (this.redeemData.checkoutTime.hour);
			expectedcheckoutTime.minute (this.redeemData.checkoutTime.min);		
			var expectedUsage = (expectedcheckoutTime.diff (checkinTime) / 3600000); 
			var remainUsage = 0

			if (expectedUsage <= 0){ // checkin after the max hour
				result.total = price * usage * this.redeemData.checkoutTime.total;
			}
			else{ // checkin before the max hour
				var remainUsage = usage - expectedUsage;
				if (remainUsage <= 0){ // checkout before the max hour too
					result.total = price * usage * this.redeemData.total.value;
				}
				else{ // checkout after it
					result.total = price * expectedUsage * this.redeemData.total.value;
					result.total += price * remainUsage * this.redeemData.checkoutTime.total;	
				}			
			}
		}
		else{
			result.total = price * usage * this.redeemData.total.value;
		}

	}
	// usage of hours must at least equals a min usage.
	else if (this.redeemData.total.formula == 3){
		if (usage <= this.redeemData.usage.min){
			usage = this.redeemData.usage.min;
		}

		result.total = this.redeemData.price.value * usage;
		result.price = this.redeemData.price.value;
	}
	// free some hours of usage, only charge afterward.
	else if (this.redeemData.total.formula == 4){
		if (usage <= this.redeemData.usage.max){
			price = 0;
		}
		else {
			price = this.redeemData.price.value;
			usage = usage - this.redeemData.usage.max;
		}

		result.total = price * usage ;
		result.price = price;
	}
	// different price for a period of time. After that charge with normal price. Usage must at least equal the max value of usage for the special price.
	else if (this.redeemData.total.formula == 5){
		if (usage <= this.redeemData.usage.max){	
			usage = this.redeemData.usage.max
			result.total = usage * this.redeemData.price.value;
		}
		else{
			remainUsage = usage - this.redeemData.usage.max;
			result.total = this.redeemData.usage.max * this.redeemData.price.value + remainUsage * price;
		}
	}
	// same total for max usage. after that normal price.
	else if (this.redeemData.total.formula == 6){ 
		if (usage <= this.redeemData.usage.max){
			result.total = this.redeemData.total.min;
		}
		else{
			remainUsage = usage - this.redeemData.usage.max;
			price = this.redeemData.price && this.redeemData.price.value ? this.redeemData.price.value : price; // use the new price if exist otherwise use original price
			result.total = this.redeemData.total.min + remainUsage * price;
		}
	}
	// charge with a fixed amount for whatever usage of hours
	else if (this.redeemData.total.formula == 7){
		result.total = this.redeemData.total.value;
	}
	// Updated version of formula 2
	else if (this.redeemData.total.formula == 8){
		// can use with more than 1 period of time
		// The periods of time must be in the correct ascending temporal order, i.e. from 0 to 24 hours.
		
		checkinTime = moment (checkinTime);
		var formulanum = this.redeemData.checkoutTime.length;
		result.total = 0;
		for (var i = 0; i < formulanum; i++){
			var checkoutTime = this.redeemData.checkoutTime[i];
			var remain = 1 - checkoutTime.discount;
			var expectedcheckoutTime = moment ();
			expectedcheckoutTime.hour (checkoutTime.hour);
			expectedcheckoutTime.minute (checkoutTime.min);		
			var expectedUsage = (expectedcheckoutTime.diff (checkinTime) / 3600000); 
			var remainUsage = 0

			if (expectedUsage <= 0){ // checkin after the max hour
				continue;
			}
			else{ // checkin before the max hour
				var remainUsage = usage - expectedUsage;
				if (remainUsage <= 0){ // checkout before the max hour too
					result.total += price * usage * remain;
					usage = 0;
					break;
				}
				else{ // checkout after it
					result.total += price * expectedUsage * remain;
					usage = usage - expectedUsage;
					checkinTime = expectedcheckoutTime;
				}
			}
		}

		result.total += price * usage * (1 - this.redeemData.total.discount);
	}
	else{
		result.total = price * usage;
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
	customers: [mongoose.Schema.Types.ObjectId],
	priority: Number,
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	redeemData: {
		checkoutTime: mongoose.Schema.Types.Mixed,
		dayofweek: [Number],
		other: mongoose.Schema.Types.Mixed,
		price: {
			value: Number,
			min: Number,
			max: Number,
			formula: String,
		},
		quantity: {
			value: Number,
			min: Number,
			max: Number,
			formula: String,
		},
		total: {
			value: Number, // despricated. Use discount instead.
			discount: Number,
			min: Number,
			max: Number,
			formula: String,			
		},
		usage: {
			value: Number,
			min: Number,
			max: Number,
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