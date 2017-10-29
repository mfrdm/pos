var mongoose = require('mongoose');
var moment = require ('moment');

// used to create an account for a customer
var getDefaultAccounts = function (){
	var cash = {
		name: 'cash',
		price: undefined,
		amount: undefined,		
		unit: 'vnd',
		desc: "",
		services: ['small group private', 'medium group private', 'large group private'],
		label: {
			vn: "Tiền mặt",
			en: "Cash"
		},
		recursive: {
			isRecursive: false
		},		
		expireDateNum: 60,
		grouponable: false,
	};

	var oneDayCommon = {
		name: '1dCommon',
		price: 89000, // 
		amount: 24,
		unit: 'hour',
		desc: "",
		services: ['group common', 'individual common'], // name of service applied
		label: {
			vn: "Combo 1 ngày",
			en: "1 day commbo",
		},
		recursive: {
			isRecursive: false
		},
		expireDateNum: 1,
		grouponable: true,
	};

	var threeDaysCommon = {
		name: '3dCommon',
		price: 190000, // 
		amount: 24,
		unit: 'hour',
		desc: "",
		services: ['group common', 'individual common'], // name of service applied
		label: {
			vn: "Combo 3 ngày",
			en: "3 day commbo",
		},
		recursive: {
			isRecursive: true,
			lastRenewDate: new Date (),
			renewNum: 0, // number of renew
			maxRenewNum: 3, // 
			recursiveType: 1, // daily: 1, monthly: 2, annually: 3
			baseAmount: 24
		},
		expireDateNum: 7,
		grouponable: false,
	};

	var threeHoursOneDayThirtyDaysCommon = {
		name: '3h1d30dCommon',
		price: 379000, // 
		amount: 3,
		unit: 'hour',
		desc: "",
		services: ['group common', 'individual common'], // name of service applied
		label: {
			vn: "Combo 30 ngày / 3 giờ 1 ngày",
			en: "Combo 30 days / 3 hours per day",
		},
		recursive: {
			isRecursive: true,
			lastRenewDate: new Date (),
			renewNum: 0, // number of renew
			maxRenewNum: 29, // 
			recursiveType: 1, // daily: 1, monthly: 2, annually: 3
			baseAmount: 3
		},
		expireDateNum: 30,
		grouponable: true,
	};	

	var fiveHoursOneDayThirtyDaysCommon = {
		name: '5h1d30dCommon',
		price: 479000, // 
		amount: 5,
		unit: 'hour',
		desc: "",
		services: ['group common', 'individual common'], // name of service applied
		label: {
			vn: "Combo 30 ngày / 5 giờ 1 ngày",
			en: "Combo 30 days / 5 hours per day",
		},
		recursive: {
			isRecursive: true,
			lastRenewDate: new Date (),
			renewNum: 0, // number of renew
			maxRenewNum: 29, // 
			recursiveType: 1, // daily: 1, monthly: 2, annually: 3
			baseAmount: 5
		},
		expireDateNum: 30,
		grouponable: true,
	};

	var twentyHoursCommon = {
		name: '20h14dCommon',
		price: 225000, // 
		amount: 20,
		unit: 'hour',
		desc: "",
		services: ['group common', 'individual common'], // name of service applied
		label: {
			vn: "Combo 20 giờ / 14 ngày",
			en: "Combo 20 hours / 14 day",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 14,
		grouponable: true,
	}

	var thirtyDaysCommon = {
		name: '30dCommon',
		price: 1299000, // 
		amount: 24,
		unit: 'hour',
		desc: "",
		services: ['group common', 'individual common'], // name of service applied
		label: {
			vn: "Combo 30 ngày",
			en: "30-day commbo",
		},
		recursive: {
			isRecursive: true,
			lastRenewDate: new Date (),
			renewNum: 0, // number of renew
			maxRenewNum: 30, // 
			recursiveType: 1, // daily: 1, monthly: 2, annually: 3
			baseAmount: 24
		},
		expireDateNum: 30,
		grouponable: false,		
	}

	var dayPart1GroupPrivate15 = {
		name: 'morningSmallGroupPrivate',
		price: 400000, // 
		amount: 5,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['small group private'], // name of service applied
		label: {
			vn: "Combo sáng - Private 15",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart2GroupPrivate15 = {
		name: 'afternoonSmallGroupPrivate',
		price: 400000, // 
		amount: 5,
		formula: {
			value: 1,
			hourStart: 12,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['small group private'], // name of service applied
		label: {
			vn: "Combo chiều - Private 15",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart3GroupPrivate15 = {
		name: 'eveningSmallGroupPrivate',
		price: 700000, // 
		amount: 6,
		formula: {
			value: 1,
			hourStart: 17,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['small group private'], // name of service applied
		label: {
			vn: "Combo tối - Private 15",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart1GroupPrivate30 = {
		name: 'morningMediumGroupPrivate',
		price: 600000, // 
		amount: 5,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['medium group private'], // name of service applied
		label: {
			vn: "Combo sáng - Private 30",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart2GroupPrivate30 = {
		name: 'afternoonMediumGroupPrivate',
		price: 600000, // 
		amount: 5,
		formula: {
			value: 1,
			hourStart: 12,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['medium group private'], // name of service applied
		label: {
			vn: "Combo chiều - Private 30",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart3GroupPrivate30 = {
		name: 'eveningMediumGroupPrivate',
		price: 1000000, // 
		amount: 6,
		formula: {
			value: 1,
			hourStart: 17,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['medium group private'], // name of service applied
		label: {
			vn: "Combo tối - Private 30",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart1GroupPrivate40 = {
		name: 'morningLargeGroupPrivate',
		price: 800000, // 
		amount: 5,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['large group private'], // name of service applied
		label: {
			vn: "Combo sáng - Private 40",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart2GroupPrivate40 = {
		name: 'afternoonLargeGroupPrivate',
		price: 800000, // 
		amount: 5,
		formula: {
			value: 1,
			hourStart: 12,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['large group private'], // name of service applied
		label: {
			vn: "Combo chiều - Private 40",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart3GroupPrivate40 = {
		name: 'eveningLargeGroupPrivate',
		price: 1500000, // 
		amount: 6,
		formula: {
			value: 1,
			hourStart: 17,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['large group private'], // name of service applied
		label: {
			vn: "Combo tối - Private 40",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,		
	};

	var dayPart12GroupPrivate15 = {
		name: 'MoAfterSmallGroupPrivate',
		price: 700000, // 
		amount: 9,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['small group private'], // name of service applied
		label: {
			vn: "Combo sáng và chiều - Private 15",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,			
	}

	var dayPart23GroupPrivate15 = {
		name: 'AfterEveSmallGroupPrivate',
		price: 800000, // 
		amount: 11,
		formula: {
			value: 1,
			hourStart: 12,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['small group private'], // name of service applied
		label: {
			vn: "Combo chiều và tối - Private 15",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,	
	}

	var dayFullGroupPrivate15 = {
		name: 'FullDaySmallGroupPrivate',
		price: 1000000, // 
		amount: 15,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['small group private'], // name of service applied
		label: {
			vn: "Combo 1 ngày - Private 15",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,
	}

	var dayPart12GroupPrivate30 = {
		name: 'MoAfterMediumGroupPrivate',
		price: 1100000, // 
		amount: 9,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['medium group private'], // name of service applied
		label: {
			vn: "Combo sáng và chiều - Private 30",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,			
	}

	var dayPart23GroupPrivate30 = {
		name: 'AfterEveMediumGroupPrivate',
		price: 1300000, // 
		amount: 11,
		formula: {
			value: 1,
			hourStart: 12,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['medium group private'], // name of service applied
		label: {
			vn: "Combo chiều và tối - Private 30",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,	
	}

	var dayFullGroupPrivate30 = {
		name: 'FullDayMeidumGroupPrivate',
		price: 1500000, // 
		amount: 15,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['medium group private'], // name of service applied
		label: {
			vn: "Combo 1 ngày - Private 30",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,
	}

	var dayPart12GroupPrivate40 = {
		name: 'MoAfterLargeGroupPrivate',
		price: 1500000, // 
		amount: 9,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['large group private'], // name of service applied
		label: {
			vn: "Combo sáng và chiều - Private 40",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,			
	}

	var dayPart23GroupPrivate40 = {
		name: 'AfterEveLargeGroupPrivate',
		price: 1800000, // 
		amount: 11,
		formula: {
			value: 1,
			hourStart: 12,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['large group private'], // name of service applied
		label: {
			vn: "Combo chiều và tối - Private 40",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,	
	}

	var dayFullGroupPrivate40 = {
		name: 'FullDayLargeGroupPrivate',
		price: 2000000, // 
		amount: 15,
		formula: {
			value: 1,
			hourStart: 8,
			minStart: 0,
		},
		unit: 'hour',
		desc: "",
		services: ['large group private'], // name of service applied
		label: {
			vn: "Combo 1 ngày - Private 40",
			en: "",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 1,
		grouponable: false,
	}

	return {
		oneDayCommon: oneDayCommon,
		threeDaysCommon: threeDaysCommon,
		threeHoursOneDayThirtyDaysCommon: threeHoursOneDayThirtyDaysCommon,
		fiveHoursOneDayThirtyDaysCommon: fiveHoursOneDayThirtyDaysCommon,
		twentyHoursCommon: twentyHoursCommon,
		thirtyDaysCommon: thirtyDaysCommon,
		dayPart1GroupPrivate15: dayPart1GroupPrivate15,
		dayPart2GroupPrivate15: dayPart2GroupPrivate15,
		dayPart3GroupPrivate15: dayPart3GroupPrivate15,
		dayPart1GroupPrivate30: dayPart1GroupPrivate30,
		dayPart2GroupPrivate30: dayPart2GroupPrivate30,
		dayPart3GroupPrivate30: dayPart3GroupPrivate30,
		dayPart1GroupPrivate40: dayPart1GroupPrivate40,
		dayPart2GroupPrivate40: dayPart2GroupPrivate40,
		dayPart3GroupPrivate40: dayPart3GroupPrivate40,
		dayPart12GroupPrivate15: dayPart12GroupPrivate15,
		dayPart23GroupPrivate15: dayPart23GroupPrivate15,
		dayFullGroupPrivate15: dayFullGroupPrivate15,
		dayPart12GroupPrivate30: dayPart12GroupPrivate30,
		dayPart23GroupPrivate30: dayPart23GroupPrivate30,
		dayFullGroupPrivate30: dayFullGroupPrivate30,
		dayPart12GroupPrivate40: dayPart12GroupPrivate40,
		dayPart23GroupPrivate40: dayPart23GroupPrivate40,
		dayFullGroupPrivate40: dayFullGroupPrivate40,						
		cash: cash
	}
}

var renew = function (){
	var acc = this;
	var today = moment ().hour (0).minute (0); // Review and remove later
	var renewable = acc.isRenewable ();
	if (renewable && acc.recursive.recursiveType == 1){
		acc.amount = acc.recursive.baseAmount;
		acc.recursive.lastRenewDate = moment ();
		acc.recursive.renewNum++;
	}
	else{
		//
	}
}

var isRenewable = function (){
	var acc = this;
	var today = moment ().hour (0).minute (0);

	if (acc.recursive.recursiveType == 1){
		if (acc.recursive && acc.recursive.isRecursive && (acc.recursive.renewNum < acc.recursive.maxRenewNum) && moment (acc.recursive.lastRenewDate).isBefore (today)){
			return true;
		}		
	}

	return false;
}

// default solution
var _withdraw = function (amount, acc){
	var remain = amount;

	if (amount > acc.amount){
		remain = amount - acc.amount;
		acc.amount = 0;
	}
	else if (amount <= acc.amount){
		remain = 0;
		acc.amount = acc.amount - amount > 0 ? acc.amount - amount : 0;
	}

	return remain;
}


var applyFormula = function (context, acc){
	var adjustedAmount = context.getUsage ();
	if (acc.formula && acc.formula.value == 1){ // assume checkinTime is always greater than or equal expected on
		checkinTime = moment (context.getCheckinTime ());
		expectedCheckinTime = moment (checkinTime); // assume must be the same date
		expectedCheckinTime.hour (acc.formula.hourStart);
		expectedCheckinTime.minute (acc.formula.minStart);
		hourDiff = (checkinTime.diff (expectedCheckinTime) / 3600000);
		adjustedAmount = hourDiff > 0 ? adjustedAmount + hourDiff : adjustedAmount; // account for only case of checking-in late than expected check-in time
	}

	return adjustedAmount;
}

var withdraw = function (context){
	var acc = this;

	if (acc.unit == 'vnd'){
		var total = context.getTotal ();
		var remain = _withdraw (total, acc);
		context.setTotal (remain);
	}
	else if (acc.unit == 'hour'){
		// var usage = context.getUsage ();
		var usage = applyFormula (context, acc);
		var remain = _withdraw (usage, acc);

		context.setUsage (remain);
		context.genTotal ();
	}
}

var initAccount = function (){
	if (!this.activate){
		max_waiting_days = 60
		this.end = moment (this.start).add (max_waiting_days - 1, 'day').hour (23).minute (59);
	}
	else{
		this.start = moment ().hour (0).minute (0);
		this.end = moment (this.start).add (this.expireDateNum - 1, 'day').hour (23).minute (59);	
	}
}

// Represent a pre paid amount of cash or hour usage number. Can be used later to pay for service usage
var AccountsSchema = new mongoose.Schema({
	name: String,
	price: Number, // 
	amount: Number,
	unit: String,
	desc: String,
	services: [String], // name of service applied
	label: {
		vn: String,
		en: String,
	},
	formula: {},
	recursive: {
		isRecursive: {type: Boolean, default: false},
		lastRenewDate: Date,
		renewNum: {type: Number, default: 0}, // number of renew
		maxRenewNum: Number, // 
		recursiveType: {type: Number}, // daily: 1, monthly: 2, annually: 3
		baseAmount: Number
	},
	start: {type: Date, default: Date.now},
	end: Date,
	expireDateNum: Number, // number of day between start date and end date
	customer: {_id: mongoose.Schema.Types.ObjectId},
	createdAt: {type: Date, default: Date.now},
	grouponable: {type: Boolean, default: false}, // can be grouponed
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
	activate: {type: Boolean, default: false},
});	

AccountsSchema.methods.renew = renew;
AccountsSchema.methods.withdraw = withdraw;
AccountsSchema.methods.isRenewable = isRenewable;
AccountsSchema.methods.initAccount = initAccount;
AccountsSchema.statics.getDefaultAccounts = getDefaultAccounts;

module.exports = mongoose.model ('Accounts', AccountsSchema);


