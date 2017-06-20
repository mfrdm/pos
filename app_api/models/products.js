var mongoose = require('mongoose');

/*
Explain:
category
{value: 1, name: 'Soft drink'},
{value: 2, name: 'Fast food'},
{value: 3, name: 'Snack'},
{value: 4, name: 'Asset'}
*/

var productsSchema = mongoose.Schema({
	name: {type:String},
	price: {type:Number},
	category: Number,
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: Date,
		explain: String, 
		by: mongoose.Schema.Types.ObjectId,
	}],
	storeId: mongoose.Schema.Types.ObjectId,
	compId: mongoose.Schema.Types.ObjectId, // should be mixed. Can be products of other companies
});

mongoose.model ('products', productsSchema);