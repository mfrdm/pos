var mongoose = require('mongoose');
var moment = require ('moment');

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
	var remain = amount;
	if (amount > rwd.amount){
		remain = amount - rwd.amount;
		rwd.amount = 0;
	}
	else if (amount <= rwd.amount){
		remain = 0;
		rwd.amount = rwd.amount - amount;
	}
	return remain;
}

var withdraw = function (total){
	var rwd = this;
	var remain = _withdraw (total, rwd);
	return remain
}

var RewardSchema = mongoose.Schema ({
	start: {type: Date},
	end: {type: Date},
	amount: Number,
	services: ['group common', 'individual common'],
	source: [{
		_id: mongoose.Schema.Types.ObjectId,
		amount: Number,
		sourceName: {type: String, default: 'gs_occ'},
		createdAt: {type: Date},
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
module.exports = mongoose.model ('Rewards', RewardSchema);