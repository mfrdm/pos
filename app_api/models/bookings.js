var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	customerId:{type:mongoose.Schema.Types.ObjectId},
	checkinTime:{type:Date},
	checkoutTime:{type:Date},
	productId:{type:mongoose.Schema.Types.ObjectId},
	status:{type:Number,default:3},
	updatedTime:{type:Date, default:Date.now}
});

mongoose.model ('bookings', bookingSchema);