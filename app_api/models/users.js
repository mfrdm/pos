var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
	firstname:{type:String},
});

mongoose.model ('users', usersSchema);