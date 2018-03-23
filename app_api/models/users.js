var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var addrSchema = new mongoose.Schema({
	country: {type: Number, 'default': 1},
	state: {type: Number}, // or city
	addr1: {type: String}, // line 1: district, ...
	addr2: {type: String}, // line 2: apt or section
	zipCode: Number,
});

var eduSchema = new mongoose.Schema({
	school: {type: String},
	title: {type: String}, // master, graduate, 
	start: {type: Date},
	end: {type: Date} 
});	

var workexpSchema = new mongoose.Schema({
	position: {type: Number},
	desc: String,
	jobRef: mongoose.Schema.Types.ObjectId, // if get job from this website
	compName: {type: String, required: true},
	depts: [{name: String, id: mongoose.Schema.Types.ObjectId}],
	salary: Number,
	start: {type: Date},
	end: {type: Date},	
});

var setPermisions = function (){

}

var usersSchema = mongoose.Schema({
	////////////////////////////////// Profile info
	firstname: {type: String, required: true},
	middlename: {type: String},
	lastname: {type: String, required: true},
	birthday: {type: Date, required: true},
	gender: {type: Number, required: true},
	phone: [{type: String, required: true}],
	// tempAddress: addrSchema,
	// perAddress: addrSchema,
	email: [{type: String, required: true}],
	edu: [eduSchema],
	workexp: [workexpSchema], // past working experience 
	/////////////////////////////////// Sercurity
	role: {type: Number, required: true}, //(staff, admin, manager)
	permissions: mongoose.Schema.Types.Mixed, // indicate which resource to be about to access
	////////////////////////////////// Other info
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId // user id of those who made change
	}],
	active: {type: Boolean, default: true},
	deactiveAt: {type: Date},
	edu: [eduSchema],
	// workexp: [workexpSchema], // past working experience 
	deptList: [{deptId: mongoose.Schema.Types.ObjectId, deptName: String, status: Number, in: Date, out: Date}],
	compList: [{compId: mongoose.Schema.Types.ObjectId, compName: String, status: Number, in: Date, out: Date}],
	google: { // not complete
		token: String,
		email: String,
		name: String,
		id: String
	},
	facebook: { // not complete
		token: String,
		email: String,
		name: String,
		id: String
	},
	hash: String,
	salt: String,
	////////////////////////////////// Business management info
	attendance: [{attendingDate: Date, status: Number, explain: String}],
	accountId: mongoose.Schema.Types.ObjectId,
});


usersSchema.methods.setPassword = function (passwd){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
};

usersSchema.methods.validPassword = function (passwd){
	var hash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
	return this.hash === hash
};

usersSchema.methods.generateJwt = function (passwd, dayNum){
	dayNum = dayNum ? dayNum : 365; // subject to CHANGE
	var expiry = new Date ();
	expiry.setDate (expiry.getDate() + dayNum);

	return jwt.sign ( // include fields to return when user login or register
		{	
			_id: this._id,
			phone: this.phone ? this.phone[0] : '',
			firstname: this.firstname,
			lastname: this.lastname,
			email: this.email ? this.email[0] : '',
			permissions: this.permissions,
			exp: parseInt(expiry.getTime() / 1000)
		},
		process.env.JWT_SECRET
	);
};

usersSchema.methods.setPermisions = function (){
	//
}

mongoose.model ('users', usersSchema);