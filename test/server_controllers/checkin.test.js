process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancy = mongoose.model ('occupancy');
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

	xit ('should be invalid when codes are expired', function (done){
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

	xit ('should be invalid when codes do not existed', function (done){
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

	xit ('should return codes when they are valid', function (done){
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

	it ('should add STUDENTPRICE to customers are students and service are group private');
	it ('should remove code STUDENTPRICE if added and the customer is not student and service is not valid service')
	it ('should remove code STUDENTPRICE if added and server is not valid service, even though the customer is a student')
	it ('should return no code conflict when there are not');
	it ('should return code conflicts when there are');
});

xdescribe ('Check in', function (){
	this.timeout (3000);
	var order, customer, newCustomer, newOrder, newOcc, checkinData;
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

		checkinData = {
			occupancy: {
				service: {
					price: 15000,
					name: 'Group Common'
				},
				promocodes: [
					{id: '58ff58e6e53ef40f4dd664cd', name: 'YEUGREENSPACE'}
				],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",		
			},
			order: {
				orderline: [  
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 }
				],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
			}

		}

		chai.request (server)
			.post ('/customers/create')
			.send ({data: customer})
			.end (function (err, res){
				if (err){
					console.log (err)
					return
				}

				newCustomer = res.body.data;
				checkinData.order.customer = newCustomer;
				checkinData.occupancy.customer = newCustomer;
				done ();
			});

	});

	afterEach (function (done){
		if (newOcc){
			Occupancy.remove ({_id: newOcc._id}, function (err, data){
				if (err) {
					// console.log (err)
					return
				}
				Customers.remove ({_id: newCustomer._id}, function (err, data){
					if (err) {
						// console.log (err)
						return
					}				
					if (newOrder && newOrder._id){
						Orders.remove ({_id: newOrder._id}, function (err, data){
							if (err) {
								// console.log (err)
								return
							}
							else {
								done ();
							}
						});
					}
					else {
						done ();
					}
				});

			});			
		}
		else{
			done ();
		}


	});

	it ('should be invalid when a checked-in customer check in again. This could happen when a customers booking more than one time and then check-in')


	// DEPRICATED
	xit ('should create an occupancy and update customer', function (done){
		checkinData.occupancy.promocodes = [];
		chai.request (server)
			.post ('/checkin/customer/' + newCustomer._id)
			.send ({data: checkinData})
			.end (function (err, res){
				if (err) {
					console.log (err);
				}

				newOcc = res.body.data.occupancy;
				newOrder = res.body.data.order;

				res.should.have.status (200); // this indicate updated customer
				res.body.data.occupancy.should.to.exist;
				res.body.data.occupancy.customer.should.to.exist;
				res.body.data.occupancy.staffId.should.to.exist;
				res.body.data.occupancy.storeId.should.to.exist;
				res.body.data.occupancy.service.should.to.exist;
				res.body.data.occupancy.service.name.should.to.exist;
				res.body.data.occupancy.service.price.should.to.exist;
				res.body.data.occupancy.checkinTime.should.to.exist;

				newOcc.orders[0].should.to.equal (newOrder._id);

				Customers.findOne ({_id: newCustomer._id}, {checkinStatus: 1, orders: 1, occupancy: 1}, function (err, data){
					if (err){
						console.log (err);
					}

					data.checkinStatus.should.to.be.true;
					data.occupancy[data.occupancy.length-1].toString().should.to.equal (newOcc._id);
					
					Orders.findOne ({_id: newOrder._id}, function (err, ord){
						if (err){
							console.log (err);
						}

						ord.should.to.exist;
						ord.should.to.have.property ('occupancyId');
					})

					done ();

				});
			});
	});

	it ('should calculate subtotal and total of order and return order when customer who checking in also making an order, and should wait for customer to')

	xit ('should create an occupancy and update customer order when having no order', function (done){
		checkinData.occupancy.promocodes = [];
		checkinData.order = null;
		chai.request (server)
			.post ('/checkin/customer/' + newCustomer._id)
			.send ({data: checkinData})
			.end (function (err, res){
				if (err) {
					console.log (err);
				}

				newOcc = res.body.data.occupancy;

				res.should.have.status (200); // this indicate updated customer
				res.body.data.occupancy.should.to.exist;
				res.body.data.occupancy.customer.should.to.exist;
				res.body.data.occupancy.staffId.should.to.exist;
				res.body.data.occupancy.storeId.should.to.exist;
				res.body.data.occupancy.service.should.to.exist;
				res.body.data.occupancy.service.name.should.to.exist;
				res.body.data.occupancy.service.price.should.to.exist;
				res.body.data.occupancy.checkinTime.should.to.exist;

				Customers.findOne ({_id: newCustomer._id}, {checkinStatus: 1, orders: 1, occupancy: 1}, function (err, data){
					if (err){
						console.log (err);
					}

					data.checkinStatus.should.to.be.true;
					data.occupancy[data.occupancy.length-1].toString().should.to.equal (newOcc._id);

					done ();

				});

			});
	});

	xit ('should be invalid when promotion codes are invalid', function (){
		// have a route to check this. May need to intergrate to avoid security problems.			
	});

	xit ('should be invalid when promotion codes are expired', function (){
		// have a route to check this. May need to intergrate to avoid security problems.
	});

	it ('should be invalid when the same item displays more than one time in orderline')
	
	it ('should be invalid no items in orderline')

	xit ('should be invalid when required input is not provided', function (done){
		chai.request (server)
			.post ('/checkin/customer/' + newCustomer._id)
			.send ({data: {order: {}, occupancy: {}}})
			.end (function (err, res){
				if (err) {
					// console.log (err);
				}	

				res.body.should.have.property('error');
				res.body.error.errors.should.have.property('staffId');
				res.body.error.errors.should.have.property('storeId');
				res.body.error.errors.should.have.property('customer.firstname');
				res.body.error.errors.should.have.property('customer.lastname');
				res.body.error.errors.should.have.property('customer.phone');
				res.body.error.errors.should.have.property('customer._id');
				done ();
			});		
	});
});

xdescribe ('Update checked-in', function (){
	var order, customer, newCustomer, newOrder, newOcc, checkinData, editedOcc;
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

		checkinData = {
			occupancy: {
				service: {
					price: 15000,
					name: 'Group Common'
				},
				promocodes: [
					{id: '58ff58e6e53ef40f4dd664cd', name: 'YEUGREENSPACE'}
				],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",		
			},
			order: {
				orderline: [  
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 }
				],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
			}

		};

		chai.request (server)
			.post ('/customers/create')
			.send ({data: customer})
			.end (function (err, res){
				if (err){
					// console.log (err);
					return
				}

				newCustomer = res.body.data;
				checkinData.order.customer = newCustomer;
				checkinData.occupancy.customer = newCustomer;

				chai.request (server)
					.post ('/checkin/customer/' + newCustomer._id)
					.send ({data: checkinData})
					.end (function (err, res){
						if (err){
							// console.log (err)
							return
						}

						newOcc = res.body.data.occupancy;
						done ();
					});

			});

	});

	afterEach (function (done){
		Occupancy.remove ({_id: newOcc._id}, function (err, data){
			if (err) {
				// console.log (err)
				return
			}
			Customers.remove ({_id: newCustomer._id}, function (err, data){
				if (err) {
					// console.log (err)
					return
				}				
				if (newOrder && newOrder._id){
					Orders.remove ({_id: newOrder._id}, function (err, data){
						if (err) {
							// console.log (err)
							return
						}
						else {
							done ();
						}
					});
				}
				else {
					done ();
				}
			});

		});

	});

	// Depricated. Only allow to update certain fields.
	xit ('should successfully replace old data with new data of a checked-in record', function (done){
		newOcc.service.name = 'Individual Common';		

		chai.request (server)
			.post ('/checkin/customer/' + newCustomer._id + '/edit/' + newOcc._id)
			.send ({data: newOcc})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				res.should.have.status (200);
				res.body.data.service.name.should.to.equal (newOcc.service.name);
				done ();
			});
	});

	it ('should update only allowed fields')

});

