var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	customerId: {type: mongoose.Schema.Types.ObjectId},
	checkinTime: {type: Date, required: true},
	checkoutTime: {type: Date},
	storeId: {type: String},
	productId: {type: mongoose.Schema.Types.ObjectId},
	status: {type:Number, default: 1}, // 1:accepted, 2:refused, 3:waiting, 4:cancel
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	createdAt: {type: Date, default: Date.now},
	message: String // other requirements from the customer
	quantity: Number,
});

mongoose.model ('bookings', bookingSchema);