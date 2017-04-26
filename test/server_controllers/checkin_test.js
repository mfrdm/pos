// var assert = require('assert'); // node.js core module
// var request = require('request');
// var helper = require ('../../libs/node/helper');
// var TestHelper =  require ('../../libs/node/testHelper');
// var dateFormat = require ('dateFormat');

process.env.CONNECTED_DB = 'local';
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
			};
		});

		afterEach (function (done){
			Orders.remove ({'customer.firstname': 'Hiep'}, function (err, data){
				if (err) console.log (err)
				else {
					Customers.update ({'firstname': 'Hiep', 'lastname': 'Pham'}, {'$pop': {'orders': 1}},
						{upsert: true}, 
						function (err, data){
							if (err) { console.log (err) }
							else {
								done ();
							}
						}
					);
				}
				
			})
		});


		it ('should create a check-in record and update customer order data on /checkin POST', function (done){
			chai.request (server)
				.post ('/checkin/58ff58e6e53ef40f4dd664cd')
				.send (body)
				.end (function (err, res){
					if (err) console.log (err.stack)
					res.should.have.status (200);
					res.should.be.json;
					res.body.data.should.be.a('object');
					res.body.data.orderData.should.be.a('object');
					res.body.data.cusData.should.be.a('object');
					done ();
				});
		});

		it ('should be invalid when required input is not provided on /checkin POST', function (done){
			chai.request (server)
				.post ('/checkin/58ff58e6e53ef40f4dd664cd')
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
					// res.body.errors.should.have.property('orderline.productName');
					// res.body.errors.should.have.property('orderline.quantity');
					// res.body.errors.should.have.property('orderline.productId');
					done ()

				});		
		});
	});

	describe.skip ('Edit checked-in', function (){
		var body, oldData;

		beforeEach (function (done){
			body = {
				data: {
					_id : new mongoose.Types.ObjectId("58fdb4131b2a634762cc7613"),
					orderline: [ 
						{ "productName" : "Common", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 10000 }, 
						{ "productName" : "Coca", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1000 }, 
						{ "productName" : "Poca", "id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 10000 } 
					],
					customer: {
						id: new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"),
						firstname: 'Hiep',
						lastname: 'Pham',
						phone: '0965284281',
						email: 'hiep@yahoo.com',
					},
					checkinTime: new Date ("2017-04-20T09:25:04.667Z"),
					updateAt: {
						time: Date.now (),
						explain: 'Test update',
						by: new mongoose.Types.ObjectId("58eb474538671b4224745192"), // staff id
					},				
					storeId: new mongoose.Types.ObjectId("58eb474538671b4224745192"),
					staffId: new mongoose.Types.ObjectId("58eb474538671b4224745192"),
				}
			};

			// read check-in first and store as local
			done ()
			
		});

		afterEach (function (done){
			// rollback
			done ()
		});


		it ('should successfully edit a checked-in record', function (done){
			chai.request (server)
				.post ('/checkin/58ff58e6e53ef40f4dd664cd/edit')
				.send (body)
				.end (function (err, res){
					res.should.have.status (200);
					done ()
				});
		});

	});

	describe.skip ('Read check-in list', function (){
		beforeEach (function (){

		});

		afterEach (function (){

		});

		it ('should be invalid when required input is not provided /angular/checkin-list', function (done){
			chai.request (server)
				.get ('/angular/checkin-list')
				.query ({
					start: '2017-03-01',
					end: '2017-03-02',
					storeId: '58fdc7e1fc13ae0e8700008a',
					status: 1, // just checked-in
				})
				.end (function (err, res){
					res.should.have.status (200);
					done ();
				})
		});

		it ('should successfully return check-in records')
		it ('should return only check-in records in a given period of time');

	});


})

