var mongoose = require('mongoose');

var customersSchema = mongoose.Schema({
	firstname:{type:String}
});

mongoose.model ('customers', customersSchema);