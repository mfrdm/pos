var validator = require ('validator');
var mongoose = require ('mongoose');
var Transactions = mongoose.model('transactions');
var moment = require ('moment');

module.exports = new TransactionCtrl();

function TransactionCtrl (){
	this.createTrans = function (req, res, next){
		console.log(req.body.data)
		var newTrans= new Transactions (req.body.data);
		newTrans.save (function (err, trans){
			if (err){
				next (err);
				return 
			}
			else{
				res.json ({data: trans});
				return
			}
		});
	}

	this.readTrans = function(req, res, next){
		var start = JSON.parse(req.query.start)
		var end = JSON.parse(req.query.end)
		Transactions.find({createdAt:{$gte:start, $lte:end}}, function(err, data){
			res.json({data:data})
		})
	};

	this.editTrans = function(req, res, next){
		Transactions.findByIdAndUpdate(req.params.transId, req.body.data, {new: true}, function(err, trans){
			if (err){
				next (err)
				return
			}
			else{
				res.json ({data: trans});
				return
			}
		})
	};
}
