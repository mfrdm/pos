var server = require ('../../bin/www');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Occupancy = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');
var Orders = mongoose.model ('orders');
var request = require ('request');

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
		var reqOptions =({
	    	url: host+'/transactions/create',
			method: 'POST',
			body:{data:trans},
			json: true
	    })
		request (reqOptions, function(err, response, body){
			if(err){
				console.log(err)
			}
			console.log(cb)
			if(cb){
				cb()
			}else{
				res.json ({data: {message: 'success'}});
			}
		})
	}
}