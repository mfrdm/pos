var moment = require ('moment');
var mongoose = require ('mongoose');
var Rewards = mongoose.model ('Rewards');
var request = require ('request');

module.exports = new RewardsCtrl();

function RewardsCtrl (){
	this.initReward = function (req, res, next, cb){
		var rwd = new Rewards ({
			customer: req.body.customer,
			amount: req.body.amount ? req.body.amount : 0,
			start: moment (),
			end: Rewards.setExpireDate (),	
			services: ['group common', 'individual common']		
		});

		rwd.save (function (err, newRwd){
			if (err){
				console.log (err);
				next (err);
				return;
			}
			
			if (cb){
				cb (newRwd)
			}
			else{
				res.json ({data: newRwd});
			}					
		});
	};

	this.getReward = function (req, res, next, cb){
		// the first step before update reward. So if reward expired, it should be detect here.
		var condition = {
			'customer._id': req.query.customerId,
			'services': req.query.service
		}

		Rewards.findOne (condition, function (err, foundReward){
			if (err){
				console.log (err);
				next (err);
				return;
			}
			if (!foundReward){
				if (cb){
					cb ([]);
				}
				else{
					res.json ({data: []});
				}
				return;	
			}

			var beforeResetAmount = foundReward.amount;
			foundReward.reset ();
			if (beforeResetAmount != foundReward.amount && foundReward.amount == 0){
				Rewards.update (condition, {$set: {amount: 0}, $push: {source: {sourceName: 'reward_system', amount: -beforeResetAmount, createdAt: moment ()}}}, function (err, result){
					if (err){
						console.log (err);
						next (err);
						return;
					}

					var rwd = [{amount: 0, _id: foundReward._id, end: foundReward.end}];
					if (cb){
						cb (rwd);
					}
					else{
						res.json ({data: rwd});
					}
					
				});
			}
			else{
				var rwd = [{amount: beforeResetAmount, _id: foundReward._id, end: foundReward.end}];
				if (cb){
					cb (rwd);
				}
				else{
					res.json ({data: rwd});
				}
			}
			
		});
	};

	this.prepareWithdraw = function (req, res, next){
		// call get reward first
		// assume the reward is still valid
		var condition = {_id: req.query.rewardId};
		var total = req.query.total;

		Rewards.findOne (condition, function (err, foundReward){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (!foundReward){
				next ();
				return;			
			}
			else{
				var remainTotal = foundReward.withdraw (total);
				var used = total - remainTotal;
				used = used > 0 ? used : total;
				data = {
					occ: {
						total: remainTotal
					},
					rwd:{
						_id: foundReward._id, 
						amount: foundReward.amount,
						paidAmount: used, 
						paidTotal: used,
						name: 'reward'						
					}

				};

				res.json ({data: data});
			}			
		})
	};

	this.withdraw = function (req, res, next, cb){
		var rwd = req.body.rwd;
		var occ = req.body.occ;
		var cus = req.body.cus;
		var cashback = Rewards.cashback (occ, rwd, cus);
		var amount = rwd.amount + cashback.amount;
		var condition = {_id: rwd._id};
		var update = {
			$set:{
				amount: amount,
				start: moment (),
				end: Rewards.setExpireDate ()
			}
		};

		if (rwd.source){
			update.$push = {
				source:{
					$each: [rwd.source, cashback]
				}
			}
		}
		else{
			update.$push = {source: cashback}			
		}

		Rewards.update (condition, update, function (err, result){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (cb){
				cb (result);
			}
			else{
				res.json ({data: result});
			}						
		});
	};

	// not use
	this.setReward = function (req, res, next){
		//
	};	
}