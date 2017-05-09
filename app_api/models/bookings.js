var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	// _customer: {type: mongoose.Schema.Types.ObjectId, ref:'customers', required:true},//Fix: may ref instead of embedded name
	customer:{
		id: {type: mongoose.Schema.Types.ObjectId},
		firstname: String,
		middlename: String,
		lastname: String,
		email: String
	},
	checkinTime: {type: Date, required: true},
	checkoutTime: {type: Date}, 
	storeId: {type: String},
	// promoteCode: [{type: String}],
	orderline: [
		{
			productId: {type: mongoose.Schema.Types.ObjectId},
			quantity: Number,
		}
	],
	status: {type:Number, default: 3}, 
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	createdAt: {type: Date, default: Date.now},
	message: String, // other requirements from the customer
	
});

mongoose.model ('bookings', bookingSchema);