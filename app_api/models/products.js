var mongoose = require('mongoose');

var productsSchema = mongoose.Schema({
	name:{type:String}
});

mongoose.model ('products', productsSchema);