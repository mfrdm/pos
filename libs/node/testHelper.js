var assert = require ('assert'); // node.js core module
var request = require ('request');

module.exports = function (input){
	this.init = function (input){
		this.input = input;
	}

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
			assert.equal (res.statusCode, code);
			done();				
		});		
	}

	this.testPermission = function (done, invalidValue, key){
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
			assert.equal (res.statusCode, 400);
			assert.equal (body.message, 'No permission');
			done();
		});

		this.input.body[key] = oldVal;
	};

	this.testRequiredInput = function (done) {
		var emptyData= {};
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = emptyData;
		else reqOpt.body = emptyData;		

		request (reqOpt, function (err, res, body){
			assert.equal (res.statusCode, 400);
			assert.equal (body.message, 'Input required');
			done();				
		});	
	};

	this.testInputFormat = function (done, invalidData) {
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = invalidData;
		else reqOpt.body = invalidData;

		request (reqOpt, function (err, res, body){
			assert.equal (res.statusCode, 400);
			assert.equal (body.message, 'Invalid format');
			done();				
		});	

	};

	this.testInputValue = function (done, invalidData) {
		var reqOpt = {
			method: this.input.method,
			url: this.input.url,
			json: true,		
		}

		if (this.input.method == 'GET') reqOpt.qs = invalidData;
		else reqOpt.body = invalidData;

		request (reqOpt, function (err, res, body){
			assert.equal (res.statusCode, 400);
			assert.equal (body.message, 'Invalid value');
			done();				
		});	

	};	

	this.init (input);

}