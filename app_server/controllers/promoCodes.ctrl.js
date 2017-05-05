var mongoose = require ('mongoose');
var PromoCodes = mongoose.model ('promocodes');

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

	}

}