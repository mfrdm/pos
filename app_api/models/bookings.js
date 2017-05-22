var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	customer:{
		_id: {type: mongoose.Schema.Types.ObjectId},
		fullname: String,
		email: String,
		phone: String,
		isStudent: Boolean,
	},
	checkinTime: {type: Date, required: true},
	checkoutTime: {type: Date},
	service: {
		price: {type: Number, required: true},
		name: {type: String, required: true},
		quantity: Number,
	},
	location: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		name: String,
	},
	staffId: {type: mongoose.Schema.Types.ObjectId},
	status: {type: Number, default: 3}, // default is pendding
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	createdAt: {type: Date, default: Date.now},
	note: String, // other requirements from the customer
	
});

mongoose.model ('bookings', bookingSchema);