var chai = require ('chai');
var expect = require ('chai').expect;
var Orders = require ('../../app_api/models/orders');

// var chaiHttp = require ('chai-http');
// var server = require ('../../app');
// var mongoose = require ('mongoose');
// var Promocodes = mongoose.model ('promocodes');
// var should = chai.should ();


describe ('Orders', function (){
	var order, val;

	xit ('should be invalid when required input is not provided', function (done){
		order = new Orders ({});
		order.validate (function (err){
			expect (err.errors['customer.id']).to.exist;
			expect (err.errors.storeId).to.exist;
			expect (err.errors.staff).to.exist;
		});

		done ();
	});

	xit ('should be invalid when total < 0', function (done){
		val = {
			total: -100,
		}

		order = new Orders (val);
		order.validate (function (err){
			expect (err.errors.total).to.exist;
			done ();
		});
	});

	it ('should be valid when total > 0', function (done){
		val = {
			total: 100,
		}

		order = new Orders (val);
		order.validate (function (err){
			expect (err.errors.total).to.not.exist;
			done ();
		});
	});	

	xit ('should calculate correct total amount', function (done){
		val = {
			total: 10,
			promoteCode: 'GSCHUALANG50',
		}

	});
});