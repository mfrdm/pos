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
		expireDateNum: 30,
		grouponable: false,
	};

	var oneDayCommon = {
		name: '1dCommon',
		price: 80000, // 
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
		price: 400000, // 
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
		grouponable: false,
	};	

	// var fiveHoursOneDayThirtyDaysCommon = {
	// 	name: '5h1d30dCommon',
	// 	price: 800000, // 
	// 	amount: 6,
	// 	unit: 'hour',
	// 	desc: "",
	// 	services: ['group common', 'individual common'], // name of service applied
	// 	label: {
	// 		vn: "Combo 30 ngày / 5 giờ 1 ngày",
	// 		en: "Combo 30 days / 5 hours per day",
	// 	},
	// 	recursive: {
	// 		isRecursive: true,
	// 		lastRenewDate: new Date (),
	// 		renewNum: 0, // number of renew
	// 		maxRenewNum: 29, // 
	// 		recursiveType: 1, // daily: 1, monthly: 2, annually: 3
	// 		baseAmount: 6
	// 	},
	// 	expireDateNum: 30,
	// 	grouponable: false,
	// };


	var twentyHoursCommon = {
		name: '20h7dCommon',
		price: 225000, // 
		amount: 20,
		unit: 'hour',
		desc: "",
		services: ['group common', 'individual common'], // name of service applied
		label: {
			vn: "Combo 20 giờ / 7 ngày",
			en: "Combo 20 hours / 7 day",
		},
		recursive: {
			isRecursive: false,
		},
		expireDateNum: 7,
		grouponable: false,
	}

	return {
		oneDayCommon: oneDayCommon,
		threeDaysCommon: threeDaysCommon,
		threeHoursOneDayThirtyDaysCommon: threeHoursOneDayThirtyDaysCommon,
		twentyHoursCommon: twentyHoursCommon,
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
		acc.amount = acc.amount - amount >= 0 ? acc.amount - amount : 0;
	}

	return remain;
}

var withdraw = function (context){
	var acc = this;

	if (acc.unit == 'vnd'){
		var total = context.getTotal ();
		var remain = _withdraw (total, acc);
		context.setTotal (remain);
	}
	else if (acc.unit == 'hour'){
		var usage = context.getUsage ();
		var remain = _withdraw (usage, acc);
		context.setUsage (remain);
		context.genTotal ();
	}
}


var initAccount = function (){
	this.end = moment (this.start).add (this.expireDateNum - 1, 'day').hour (23).minute (59);
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
});	

AccountsSchema.methods.renew = renew;
AccountsSchema.methods.withdraw = withdraw;
AccountsSchema.methods.isRenewable = isRenewable;
AccountsSchema.methods.initAccount = initAccount;
AccountsSchema.statics.getDefaultAccounts = getDefaultAccounts;

module.exports = mongoose.model ('Accounts', AccountsSchema);


