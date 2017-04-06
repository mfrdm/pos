var mongoose = require('mongoose');

var ordersSchema = mongoose.Schema({
	total: Number,
	orderline: [
		{
			productId: {type: mongoose.Schema.Types.ObjectId},
			productName: {type: String},
			price: {type: String},
			quantity: {type: String}
		}
	],
	checkinTime: {type: Date, default: Date.now},
	checkoutTime: {type: Date},
	customerId: {type: mongoose.Schema.Types.ObjectId, required: true},
	storeId: {type: mongoose.Schema.Types.ObjectId, required: true},
	staffId: {type: mongoose.Schema.Types.ObjectId, required: true},	
	status: {type: Number, default: 1}, // 1: checked in, 2: paid and checked out, 3: cancel
	updateAt: {
		time: {type: Date, required: true},
		explain: {type: Number},
		by: mongoose.Schema.Types.ObjectId,
	}
});

mongoose.model ('orders', ordersSchema);