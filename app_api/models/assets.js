var mongoose = require('mongoose');

var assetsSchema = mongoose.Schema({
	name:{type:String},
	quantity:{type:String}
});

mongoose.model ('assets', assetsSchema);