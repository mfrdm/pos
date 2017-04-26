var mongoose = require('mongoose');

var eduSchema = new mongoose.Schema({
	school: {type: String, required: true},
	title: {type: String, required: true}, // master, graduate, 
	start: {type: Date, required: true},
	end: {type: Date, required: true} 
});	

var customersSchema = mongoose.Schema({
	firstname: {type:String, required: true},
	lastname: {type:String, required: true},
	gender: {type: Number, required: true},
	birthday: {type: Date, required: true},
	phone: {type: String, required: true},
	email: {type: String, required: true},
	edu: [eduSchema],
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	orders: [{orderId:{type: mongoose.Schema.Types.ObjectId}}],
	bookings: [{type:mongoose.Schema.Types.ObjectId}],
});

mongoose.model ('customers', customersSchema);