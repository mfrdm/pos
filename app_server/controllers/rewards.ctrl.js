var moment = require ('moment');
var mongoose = require ('mongoose');
var Rewards = mongoose.model ('Rewards');
var request = require ('request');

module.exports = new RewardsCtrl();

function RewardsCtrl (){
	this.initReward = function (req, res, next){
		var rwd = new Rewards ({
			customer: req.body.customer,
			amount: req.body.amount ? req.body.amount : 0,
			start: moment (),
			end: Rewards.setExpireDate (),			
		});

		rwd.save (function (err, newRwd){
			if (err){
				console.log (err);
				next (err);
			}
			else{
				res.json ({data: newRwd});
				return
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
				next ();
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
				var remain = foundReward.withdraw (total);
				var used = total - remain;
				redeem = used > 0 ? used : total;
				data = {
					_id:foundReward._id, 
					remain: remain,
					total: total,
					paidAmount: used, 
					paidTotal: used,
					name: 'reward'
				};

				res.json ({data: data});
			}			
		})
	};

	this.withdraw = function (req, res, next, cb){
		// call prepareWithdraw first
		// Assume that if can go to the function, reward must be valid, i.e. amount > 0 and not expired.
		var condition = {
			'_id': req.body._id
		};

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

			var total = req.body.total;
			var remain = foundReward.withdraw (total);
			var update = {
				$set: {
					amount: foundReward.amount
				},
				$push: {
					source: {
						_id: req.body.sourceId,
						amount: total - remain < 0 ? -total : -(total - remain),
						createAt: moment (),				
					}
				}				
			};

			Rewards.update (condition, update, function (err, result){
				if (err){
					console.log (err);
					next (err);
					return;
				}

				if (!result){
					next ();
					return;			
				}

				res.json ({data: result});				
			})
		});
	};

	this.setReward = function (req, res, next){
		var condition = {
			'_id': req.body._id
		};

		var update = {
			$inc: {amount: req.body.amount},
			$set: {
				start: moment (),
				end: Rewards.setExpireDate (),
			},
			$push: {
				source: {
					_id: req.body.sourceId,
					amount: req.body.amount,
					createAt: moment (),				
				}
			}
		};

		Rewards.update (condition, update, function (err, result){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (!result){
				next ();
				return;			
			}

			res.json ({data: result})
		});
	};	
}