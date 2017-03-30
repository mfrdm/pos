var mongoose = require('mongoose');

var companiesSchema = mongoose.Schema({
	name:{type:String}
});

mongoose.model ('companies', companiesSchema);