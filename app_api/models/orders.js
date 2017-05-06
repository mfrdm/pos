var mongoose = require('mongoose');

var getTotal = function (val) {
	if (this.promoteCode === 'GSCHUALANG50'){
		return val * 0.5
	}
}

var ordersSchema = new mongoose.Schema({
	total: {type: Number, get: getTotal, min: 0},
	promoteCode: [{type: String}], // expect only one code applied at a time
	orderline: [{
		// id: {type: mongoose.Schema.Types.ObjectId, required: true},
		productName: {type: String, required: true},
		quantity: {type: String, default: 1, required: true}
	}],
	checkinTime: {type: Date, default: Date.now},
	checkoutTime: {type: Date},
	customer: {
		id: {type: mongoose.Schema.Types.ObjectId, required: true},
		firstname: {type:String, required: true},
		lastname: {type:String, required: true},
		phone: {type: String, required: true},
		email: {type: String}, // optional. added if exists
	},
	storeId: {type: mongoose.Schema.Types.ObjectId, required: true},
	staffId: {type: mongoose.Schema.Types.ObjectId, required: true},	
	status: {type: Number, default: 1}, // 1: checked in, 2: paid and checked out, 3: cancel
	updateAt: {
		time: {type: Date},
		explain: {type: Number},
		by:{type: mongoose.Schema.Types.ObjectId}, // staff id
	}
});


module.exports = mongoose.model ('orders', ordersSchema);