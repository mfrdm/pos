var mongoose = require('mongoose');

var StorageSchema = mongoose.Schema ({ // show export import at specific time
	itemList:[ // At any time, represent number of products/assets added/sold from store
		{
			itemId:mongoose.Schema.Types.ObjectId, 
			quantity:Number,
			price: Number, // cost
			note:String,
			_id : false
		}
	],
	createdAt: {type: Date, default: Date.now},// will be used to calculate current number of products between given times
	updatedAt: {
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	},
	location: {
		_id: {type: mongoose.Schema.Types.ObjectId}, // store id
		name: String,
	},
	staffId: {type: mongoose.Schema.Types.ObjectId}
});

mongoose.model ('storages', StorageSchema);