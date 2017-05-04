var mongoose = require('mongoose');

/* Explain
- Type: cost or revenue
- Status: complete, pending, or cancel.
- Category: depend on type. Not defined yet.
*/

var transactionsSchema = new mongoose.Schema({
	tranType: {type: Number, required: true},
	desc: String, // explain
	amount: {type: Number, required: true},
	createdBy: mongoose.Schema.Types.ObjectId, // who made or involve in the transaction
	sourceName: {type: String, required: true}, // the cause
	source: mongoose.Schema.Types.ObjectId, // if exist
	desName: {type: String, required: true}, // the receive
	des: mongoose.Schema.Types.ObjectId,
	
	status: {type: String, required: true},
	
	updateAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],
	createdAt: {type: Date, default: Date.now},	
});

mongoose.model ('transactions', transactionsSchema);