var request = require ('request');
var mongoose = require ('mongoose');
var Transactions = mongoose.model('transactions');
var moment = require ('moment');

module.exports = new MakeTransaction ();

function MakeTransaction (){	
	this.makeTrans = function(type,desc,total,id,res,cb){
		if (process.env.NODE_ENV === 'development'){
			var host = process.env.LOCAL_HOST;
		}else{
			var host = process.env.REMOTE_HOST;
		}
		var trans = {
			transType: type,
			desc: desc, // explain
			amount: total,
			sourceId: id
		}
		console.log(trans)
		// var reqOptions =({
	 //    	url: host+'/transactions/create',
		// 	method: 'POST',
		// 	body:{data:trans},
		// 	json: true
	 //    })
	    var newTrans= new Transactions (trans);
		newTrans.save (function (err, trans){
			if (err){
				next (err);
				return 
			}
			else{
				res.json ({data: {message: 'success'}});
				return
			}
		});
		// request (reqOptions, function(err, response, body){
		// 	if(err){
		// 		console.log(err)
		// 	}
		// 	console.log(body.data)
		// 	if(cb){
		// 		cb()
		// 	}else{
		// 		res.json ({data: {message: 'success'}});
		// 	}
		// })
	}
}