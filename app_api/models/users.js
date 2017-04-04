var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
	firstname:{type:String},
	role:{type:String},
	permission:{type:Number}
});

mongoose.model ('users', usersSchema);