describe ('Read check-in list', function (){
	var query, occ, customer, newCustomer, newOcc;
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
			phone: ['0965999999', '0972999999'],
			edu: {},
			email: ['lastmiddlefirst@gmail.com', 'otheremail@gmail.com'], // manuallt required in some cases
			isStudent: false,
			checkinStatus: false,
		};

		occs = [
			{
				service: {
					price: 15000,
					name: 'group common'
				},
				location: {_id: '58eb474538671b4224745192'}
			},
			{
				service: {
					price: 150000,
					name: 'small group private'
				},
				location: {_id: '58eb474538671b4224745192'}
			},
			{
				service: {
					price: 220000,
					name: 'medium group private'
				},
				location: {_id: '58eb474538671b4224745192'}
			},			
			{
				service: {
					price: 15000,
					name: 'group common'
				},
				location: {_id: '58eb474538671b4224745192'},
				checkinTime: moment ('2017-01-09'),
				status: 2,							
			},
		];

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err);
				return
			}

			newCustomer = cus;
			
			Occupancy.insertMany (occs, function (err, data){
				if (err){
					console.log (err)
					return
				}

				newOcc = data;
				done ();
			});

		})

	});

	afterEach (function (done){
		var occIds = newOcc.map (function (x,i,arr){return x._id});
		Occupancy.remove ({_id: {$in: occIds}}, function (err, result){
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


	it ('should fix timezone problem')

	xit ('should return checked-in on today given no date range and status provided', function (done){
		chai.request (server)
			.get ('/checkin')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				var todayStart = moment().hour(0).minute(0);
				var todayEnd = moment().hour(23).minute(59);

				res.should.to.have.status (200);
				res.body.data.should.to.have.lengthOf(3);
				res.body.data.map (function (x, i, arr){
					x.status.should.to.equal (1);
					x.checkinTime.should.to.exist
					moment (x.checkinTime).should.to.be.at.least (todayStart);
					moment (x.checkinTime).should.to.be.at.most (todayEnd);
				});

				done ();
			});
	});

	xit ('should return checked-in in a given date range provided', function (done){
		query.start = '2017-01-01';
		query.end = '2017-01-10';
		query.status = 2;

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
					x.status.should.to.equal (2);
					x.checkinTime.should.to.exist;
					moment (x.checkinTime).should.to.be.at.least (startDate);
					moment (x.checkinTime).should.to.be.at.most (enddDate);
				});

				done ();
			});		
	});

	xit ('should return both checked-in and checked-out customer when required', function (done){
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

	xit ('should return checked-in of specific service when service name is provided', function (done){
		query.service = ['small group private', 'medium group private'];
		chai.request (server)
			.get ('/checkin')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				var expectedServices = ['small group private', 'medium group private'];

				res.should.to.have.status (200);
				res.body.data.should.to.have.length.of.at.least (2);
				res.body.data.map (function (x, i, arr){
					expectedServices.should.to.include (x.service.name.toLowerCase ());
				});

				done ();

			});
	})

	it ('should be invalid when required input is not provided /angular/checkin-list');

});


