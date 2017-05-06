var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var eduSchema = new mongoose.Schema({
	school: {type: String},
	title: {type: String}, // master, graduate, 
	start: {type: Date},
	end: {type: Date}, // max = start + 6 years
});	

var combosSchema = new mongoose.Schema ({
	_id: mongoose.Schema.Types.ObjectId, 
	value: String,
	product: {
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
	},
	expired: Date,
});

var customersSchema = mongoose.Schema({
	firstname: {type:String, required: true},
	middlename: {type:String},
	lastname: {type:String, required: true},
	gender: {type: Number, required: true},
	birthday: {type: Date, required: true},
	phone: [{type: String}],
	email: [{type: String}], // manuallt required in some cases
	edu: [eduSchema],
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	orders: [{orderId:{type: mongoose.Schema.Types.ObjectId}}],
	bookings: [{type:mongoose.Schema.Types.ObjectId, ref:'bookings'}],
	promoteCode: [{code: String, expire: Date,}],
	balance: {
		oneDay: [combosSchema],
		threeDays: [combosSchema],
		oneMonth: [combosSchema],
		threeMonths: [combosSchema],
		oneYear: [combosSchema],	
	},
	////////// Login Google
	google: { // not complete
		token: String,
		email: String,
		name: String,
		id: String
	},
	////////// Login Facebook
	facebook: { // not complete
		token: String,
		email: String,
		name: String,
		id: String
	},
	///////// Login local
	hash: String, 
	salt: String,


});

customersSchema.methods.setPassword = function (passwd){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
};

customersSchema.methods.validPassword = function (passwd){
	var hash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
	return this.hash === hash
};

customersSchema.methods.generateJwt = function (passwd, dayNum){
	dayNum = dayNum ? dayNum : 365; // subject to CHANGE
	var expiry = new Date ();
	expiry.setDate (expiry.getDate() + dayNum);

	return jwt.sign ( // include fields to return when user login or register
		{	
			_id: this._id,
			phone: this.phone,
			firstname: this.firstname,
			lastname: this.lastname,
			exp: parseInt(expiry.getTime() / 1000)
		},
		process.env.JWT_SECRET
	);
};


mongoose.model ('customers', customersSchema);