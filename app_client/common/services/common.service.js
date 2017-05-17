angular
	.module ('posApp')
	.service ('dataPassingService', [dataPassingService])

function dataPassingService (){
	this.passedData = {
		curCustomer: '', // default value
	};

	this.set = function (data, name){
		this.passedData[name] = data;
	};

	this.get = function (name){
		return this.passedData[name];
	}
};

