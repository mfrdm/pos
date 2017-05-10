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

xdescribe ('Search checking-in customers', function (){
	var newCustomer, customer;
	beforeEach (function (done){
		customer = {
			firstname: 'Hiệp',
			middlename: 'Mạnh',
			lastname: 'Phạm',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: '0972853121',
			edu: {},
			email: 'phammanhhiep89@gmail.com', // manuallt required in some cases
			isStudent: false,
		};

		chai.request (server)
			.post ('/customers/create')
			.send ({data: customer})
			.end (function (err, res){
				if (err) {
					console.log (err);
					return
				}

				newCustomer = res.body.data;
				done ();
			});
	});

	afterEach (function (done){
		Customers.remove ({_id: newCustomer._id}, function (err, data){
			if (err){
				console.log (err);
				return
			}

			done ();
		});
	});

	xit ('should successfully return customers given customer fullname', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: 'Phạm Mạnh Hiệp'})
			.end (function (err, res){
				if (err) console.log (err);
				res.should.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data[0].firstname.should.to.equal ('Hiệp');
				done ();
			});
	});

	xit ('should successfully return customers given customer email', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: 'phammanhhiep89@gmail.com'})
			.end (function (err, res){
				if (err) console.log (err);
				res.should.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data[0].firstname.should.to.equal ('Hiệp');
				done ();
			});
	});


	xit ('should successfully return customers given customer phone', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: '0972853121'})
			.end (function (err, res){
				if (err) console.log (err);
				res.should.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data[0].firstname.should.to.equal ('Hiệp');
				done ();
			});
	});	

	it ('should return customers who are not checked in yet');
	it ('should return active customers')
	it ('should be invalid when required input not found')
});

xdescribe ('Filter checked-in customers', function (){
	// not built yet. Client pull all data at first
});

xdescribe ('Cancel checkin', function (){

});

// NOTICE: YEUGREENSPACE code may expire at the time of testing. Better solution is to create a new code each time testing
describe ('Check-in', function (){
	this.timeout (3000);

	describe ('Checking in', function (){
		var order, customer, newCustomer, newOrder;
		beforeEach (function (done){
			customer = {
				firstname: 'Hiệp',
				middlename: 'Mạnh',
				lastname: 'Phạm',
				gender: 1,
				birthday: new Date ('1989-09-25'),
				phone: '0965284281',
				email: 'phammanhhiep89@gmail.com', // manuallt required in some cases
				edu: {
					school: 'Ngoại thương',
				},
				isStudent: true,
			};

			order = {
				promocodes:[{
					name: 'YEUGREENSPACE',
				}],
				orderline: [ 
					{ "productName" : "Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 }, 
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 } 
				],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",			
			};

			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					if (err){
						console.log (err)
						return
					}

					newCustomer = res.body.data;
					order.customer.firstname = newCustomer.firstname;
					order.customer.lastname = newCustomer.lastname;
					order.customer.email = newCustomer.email;
					order.customer.phone = newCustomer.phone;
					order.customer._id = newCustomer._id;

					done ();
				});

		});

		afterEach (function (done){
			Orders.remove ({_id: newOrder._id}, function (err, result){
				if (err) {
					console.log (err)
					return
				}
				else {
					Customers.remove ({_id: newCustomer._id}, function (err, data){
						if (err) {
							console.log (err)
							return
						}

						done ();

					});
				}

			})
		});

		xit ('should create a check-in record and update customer order when no promocode provided', function (done){
			order.promocodes = [];
			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err);
					}

					newOrder = res.body.data;

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.orderline.should.to.exist;
					res.body.data.orderline.length.should.to.equal (3);
					done ();
				});
		});

		it ('should add valid promo code when provided', function (done){
			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}
					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.orderline.should.to.exist;
					res.body.data.orderline.length.should.to.equal (3);
					done ();
				});			
		});

		xit ('should be invalid when promotion codes are not found', function (done){
			order.promocodes = [{name: 'INVALID_CODE'}];
			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}
					res.should.have.status (404);
					done ();
				});				
		});

		xit ('should be invalid when promotion codes are expired', function (done){
			order.promocodes = [{name: 'EXPIRED_CODE'}];
			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}
					res.should.have.status (404);
					done ();
				});	
		});

		it ('should be invalid when promotion codes are conflict')

		it ('should be invalid when the same item displays more than one time in orderline')
		it ('should be invalid no items in orderline')

		it ('should have createdAt time correct with time of local zone')

		xit ('should be invalid when required input is not provided', function (done){
			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: {}})
				.end (function (err, res){
					if (err){
						console.log (err);
					}
					
					res.body.should.have.property('error');
					res.body.error.errors.should.have.property('staffId');
					res.body.error.errors.should.have.property('storeId');
					res.body.error.errors.should.have.property('customer.firstname');
					res.body.error.errors.should.have.property('customer.lastname');
					res.body.error.errors.should.have.property('customer.phone');
					res.body.error.errors.should.have.property('customer._id');
					res.body.error.errors.should.have.property('orderline');
					done ();
				});		
		});
	});

	xdescribe ('Check-in exception', function (){
		it ('Return correct total and usage when using combo')
		it ('Update correct remain of combo when used in checkout')
	});

	xdescribe ('Edit checked-in', function (){
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


		it ('should successfully edit all data of a checked-in record', function (done){
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

	xdescribe ('Read check-in list', function (){
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
		it ('should be invalid when required input is not provided /angular/checkin-list', function (done){
			chai.request (server)
				.get ('/angular/checkin-list')
				.query ({})
				.end (function (err, res){
					done ();
				});
		});

	});

})

