var mongoose = require('mongoose');

var ordersSchema = mongoose.Schema({
	name:{type:String},
	checkinTime:{type:Date, default:Date.now},
	checkoutTime:{type:Date},
	status:{type:Number},
	customerId:{type:mongoose.Schema.Types.ObjectId}
});

mongoose.model ('orders', ordersSchema);