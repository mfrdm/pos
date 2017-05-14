process.env.NODE_ENV = 'development';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes')
var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

xdescribe ('Search checking-in customers', function (){
	this.timeout (3000);

	var newCustomer, customer;
	beforeEach (function (done){
		customer = {
			firstname: 'Customer_Firstname',
			middlename: 'Customer_Middlename',
			lastname: 'Customer_Lastname',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: ['0965999999', '0972999999'],
			edu: {},
			email: ['lastmiddlefirst@gmail.com', 'otheremail@gmail.com'], // manuallt required in some cases
			isStudent: false,
			checkinStatus: false,
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

	it ('should successfully return non-checked-in customers given customer fullname', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: 'Customer_Lastname Customer_Middlename Customer_Firstname'})
			.end (function (err, res){
				if (err) console.log (err);
				res.should.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data[0].firstname.should.to.equal (customer.firstname);
				res.body.data[0].middlename.should.to.equal (customer.middlename);
				res.body.data[0].lastname.should.to.equal (customer.lastname);
				res.body.data[0].phone[0].should.to.equal (customer.phone[0]);
				res.body.data[0].email[0].should.to.equal (customer.email[0]);
				res.body.data[0].checkinStatus.should.to.be.false;
				res.body.data[0].isStudent.should.to.be.false;
				done ();
			});
	});

	it ('should successfully return non-checked-in customers given customer email', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: customer.email[0]})
			.end (function (err, res){
				if (err) console.log (err);
				res.should.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data[0].firstname.should.to.equal (customer.firstname);
				res.body.data[0].middlename.should.to.equal (customer.middlename);
				res.body.data[0].lastname.should.to.equal (customer.lastname);
				res.body.data[0].phone[0].should.to.equal (customer.phone[0]);
				res.body.data[0].email[0].should.to.equal (customer.email[0]);
				res.body.data[0].checkinStatus.should.to.be.false;
				res.body.data[0].isStudent.should.to.be.false;
				done ();
			});
	});


	it ('should successfully return non-checked-in customers given customer phone', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: customer.phone[0]})
			.end (function (err, res){
				if (err) console.log (err);
				res.should.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data[0].firstname.should.to.equal (customer.firstname);
				res.body.data[0].middlename.should.to.equal (customer.middlename);
				res.body.data[0].lastname.should.to.equal (customer.lastname);
				res.body.data[0].phone[0].should.to.equal (customer.phone[0]);
				res.body.data[0].email[0].should.to.equal (customer.email[0]);
				res.body.data[0].checkinStatus.should.to.be.false;
				res.body.data[0].isStudent.should.to.be.false;
				done ();
			});
	});	

	it ('should return active customers')
	it ('should be invalid when required input not found')
});

xdescribe ('Filter checked-in customers', function (){
	// not built yet. Client pull all data at first
});

xdescribe ('Cancel checkin', function (){
	// not built yet. Have to checkout first and checkin again. 
});

xdescribe ('Validate promotion code', function (){
	var newCodes, codeNames;
	beforeEach (function (done){
		var codes = [
			{
				name: 'PROMOCODE1',
				start: moment (),
				end: moment ().add (5, 'day'),
				codeType: 1,
			},
			{
				name: 'PROMOCODE2',
				start: moment (),
				end: moment ().add (5, 'day'),
				codeType: 2,
			},
			{
				name: 'EXPIRED_CODE1',
				start: moment ().add (-2, 'day'),
				end: moment ().add (-1, 'day'),
				codeType: 1,
			},
			{
				name: 'EXPIRED_CODE2',
				start: moment ().add (-2, 'day'),
				end: moment ().add (-1, 'day'),
				codeType: 2,
			},			
		];

		Promocodes.insertMany (codes, function (err, docs){
			if (err){
				console.log (err);
				return
			}
			newCodes = docs;
			codeNames = [newCodes[0].name, newCodes[1].name];

			done ();
		});
	});

	afterEach (function (done){
		var codenames = [];
		newCodes.map (function (x,i,arr){
			codenames.push (x.name);
		});

		Promocodes.remove ({name: {$in: codenames}}, function (err, docs){
			if (err){
				console.log (err);
				return
			}

			done ();
		})
	})

	it ('should be invalid when codes are expired', function (done){
		codeNames = [newCodes[2].name, newCodes[3].name];
		chai.request (server)
			.get ('/checkin/validate-promotion-code')
			.query ({codes: codeNames})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				res.should.have.status (200);
				res.body.data.should.to.have.lengthOf (0);
				done ();
			});	
	})

	it ('should be invalid when codes do not existed', function (done){
		codeNames = ['NOEXISTCODE1','NOEXISTCODE2'];
		chai.request (server)
			.get ('/checkin/validate-promotion-code')
			.query ({codes: codeNames})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				res.should.have.status (200);
				res.body.data.should.to.have.lengthOf (0);
				done ();
			});
	});

	it ('should return codes when they are valid', function (done){
		chai.request (server)
			.get ('/checkin/validate-promotion-code')
			.query ({codes: codeNames})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				res.should.have.status (200);
				res.body.data.should.to.have.lengthOf (2);
				res.body.data[0].should.have.property ('name');
				res.body.data[0].should.have.property ('codeType');
				res.body.data[0].should.have.property ('conflicted');
				res.body.data[0].should.have.property ('override');
				done ();
			});			
	});

	it ('should return no code conflict when there are not');
	it ('should return code conflicts when there are');
});

