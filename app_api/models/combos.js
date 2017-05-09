var mongoose = require ('mongoose');



function useCombo (name){
	switch (name){
		case 'oneDay':
			break;
		case 'threeDays':
			break;
		case 'oneMonth':
			break;
		case 'threeMonths':
			break;
		case 'oneYear':
			break;
		default:
			break;
	}
}


var combosSchema = new mongoose.Schema({
	value: String,
	desc: String,
	unit: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{ 
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],

});

mongoose.model ('combos', combosSchema);