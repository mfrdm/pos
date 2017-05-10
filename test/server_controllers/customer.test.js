process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var should = chai.should ();

chai.use (chaiHttp);

describe ('Customer', function (){
	describe ('Create a customer', function (){
		var customer;
		beforeEach (function (){
			customer = {
				firstname: 'Hiệp',
				middlename: 'Mạnh',
				lastname: 'Phạm',
				gender: 1,
				birthday: new Date ('1989-25-09'),
				phone: '0965284281',
				email: 'phammanhhiep89@gmail.com', // manuallt required in some cases
			}
		})

		afterEach (function (done){
			Customers.remove ({firstname: 'Hiệp'}, function (err, data){
				if (err){
					console.log (err);
					return
				}

			});
		})

		it ('should successfully create an customer account locally', function (done){
			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					res.should.have.status (200);
					done ();
				});
		});

	});

	it.skip ('Read customers', function (){

	});

	it.skip ('Update a customer', function (){

	});

});

