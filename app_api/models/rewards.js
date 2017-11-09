var mongoose = require('mongoose');
var moment = require ('moment');
var Customers = mongoose.model ('customers');

var reset = function (){
	var today = moment ();
	if (moment(this.end).isSameOrBefore (today)){
		this.amount = 0;
	}
}

var setExpireDate = function (start){
	var expired_day_num = 90;
	start = start ? start : moment ();
	end = moment (start).add (expired_day_num - 1, 'day').hour (23).minute (59);
	return end;
}

var _withdraw = function (amount, rwd){
	// only use reward with value of 1000, 2000, ...
	// not use 1500, 1300, ... Remove move the additional value like below first.
	var remain = amount;
	var lowestAmount = 1000;
	var usedReward = rwd.amount;
	usedReward = Math.floor(usedReward / 1000) * 1000;
	nonUsedReward = rwd.amount - usedReward;

	if (amount > usedReward){
		remain = amount - usedReward;
		usedReward = 0;
	}
	else if (amount <= usedReward){
		remain = 0;
		usedReward = usedReward - amount;
	}
	rwd.amount = usedReward + nonUsedReward;
	return remain;
}

var withdraw = function (total){
	var rwd = this;
	var remain = _withdraw (total, rwd);
	return remain;
};

var cashback = function (context, rwd){
	var cashback_pct = context.cashback_pct ? context.cashback_pct : 0.10; // temporary. should be 0.05 
	var total = context.getTotal ();
	var bday_bound = 3; // max day number from the birthday to receive special reward
	if (Customers.isHerBirthday (context.cus, bday_bound)){
		cashback_pct = 0.15;
		return {amount: total * cashback_pct, name: 'cashback-birthday', promocodes: [], createdAt: moment ()};
	}
	else if (rwd.promocodes && rwd.promocodes.length){
		//
	}
	else{
		return {amount: total * cashback_pct, name: 'cashback', promocodes: [], createdAt: moment ()};
	}
};

var RewardSchema = mongoose.Schema ({
	start: {type: Date},
	end: {type: Date},
	amount: Number,
	services: ['group common', 'individual common'],
	source: [{
		_id: mongoose.Schema.Types.ObjectId,
		amount: Number,
		name: {type: String, default: 'gsocc'},
		createdAt: {type: Date},
		promocodes: [{name: String}],
	}],
	customer: {_id: mongoose.Schema.Types.ObjectId},
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],
	note: [{noteDate: Date, content: String}],
});

RewardSchema.methods.reset = reset;
RewardSchema.methods.withdraw = withdraw;
RewardSchema.statics.setExpireDate = setExpireDate;
RewardSchema.statics.cashback = cashback;
module.exports = mongoose.model ('Rewards', RewardSchema);