// var assert = require('assert'); // node.js core module
// var request = require('request');
// var helper = require ('../../libs/node/helper');
// var TestHelper =  require ('../../libs/node/testHelper');
// var dateFormat = require ('dateFormat');

process.env.NODE_ENV = 'development';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
// var server = 'http://localhost:3000';
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var should = chai.should ();

chai.use (chaiHttp);

describe ('Check-in', function (){
	this.timeout (3000);
	describe.skip ('Checkining', function (){
		var body;
		beforeEach (function (){
			body = {
				data: {
					orderline: [ 
						{ "productName" : "Common", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1 }, 
						{ "productName" : "Coca", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 2 }, 
						{ "productName" : "Poca", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1 } 
					],
					customer:{
						id: new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"),
						firstname: 'Hiep',
						lastname: 'Pham',
						phone: '0965284281',
						email: 'hiep@yahoo.com',
					},
					storeId: new mongoose.Types.ObjectId("58eb474538671b4224745192"),
					staffId: new mongoose.Types.ObjectId("58eb474538671b4224745192"),
				}				
			}
		});

		afterEach (function (done){
			Orders.remove ({'customer.firstname': 'Hiep'}, function (err, data){
				if (err) {
					// console.log (err)
				}
				else {
					Customers.update ({'firstname': 'Hiep', 'lastname': 'Pham'}, {'$pop': {'orders': 1}},
						{upsert: true}, 
						function (err, data){
							if (err) {
								// console.log (err) 
							}
							else {
								done ();
							}
						}
					);
				}
				
			})
		});


		it.skip ('should create a check-in record and update customer order data on /checkin POST', function (done){
			chai.request (server)
				.post ('/checkin/customer/58ff58e6e53ef40f4dd664cd')
				.send (body)
				.end (function (err, res){
					// if (err) console.log (err.stack)
					res.should.have.status (200);
					res.should.be.json;
					res.body.data.should.be.a('object');
					res.body.data.order.should.be.a('object');
					res.body.data.cusData.should.be.a('object');
					done ();
				});
		});

		it.skip ('should be invalid when required input is not provided on /checkin POST', function (done){
			chai.request (server)
				.post ('/checkin/customer/58ff58e6e53ef40f4dd664cd')
				.send ({data: {}})
				.end (function (err, res){
					// console.log (res.body);
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('staffId');
					res.body.errors.should.have.property('storeId');
					res.body.errors.should.have.property('customer.firstname');
					res.body.errors.should.have.property('customer.lastname');
					res.body.errors.should.have.property('customer.phone');
					res.body.errors.should.have.property('customer.id');
					res.body.errors.should.have.property('orderline');
					done ();
				});		
		});
	});

	describe.skip ('Edit checked-in', function (){
		var body, oldData;
		beforeEach (function (){
			body = {
				data: {
					orderline: [ 
						{ "productName" : "Common", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1 }, 
						{ "productName" : "Coca", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 2 }, 
						{ "productName" : "Poca", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1 } 
					],
					customer:{
						id: new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"),
						firstname: 'Hiep',
						lastname: 'Pham',
						phone: '0965284281',
						email: 'hiep@yahoo.com',
					},
					storeId: new mongoose.Types.ObjectId("58eb474538671b4224745192"),
					staffId: new mongoose.Types.ObjectId("58eb474538671b4224745192"),
				}				
			};
		});

		afterEach (function (done){
			// rollback. no need since update the same things. 
			done ()
		});


		it.skip ('should successfully edit all data of a checked-in record', function (done){
			chai.request (server)
				.post ('/checkin/customer/58ff58e6e53ef40f4dd664cd/edit')
				.send (body)
				.end (function (err, res){
					res.should.have.status (200);
					done ();
				});
		});

		it ('should successfully edit part of data of a checked-in record');

	});

	describe.skip ('Read check-in list', function (){
		var query;
		beforeEach (function (){
			query = {
				start: '2017-03-01',
				end: '2017-03-02',
				storeId: '58fdc7e1fc13ae0e8700008a',
				status: 1, // just checked-in
			};
		});

		afterEach (function (){

		});

		it ('should return today checked-in list given no date range');
		it ('should return checked-in list within a date range, given date range');
		it.skip ('should be invalid when required input is not provided /angular/checkin-list', function (done){
			chai.request (server)
				.get ('/angular/checkin-list')
				.query ({})
				.end (function (err, res){
					done ();
				});
		});

	});

})

