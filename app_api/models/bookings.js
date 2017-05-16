var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	customer:{
		id: {type: mongoose.Schema.Types.ObjectId},
		firstname: String,
		middlename: String,
		lastname: String,
		email: String,
		phone: String,
		isStudent: Boolean,
	},
	checkinTime: {type: Date, required: true},
	checkoutTime: {type: Date},
	service: {
		price: {type: Number, required: true},
		name: {type: String, required: true},
	},
	storeId: {type: mongoose.Schema.Types.ObjectId},
	staffId: {type: mongoose.Schema.Types.ObjectId},
	status: {type: Number, default: 3}, // default is pendding
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	createdAt: {type: Date, default: Date.now},
	message: String, // other requirements from the customer
	
});

mongoose.model ('bookings', bookingSchema);