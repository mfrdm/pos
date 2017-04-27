var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	// _customer: {type: mongoose.Schema.Types.ObjectId, ref:'customers', required:true},//Fix: may ref instead of embedded name
	customer:{
		id: {type: mongoose.Schema.Types.ObjectId},
		firstname: String,
		lastname: String,
		email: String
	},
	checkinTime: {type: Date, required: true},
	checkoutTime: {type: Date},
	// _storeId: {type: mongoose.Schema.Types.ObjectId, ref:'depts'}, ///Fix: may ref instead of store name
	// _productId: {type: mongoose.Schema.Types.ObjectId, ref:'products'},
	storeName: {type:String},
	productName: {type:String},
	status: {type:Number, default: 3}, // 1:accepted, 2:refused, 3:waiting, 4:cancel
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	createdAt: {type: Date, default: Date.now},
	message: String, // other requirements from the customer
	quantity: Number,
});

mongoose.model ('bookings', bookingSchema);