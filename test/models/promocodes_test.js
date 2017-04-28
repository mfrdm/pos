var chai = require ('chai');
var expect = require ('chai').expect;
var Promocodes = require ('../../app_api/models/promocodes');

// var chaiHttp = require ('chai-http');
// var server = require ('../../app');
// var mongoose = require ('mongoose');
// var Promocodes = mongoose.model ('promocodes');
// var should = chai.should ();

describe ('Promotion Code', function (){
	it ('should refuse when required input is not provided', function (done){
		var pc = new Promocodes ();
		pc.validate (function (err){
			expect (err.errors.name).to.exist;
			expect (err.errors.start).to.exist;
			expect (err.errors.end).to.exist;
			done ();
		})
	})

	it ('should refuse non-exist promotion code')
	it ('should refuse expired promotion code')
	it ('should accept valid promotion code')
	it ('should return correct total amount using correct code')

});