var mongoose = require('mongoose');
var moment = require ('moment');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var eduSchema = new mongoose.Schema({
	school: {type: String},
	title: {type: String}, // master, graduate, 
	start: {type: Date},
	end: {type: Date}, // max = start + 6 years
});	

var customersSchema = mongoose.Schema({
	firstname: {type:String},
	middlename: {type:String},
	lastname: {type:String},
	fullname: {type: String},
	gender: Number,
	birthday: {type: Date},
	phone: [{type: String}],
	email: [{type: String}], // manuallt required in some cases
	edu: [eduSchema],
	isStudent: {type: Boolean, default: false},
	createdAt: {type: Date, default: Date.now},
	createdBy: { 
		storeId: mongoose.Schema.Types.ObjectId, // if not created by POS
		staffId: mongoose.Schema.Types.ObjectId
	}, 
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	occupancy: [{type: mongoose.Schema.Types.ObjectId}],
	bookings: [{type:mongoose.Schema.Types.ObjectId}],
	accounts: [{type:mongoose.Schema.Types.ObjectId, ref: 'Accounts'}],
	checkinStatus: {type: Boolean, default: false},
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
	referer: { // indicate customer account created from an event, at store, or direct in website.
		_id: {type:mongoose.Schema.Types.ObjectId},
		name: String, 
	}

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

customersSchema.methods.getPublicFields = function (){
	return {
		_id: this._id,
		firstname: this.firstname,
		middlename: this.middlename,
		lastname: this.lastname,
		email: this.email[0],
		phone: this.phone[0],
		birthday: this.birthday,
		isStudent: this.isStudent,
	}
}

customersSchema.statics.isHerBirthday = function (cus){
	if (cus.birthday){
		var today = moment ();
		var birthday = moment (cus.birthday);
		if (birthday.month () == today.month() && birthday.date () == today.date ()){
			return true;
		}
		else{
			return false;
		}
	}
	else {
		return false;
	}
}

mongoose.model ('customers', customersSchema);