var mongoose = require('mongoose');

var ordersSchema = mongoose.Schema({
	name:{type:String},
	checkinTime:{type:Date},
	checkoutTime:{type:Date},
	status:{type:Number}
});

mongoose.model ('orders', ordersSchema);