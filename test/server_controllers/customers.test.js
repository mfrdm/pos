process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var should = chai.should ();

chai.use (chaiHttp);

describe ('Customer', function (){
	xdescribe ('Create a customer', function (){
		var customer;
		beforeEach (function (){
			customer = {
				firstname: 'Customer_Firstname',
				middlename: 'Customer_Middlename',
				lastname: 'Customer_Lastname',
				gender: 1,
				birthday: new Date ('1989-09-25'),
				phone: '0965999999',
				edu: {},
				isStudent: false,
				email: 'lastmiddlefirst@gmail.com', // manuallt required in some cases
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

		xit ('should successfully create an customer account locally', function (done){
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

		it ('should be invalid when both phone and email are not provided', function (done){
			customer.email = undefined;
			customer.phone = undefined;
			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					if (err){
						// console.log (err);
					}

					res.should.have.status (500);
					res.body.error.code.should.to.equal (1);
					
					done ();
				});
		});

		it ('should be invalid when phone is not valid', function (done){
			customer.phone = '0933213232322';
			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					if (err){
						// console.log (err);
					}

					res.should.have.status (500);
					res.body.error.code.should.to.equal (3);
					
					done ();
				});
		})

		it ('should be invalid when email is not valid', function (done){
			customer.email = 'xxx';
			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					if (err){
						// console.log (err);
					}

					res.should.have.status (500);
					res.body.error.code.should.to.equal (2);
					
					done ();
				});
		});

	});

	describe ('Check exist customers', function (){
		var customers, newCustomers, query;
		beforeEach (function (done){
			query = {fullname: 'james hugos'}
			customers = [
				{firstname: 'James', lastname: 'Hugos', fullname: 'JAMES HUGOS', birthday: '1998-01-01', email: 'hugojames@gmail.com', phone: '0972321321'},
				{firstname: 'James', lastname: 'Hugos', fullname: 'JAMES HUGOS', birthday: '1998-01-01', email: 'hugojames123@gmail.com', phone: '0972321322'},
				{firstname: 'James', lastname: 'Hugos', fullname: 'JAMES HUGOS', birthday: '1998-01-01', email: 'hugojames321@gmail.com', phone: '0972321323'}
			];

			Customers.insertMany (customers, function (err, docs){
				if (err){
					console.log (err);
					return
				}

				newCustomers = docs;
				done ();
			});
		});

		afterEach (function (done){
			var ids = newCustomers.map (function (x, i, arr){
				return x._id;
			});

			Customers.remove ({_id: {$in: ids}}, function (err, result){
				if (err){
					console.log (err);
					return
				}

				done ();
			});
		});

		xit ('should return only one customer with same phone when searched fullname and returned fullnames are different', function (done){
			query.phone = '0972321321';
			query.fullname = 'hugo jane';
			chai.request (server)
				.get ('/customers/exist')
				.query (query)
				.end (function (err, res){
					if (err){
						console.log (err);
					}

					var expectedPhone = '0972321321';
					var expectedEmail = 'hugojames@gmail.com';

					res.should.to.have.status (200);
					res.body.data.should.to.have.lengthOf (1);
					res.body.data[0].phone[0].should.to.equal (expectedPhone);
					res.body.data[0].email[0].should.to.equal (expectedEmail);
					
					done ();
				});

		});

		xit ('should return ony one customer with same email when searched fullname and returned fullnames are different', function (done){
			query.email = 'hugojames123@gmail.com';
			query.fullname = 'hugo ford';
			chai.request (server)
				.get ('/customers/exist')
				.query (query)
				.end (function (err, res){
					if (err){
						console.log (err);
					}

					var expectedPhone = '0972321322';
					var expectedEmail = 'hugojames123@gmail.com';
					res.should.to.have.status (200);
					res.body.data.should.to.have.lengthOf (1);
					res.body.data[0].phone[0].should.to.equal (expectedPhone);
					res.body.data[0].email[0].should.to.equal (expectedEmail);
					
					done ();
				});
		});


		it ('should return some customers with same fullname when having different phone and email', function (done){
			query.email = 'hugojames123xxx@gmail.com';
			query.phone = '0923213256';

			chai.request (server)
				.get ('/customers/exist')
				.query (query)
				.end (function (err, res){
					if (err){
						console.log (err);
					}

					res.should.to.have.status (200);
					res.body.data.should.to.have.lengthOf (3);
					
					done ();
				});			
		});

		it ('should not return any customer with the same birthday and similar fullname, but different email and phone')

	});

	xit ('Read customers', function (){

	});

	xit ('Update a customer', function (){

	});

});

