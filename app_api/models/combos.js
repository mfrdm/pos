var mongoose = require ('mongoose');

var combosSchema = new mongoose.Schema({
	val: String,
	desc: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],

});

mongoose.model ('combos', combosSchema);