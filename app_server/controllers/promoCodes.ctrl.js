var mongoose = require ('mongoose');
var PromoCodes = mongoose.model ('Promocodes');
var moment = require ('moment');

module.exports = new PromoCodesCtrl();

function PromoCodesCtrl() {
	this.createOneCode = function (req, res, next){
		var pc = new PromoCodes (req.body.data);
		pc.save (function (err, data){
			if (err){
				next (err);
				return
			}
			if (Object.keys (data).length){
				res.json ({data: data});
			}
			else {
				next ();
			}
		})
	};

	this.updateOneCode = function (req, res, next){
	};

	this.readOneCodeById = function (req, res, next){
		PromoCodes.findById ({_id: req.params.codeId}, function (err, data){
			if (err){
				next (err)
				return
			}
			if (data && Object.keys(data).length){
				res.json({data: data});
			}
			else{
				next ();
			}
			
		});
	};

	this.readSomeCodes = function (req, res, next){
		var today = new Date ();
		var conditions = {
			start: {$lte: today}, 
			end: {$gte: today},
			excluded: false,
		};

		PromoCodes.find (conditions, {name: 1, label: 1, codeType: 1, conflict: 1, override: 1, services:1}, function (err, foundCodes){
			if (err){
				next (err);
				return
			}

			res.json ({data: foundCodes});
		});
	}

}