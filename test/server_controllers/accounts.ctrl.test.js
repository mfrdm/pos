process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Accounts = mongoose.model ('accounts');
var Customers = mongoose.model ('customers'); 

var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

describe ('Create one account', function (){
	var customer, accounts, newCustomer, newAcc;
	beforeEach (function (done){
		customer = {
			firstname: 'A',
			middlename: 'B',
			lastname: 'C',
			fullname: 'C B A',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: '0965999999',
			edu: {},
			email: 'lastmiddlefirst@gmail.com', // manuallt required in some cases
			isStudent: false,
			checkinStatus: false,
		};

		accounts = [
			{
				amount: 24,
				unit: 'hour',
				start: moment ().hour (0).minute (0),
				end: moment ().hour (23).minute (59),
				services: ['group common', 'individual common']
			},
			{
				amount: 3,
				unit: 'hour',
				start: moment ().hour (0).minute (0),
				end: moment ().hour (23).minute (59),
				services: ['group common', 'individual common']
			}

		]

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus;

			accounts.map (function (x, i, arr){
				x.customer = {_id: cus._id}
			});

			done ();

		});

	});

	afterEach (function (){

		Customers.remove ({_id: newCustomer._id}, function (err, data){
			if (err){
				console.log (err);
				return
			}

			Accounts.remove ({_id: newAcc._id}, function (err, result){
				if (err) {
					// console.log (err)
					return
				}

				done ();					
			});
		});
	});


	it ('should create a 1-day commbo account and update customer successfully', function (done){
		chai.request (server)
			.post ('/accounts/create')
			.send ({data: accounts[0]})
			.end (function (err, res){
				if (err) console.log (err);

				res.should.have.status (200);
				res.body.data.should.to.exist;

				newAcc = res.body.data;

				Customers.findOne ({_id: newCustomer._id}, function (err, foundCus){
					if (err) {
						console.log (err)
					}

					foundCus.should.to.exist;
					foundCus.accounts.should.include (newAcc._id);
					done ();
				})

			});		
	});

	it ('should create a 3-hour-1-month commbo account and update customer successfully', function (done){
		chai.request (server)
			.post ('/accounts/create')
			.send ({data: accounts[0]})
			.end (function (err, res){
				if (err) console.log (err);

				res.should.have.status (200);
				res.body.data.should.to.exist;

				newAcc = res.body.data;

				Customers.findOne ({_id: newCustomer._id}, function (err, foundCus){
					if (err) {
						console.log (err)
					}

					foundCus.should.to.exist;
					foundCus.accounts.should.include (newAcc._id);
					done ();
				})

			});				
	})

	// not test since similar to 
	it ('should create a x hours account and update customer successfully')
})

describe ('update one account', function (){
	
})
