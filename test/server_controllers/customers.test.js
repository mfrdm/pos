process.env.NODE_ENV = 'development';
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
				firstname: 'Customer_Firstname',
				middlename: 'Customer_Middlename',
				lastname: 'Customer_Lastname',
				gender: 1,
				birthday: new Date ('1989-09-25'),
				phone: ['0965999999', '0972999999'],
				edu: {},
				email: ['lastmiddlefirst@gmail.com', 'otheremail@gmail.com'], // manuallt required in some cases
			};
		})

		afterEach (function (done){
			Customers.remove ({firstname: 'Hiệp'}, function (err, data){
				if (err){
					console.log (err);
					return
				}

				done ();

			});
		})

		it ('should be invalid when being ask to create a customer using registed email')
		it ('should be invalid when being ask to create a customer using registed phone')
		it ('should be valid when being ask to create a customer using registed email after receiving a confirm from staff')
		it ('should be valid when being ask to create a customer using registed phone after receiving a confirm from staff')

		it ('should realizes and record customer is refered by Facebook fanpage');
		it ('should realizes and record customer is refered by Offical website');
		it ('should realizes and record customer is refered by Staff at store');

		it ('should successfully create an customer account locally', function (done){
			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					if (err){
						console.log (err);
					}

					res.should.have.status (200);
					res.body.data.should.to.be.an ('object');
					res.body.data.firstname.should.to.exist;
					res.body.data.lastname.should.to.exist;
					res.body.data.middlename.should.to.exist;
					res.body.data.email.should.to.exist;
					res.body.data.phone.should.to.exist;
					res.body.data._id.should.to.exist;
					res.body.data.isStudent.should.to.be.false;
					done ();
				});
		});

		it ('should validate and insert student status', function (done){
			customer.edu = {
				title: 1,
				school: 'Kinh Te Quoc Dan'
			}

			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					if (err){
						console.log (err);
					}

					res.should.have.status (200);
					res.body.data.should.to.be.an ('object');
					res.body.data.isStudent.should.to.be.true;
					done ();
				});
		});

	});

	xit ('Read customers', function (){

	});

	xit ('Update a customer', function (){

	});

});

