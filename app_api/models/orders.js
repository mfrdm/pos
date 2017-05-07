var mongoose = require('mongoose');

// method to calculate total usage time
function getUsageTime (){
	var h = (new Date (this.checkoutTime) - new Date (this.checkinTime)) / (60 * 60 * 1000);
	return Number(h.toFixed(1));
}

function getTotal (){
	var order = this;
	var result = order.orderline.reduce (function (acc, val){
		var total;
		if (val.productName.toLowerCase() == 'group private' || val.productName.toLowerCase() == 'group common' || val.productName.toLowerCase() == 'individual common'){
			total = val.quantity * val.price * order.usage + acc;
		}
		else{
			total = val.quantity * val.price + acc;
		}

		return total 
	}, 0);

	return result
}

var combosSchema = new mongoose.Schema({
	name: String,
	usage: Number, // percentage
	createdAt: {type: Date, default: Date.now},
}); 

var ordersSchema = new mongoose.Schema({
	total: {type: Number, min: 0},
	usage: {type: Number, min: 0}, // in minutes
	combos: [combosSchema],
	promocodes: [{
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
	}], // expect only one code applied at a time
	orderline: [{
		_id: {type: mongoose.Schema.Types.ObjectId, required: true},
		productName: {type: String, required: true},
		quantity: {type: String, default: 1, required: true},
		price: {type: Number, required: true},
	}],
	checkinTime: {type: Date, default: Date.now},
	checkoutTime: {type: Date},
	customer: {
		_id: {type: mongoose.Schema.Types.ObjectId, required: true},
		firstname: {type:String, required: true},
		lastname: {type:String, required: true},
		phone: {type: String, required: true},
		email: {type: String}, // optional. added if exists
	},
	storeId: {type: mongoose.Schema.Types.ObjectId, required: true},
	staffId: {type: mongoose.Schema.Types.ObjectId, required: true},	
	status: {type: Number, default: 1}, // 1: checked in, 2: paid and checked out, 3: cancel
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}]
});

ordersSchema.methods.getUsageTime = getUsageTime;
ordersSchema.methods.getTotal = getTotal;

module.exports = mongoose.model ('orders', ordersSchema);