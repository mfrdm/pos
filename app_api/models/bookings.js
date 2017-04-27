var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	customerId: {type: mongoose.Schema.Types.ObjectId},
	checkinTime: {type: Date, required: true},
	checkoutTime: {type: Date}, 
	storeId: {type: String},
	promoteCode: [{type: String}],
	orderline: [
		{
			productId: {type: mongoose.Schema.Types.ObjectId},
			quantity: Number,
		}
	],
	status: {type:Number, default: 1}, 
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	createdAt: {type: Date, default: Date.now},
	message: String, // other requirements from the customer
	
});

mongoose.model ('bookings', bookingSchema);