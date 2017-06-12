process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Deposits = mongoose.model ('deposits');
var Customers = mongoose.model ('customers'); 

var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

describe ('Create one account', function (){
	var customer, deposits, newCustomer, newAcc;
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

		deposits = [
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

			deposits.map (function (x, i, arr){
				x.customer = {_id: cus._id}
			});

			done ();

		});

	});

	afterEach (function (done){

		Customers.remove ({_id: newCustomer._id}, function (err, data){
			if (err){
				console.log (err);
				return
			}

			Deposits.remove ({_id: newAcc._id}, function (err, result){
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
			.post ('/deposits/create')
			.send ({data: deposits[0]})
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
					foundCus.deposits.should.include (newAcc._id);
					done ();
				})

			});		
	});

	it ('should create a 3-hour-1-month commbo account and update customer successfully', function (done){
		chai.request (server)
			.post ('/deposits/create')
			.send ({data: deposits[0]})
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
					foundCus.deposits.should.include (newAcc._id);
					done ();
				})

			});				
	})

	// not test since similar to 
	it ('should create a x hours account and update customer successfully')

	it ('should create an account and include group information when customers deposit together', function (){

	})

	it ('should create an account an calculate correct total a customer have to pay when deposit by his own or ')

	it ('should create an account an calculate correct total a customer have to pay when deposit with 3')
});

xdescribe ('update one account', function (){	
})
