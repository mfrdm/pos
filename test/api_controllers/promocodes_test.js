var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('Promocodes');
var should = chai.should ();

describe ('Promotion codes', function (){
	it ('should add a new promotion code')
	it ('should update a promotion code given its id')
	it ('should read all promotion codes')
	it ('should read a promotion code given its id')
});