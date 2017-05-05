process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var should = chai.should ();

chai.use (chaiHttp);

describe ('Customer', function (){
	it ('Create a customer', function (){
	});

	it.skip ('Read customers', function (){

	});

	it.skip ('Update a customer', function (){

	});

});

