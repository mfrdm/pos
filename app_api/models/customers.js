var mongoose = require('mongoose');

var customersSchema = mongoose.Schema({
	firstname:{type:String},
	order:[
		{orderId:{type:mongoose.Schema.Types.ObjectId}}
	]
});

mongoose.model ('customers', customersSchema);