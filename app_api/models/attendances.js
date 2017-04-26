var mongoose = require('mongoose');

var attendancesSchema = mongoose.Schema({
	employeeId: {type:mongoose.Schema.Types.ObjectId},
	workingTime:[
		{
			startTime: Date,
			endTime: Date
		}
	],
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: Date,
		explain: String, 
		by: mongoose.Schema.Types.ObjectId,
	}]
});

mongoose.model ('attendances', attendancesSchema);