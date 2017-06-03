angular
	.module ('posApp')
	.service ('DataPassingService', [DataPassingService])

function DataPassingService (){
	this.passedData = {
		customer: '', // default value
		booking: '',
		layout: ''
	};

	this.set = function (name, data){
		this.passedData[name] = data;
	};

	this.get = function (name){
		return this.passedData[name];
	};

	this.reset = function (name){
		this.passedData[name] = '';
	};
};

