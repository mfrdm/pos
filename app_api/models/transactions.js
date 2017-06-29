var mongoose = require('mongoose');

/* Explain
- Type: occ - 1, order - 2, inbound - 3, outbound - 4, deposit - 5, others - 6
*/

var transactionsSchema = new mongoose.Schema({
	transType: {type: Number, required: true},
	desc: String, // explain
	amount: {type: Number, required: true},
	createdBy: mongoose.Schema.Types.ObjectId, // who made or involve in the transaction
	sourceId: {type: mongoose.Schema.Types.ObjectId}, // the cause
		
	updateAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],
	createdAt: {type: Date, default: Date.now},	
});

mongoose.model ('transactions', transactionsSchema);