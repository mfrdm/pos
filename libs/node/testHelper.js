var assert = require ('assert'); // node.js core module
var request = require ('request');

module.exports = function (input){
	this.init = function (input){
		this.input = input;
	}

	this.placeholder = function (done) {
		assert.equal (true, false);
		done ();		
	};

	this.testSuccess = function (done, code){
		code = code ? code : 200;
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = this.input.qs;
		else reqOpt.body = this.input.body;

		request (reqOpt, function (err, res, body){
			console.log (body)
			assert.equal (body.error.status, code);
			done();				
		});		
	};

	this.testPermission = function (done, invalidValue, key, code){
		var code = code ? code : 400;
		key = key ? key : 'userId';

		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET'){
			var oldVal = this.input.qs[key];
			reqOpt.qs = this.input.qs;
			reqOpt.qs[key] = invalidValue;
		}
		else{
			var oldVal = this.input.body[key];
			reqOpt.body = this.input.body;
			reqOpt.body[key] = invalidValue;
		}

		request (reqOpt, function (err, res, body){
			assert.equal (body.error.status, code);
			assert.equal (body.error.message, 'No permission');
			done();
		});

		if (this.input.method == 'GET') this.input.qs[key] = oldVal;
		else this.input.body[key] = oldVal;
	};

	this.testRequiredInput = function (done, code) {
		var code = code ? code : 400;
		var emptyData= {};
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = emptyData;
		else reqOpt.body = emptyData;		

		request (reqOpt, function (err, res, body){
			assert.equal (body.error.status, code);
			assert.equal (body.error.message, 'Input required');
			done();				
		});	
	};

	this.testInputFormat = function (done, invalidData, code) {
		var code = code ? code : 400;
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = invalidData;
		else reqOpt.body = invalidData;

		request (reqOpt, function (err, res, body){
			assert.equal (body.error.status, code);
			assert.equal (body.error.message, 'Invalid format');
			done();				
		});	

	};

	this.testInputValue = function (done, invalidData, code, message) {
		var code = code ? code : 400;
		var message = message ? message : 'Invalid value';
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = invalidData;
		else reqOpt.body = invalidData;

		request (reqOpt, function (err, res, body){
			assert.equal (body.error.status, code);
			assert.equal (body.error.message, message);
			done();				
		});	

	};

	// test from third party package. Cannot expect a message.
	this.testStdInputValue = function (done, invalidData, code) {
		var code = code ? code : 400;
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = invalidData;
		else reqOpt.body = invalidData;

		request (reqOpt, function (err, res, body){
			assert.equal (body.error.status, code);
			done();				
		});	

	};

	this.init (input);

}
