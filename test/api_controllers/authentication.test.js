process.env.NODE_ENV = 'development';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Users = mongoose.model ('users');
var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

describe ('Authentication', function (){
	this.timeout (3000);

	describe ('Register', function (){
		var customer;

		beforeEach (function (){
			customer = {
				firstname: 'Customer_Firstname',
				middlename: 'Customer_Middlename',
				lastname: 'Customer_Lastname',
				gender: 1,
				birthday: new Date ('1989-09-25'),
				phone: ['0965999999', '0972999999'],
				email: ['lastmiddlefirst@gmail.com', 'otheremail@gmail.com'],
				password: '123456',
			};

		});

		afterEach (function (done){
			Users.remove ({firstname: 'Customer_Firstname'}, function (err, result){
				if (err){
					console.log (err);
					return
				}
				
				done ();
			})
		})

		it ('should create an account successfully', function (done){
			chai.request (server)
				.post ('/api/register')
				.send (customer)
				.end (function (err, res){
					if (err){
						console.log (err)
					}

					res.should.to.have.status (200);
					done ();
				});
		});

	});

	describe ('Login', function (){

	});	
});