describe ('Check in', function (){
	this.timeout (3000);
	var order, customer, newCustomer, newOrder;
	beforeEach (function (done){
		customer = {
			firstname: 'Customer_Firstname',
			middlename: 'Customer_Middlename',
			lastname: 'Customer_Lastname',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: ['0965999999', '0972999999'],
			edu: {},
			email: ['lastmiddlefirst@gmail.com', 'otheremail@gmail.com'], // manuallt required in some cases
			isStudent: false,
			checkinStatus: false,
		};

		order = {
			orderline: [ 
				{ "productName" : "Group Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 15000, promocodes: [{id: '58ff58e6e53ef40f4dd664cd', name: 'YEUGREENSPACE'}] }, 
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

	it ('should create a check-in record and update customer order when no promocode provided', function (done){
		order.promocodes = [];
		chai.request (server)
			.post ('/checkin/customer/' + order.customer._id)
			.send ({data: order})
			.end (function (err, res){
				if (err) {
					console.log (err);
				}

				newOrder = res.body.data;
				res.should.have.status (200); // this indicate updated customer
				res.body.data.should.to.exist;
				res.body.data.customer.should.to.exist;
				res.body.data.staffId.should.to.exist;
				res.body.data.storeId.should.to.exist;
				res.body.data.orderline.should.to.exist;
				res.body.data.orderline.length.should.to.equal (3);
				res.body.data.checkinTime.should.to.exist;
				Customers.findOne ({_id: newCustomer._id}, {checkinStatus: 1, orders: 1}, function (err, data){
					if (err){
						console.log (err);
					}

					data.checkinStatus.should.to.be.true;
					data.orders[data.orders.length-1].toString().should.to.equal (newOrder._id);

				});


				done ();	
			});
	});

	xit ('should be invalid when promotion codes are invalid', function (done){
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

xdescribe ('Update checked-in', function (){
	var newCustomer, editedOrder, newOrder;

	beforeEach (function (done){
		customer = {
			firstname: 'Customer_Firstname',
			middlename: 'Customer_Middlename',
			lastname: 'Customer_Lastname',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: '0999999999',
			edu: {},
			email: 'lastmiddlefirst@gmail.com', // manuallt required in some cases
			isStudent: false,
			checkinStatus: false,
		};

		order = {
			orderline: [ 
				{ "productName" : "Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000, promocodes: [{id: '58ff58e6e53ef40f4dd664cd', name: 'YEUGREENSPACE'}] }, 
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
					console.log (err);
					return
				}

				newCustomer = res.body.data;
				order.customer.firstname = newCustomer.firstname;
				order.customer.lastname = newCustomer.lastname;
				order.customer.email = newCustomer.email;
				order.customer.phone = newCustomer.phone;
				order.customer._id = newCustomer._id;

				chai.request (server)
					.post ('/checkin/customer/' + order.customer._id)
					.send ({data: order})
					.end (function (err, res){
						if (err){
							console.log (err)
							return
						}
						newOrder = res.body.data;
						done ();
					});

			});

	});

	afterEach (function (done){
		Orders.remove ({_id: newOrder._id}, function (err, result){
			if (err) {
				console.log (err)
				return
			}
			else {
				Customers.remove ({firstname: newCustomer.firstname}, function (err, data){
					if (err) {
						console.log (err)
						return
					}

					done ();

				});
			}

		});
	});


	it ('should successfully edit data of a checked-in record', function (done){
		newOrder.orderline = [ 
			{"productName" : "Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000}, 
			{"productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000}, 
			{"productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000}
		];		

		chai.request (server)
			.post ('/checkin/customer/' + newCustomer._id + '/edit/' + newOrder._id)
			.send ({data: newOrder})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				console.log (res.body.data)

				res.should.have.status (200);
				res.body.data.orderline[0].promocodes.should.to.have.lengthOf (0);
				done ();
			});
	});

	it ('should successfully edit part of data of a checked-in record');

});

xdescribe ('Read check-in list', function (){
	var query, orders, customer, newCustomer, newOrder;
	beforeEach (function (done){
		query = {
			storeId: '58eb474538671b4224745192',
		};

		customer = {
			firstname: 'Customer_Firstname',
			middlename: 'Customer_Middlename',
			lastname: 'Customer_Lastname',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: '0999999999',
			edu: {},
			email: 'lastmiddlefirst@gmail.com', // manuallt required in some cases
			isStudent: false,
			checkinStatus: false,
		};

		orders = [
			{
				orderline: [ 
					{ "productName" : "Group Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 15000, promocodes: [{id: '58ff58e6e53ef40f4dd664cd', name: 'YEUGREENSPACE'}] }, 
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 }
				],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",			
			},
			{
				orderline: [ 
					{ "productName" : "Individual Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 15000 }, 
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 10, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }
				],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkinTime: moment ('2017-01-09'),
				status: 2,		
			},			
		];	

		chai.request (server)
			.post ('/customers/create')
			.send ({data: customer})
			.end (function (err, res){
				if (err){
					console.log (err);
					return
				}

				newCustomer = res.body.data;
				orders.map (function (x, i, arr){
					x.customer.firstname = newCustomer.firstname;
					x.customer.lastname = newCustomer.lastname;
					x.customer.email = newCustomer.email;
					x.customer.phone = newCustomer.phone;
					x.customer._id = newCustomer._id;
				});
				
				Orders.insertMany (orders, function (err, ords){
					if (err){
						console.log (err)
						return
					}
					// console.log (ords)
					newOrders = ords;
					done ();
				});

			});

	});

	afterEach (function (done){
		var ordIds = newOrders.map (function (x,i,arr){return x._id});
		Orders.remove ({_id: {$in: ordIds}}, function (err, result){
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


	it ('should return checked-in on today given no date range and status provided', function (done){
		chai.request (server)
			.get ('/checkin')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				var todayStart = moment (moment().format ('YYYY-MM-DD'));
				var todayEnd = moment (moment().format ('YYYY-MM-DD') + ' 23:59:59');
				
				res.should.to.have.status (200);
				res.body.data.should.to.have.lengthOf(1);
				res.body.data.map (function (x, i, arr){
					x.status.should.to.equal (1);
					x.checkinTime.should.to.exist
					moment (x.checkinTime).should.to.be.at.least (todayStart);
					moment (x.checkinTime).should.to.be.at.most (todayEnd);
				});

				done ();
			});
	});

	it ('should return checked-in in a given date range provided', function (done){
		query.start = '2017-01-01';
		query.end = '2017-01-10';

		chai.request (server)
			.get ('/checkin')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				var startDate = moment (query.start);
				var enddDate = moment (query.end + ' 23:59:59');
				res.should.to.have.status (200);
				res.body.data.should.to.have.length.of.at.least(1);
				res.body.data.map (function (x, i, arr){
					x.status.should.to.equal (1);
					x.checkinTime.should.to.exist;
					moment (x.checkinTime).should.to.be.at.least (startDate);
					moment (x.checkinTime).should.to.be.at.most (enddDate);
				});

				done ();
			});		
	});

	it ('should return both checked-in and checked-out customer when required', 	function (done){
		query.start = '2017-01-01';
		query.status = 4;
		chai.request (server)
			.get ('/checkin')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				var startDate = moment (query.start);
				var enddDate = moment (moment().format ('YYYY-MM-DD') + ' 23:59:59');
				res.should.to.have.status (200);
				res.body.data.should.to.have.length.of.at.least(2);
				res.body.data.map (function (x, i, arr){
					x.status.should.to.be.within (1,2);
					x.checkinTime.should.to.exist;
					moment (x.checkinTime).should.to.be.at.least (startDate);
					moment (x.checkinTime).should.to.be.at.most (enddDate);
				});

				done ();
			});	

	});

	it ('should be invalid when required input is not provided /angular/checkin-list');

});


