var mongoose = require('mongoose');

/* Explain 
- Status: 

*/

var assetsSchema = mongoose.Schema({
	name: {type: String, required: true},
	quantity: {type: Number, required: true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	status: {type: Number, required: true}, // quality of asset
	storeId: mongoose.Schema.Types.ObjectId,
	compId: mongoose.Schema.Types.ObjectId,
});

mongoose.model ('assets', assetsSchema);