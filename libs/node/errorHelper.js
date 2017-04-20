module.exports = new function ErrorHelper (){
	this.InputRequiredError = function (msg){
		this.name = 'InputRequiredError';
		this.message = msg ? msg : 'Input required';
		var error = new Error (this.message);
		error.name = this.name;
		this.stack = error.stack;
		this.status = 400;
	};

	this.NoPermissionError = function (msg){
		this.name = 'NoPermissionError';
		this.message = msg ? msg : 'No permission';	
		var error = new Error (this.message);
		error.name = this.name;
		this.stack = error.stack;
		this.status = 400;		
	};

	this.InvalidFormatError = function (msg){
		this.name = 'InvalidFormatError';
		this.message = msg ? msg : 'Invalid format';
		var error = new Error (this.message);
		error.name = this.name;
		this.stack = error.stack;
		this.status = 400;			
	};

	this.InvalidValueError = function (msg){
		this.name = 'InvalidValueError';
		this.message = msg ? msg : 'Invalid value';	
		var error = new Error (this.message);
		error.name = this.name;
		this.stack = error.stack;	
		this.status = 400;		
	};

	this.InputRequiredError.prototype = Object.create (Error.prototype);
	this.NoPermissionError.prototype = Object.create (Error.prototype);
	this.InvalidFormatError.prototype = Object.create (Error.prototype);
	this.InvalidValueError.prototype = Object.create (Error.prototype);

}();