process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancies = mongoose.model ('Occupancies');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Accounts = mongoose.model ('Accounts');
var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

xdescribe ('Search checking-in customers', function (){
	this.timeout (3000);
	var newCustomer, customer;

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

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus;

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

	xit ('should successfully return non-checked-in customers given customer fullname', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: 'C B A'})
			.end (function (err, res){
				if (err) console.log (err);

				res.body.data.should.to.have.lengthOf (1);
				res.body.data[0].fullname.should.to.equal (customer.fullname);
				res.body.data[0].phone[0].should.to.equal (customer.phone);
				res.body.data[0].email[0].should.to.equal (customer.email);
				res.body.data[0].checkinStatus.should.to.be.false;
				res.body.data[0].isStudent.should.to.be.false;
				done ();
			});
	});

	xit ('should successfully return non-checked-in customers given customer email', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: customer.email})
			.end (function (err, res){
				if (err) console.log (err);

				res.should.have.status (200);
				res.body.data.should.to.have.lengthOf (1);
				res.body.data[0].fullname.should.to.equal (customer.fullname);
				res.body.data[0].phone[0].should.to.equal (customer.phone);
				res.body.data[0].email[0].should.to.equal (customer.email);
				res.body.data[0].checkinStatus.should.to.be.false;
				res.body.data[0].isStudent.should.to.be.false;
				done ();
			});
	});


	xit ('should successfully return non-checked-in customers given customer phone', function (done){
		chai.request (server)
			.get ('/checkin/search-customers')
			.query ({input: customer.phone})
			.end (function (err, res){
				if (err) console.log (err);

				res.should.have.status (200);
				res.body.data.should.to.have.lengthOf (1);
				res.body.data[0].fullname.should.to.equal (customer.fullname);
				res.body.data[0].phone[0].should.to.equal (customer.phone);
				res.body.data[0].email[0].should.to.equal (customer.email);
				res.body.data[0].checkinStatus.should.to.be.false;
				res.body.data[0].isStudent.should.to.be.false;
				done ();
			});
	});	

	xit ('should return active customers')
	xit ('should be invalid when required input not found')
});

xdescribe ('Filter checked-in customers', function (){
	// not built yet. Client pull all data at first
});

// NEED TO ENHANCE
xdescribe ('Validate promotion code', function (){
	var newCodes, codes;
	beforeEach (function (done){
		codes = [
			{
				name: 'PROMOCODE1',
				start: moment (),
				end: moment ().add (5, 'day'),
				codeType: 1,
				service: ['group common', 'individual common'],
				redeemData: {},
				excluded: false,
			},
			{
				name: 'PROMOCODE2',
				start: moment (),
				end: moment ().add (5, 'day'),
				codeType: 2,
				service: ['group common', 'individual common'],
				redeemData: {},
				excluded: false,
			},
			{
				name: 'EXPIRED_CODE1',
				start: moment ().add (-2, 'day'),
				end: moment ().add (-1, 'day'),
				codeType: 1,
				service: ['group common', 'individual common'],
				redeemData: {},
				excluded: false,
			},
			{
				name: 'EXPIRED_CODE2',
				start: moment ().add (-2, 'day'),
				end: moment ().add (-1, 'day'),
				codeType: 2,
				service: ['group common', 'individual common'],
				redeemData: {},
				excluded: false,
			},			
		];

		Promocodes.insertMany (codes, function (err, docs){
			if (err){
				console.log (err);
				return
			}
			newCodes = docs;

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
		var codeNames = [codes[2].name, codes[3].name];
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
		var codeNames = ['NOEXISTCODE1','NOEXISTCODE2'];
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
		var codeNames = [codes[0].name, codes[1].name];
		chai.request (server)
			.get ('/checkin/validate-promotion-code')
			.query ({codes: codeNames})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				res.should.have.status (200);
				res.body.data.should.to.have.lengthOf (2);
				res.body.data.map (function (x, i, arr){
					codeNames.should.to.include (x.name);

				});

				done ();
			});			
	});

	it ('should be invalid when provide no codes', function (done){
		var codeNames = [];
		chai.request (server)
			.get ('/checkin/validate-promotion-code')
			.query ({codes: codeNames})
			.end (function (err, res){
				if (err){
					// console.log (err);
				}

				res.should.have.status (404);
				done ();
			});

	})
});

xdescribe ('Check in', function (){
	this.timeout (3000);
	var order, customer, newCustomer, newOrder, newOcc, checkinData, storeId;

	beforeEach (function (done){
		storeId = '58eb474538671b4224745192';
		staffId = '58eb474538671b4224745192';
		customer = {
			firstname: 'Customer_Firstname',
			middlename: 'Customer_Middlename',
			lastname: 'Customer_Lastname',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: '0965999999',
			edu: {},
			email: 'lastmiddlefirst@gmail.com',
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
					{
						name: 'code 2',
						codeType: 3,
						services: ['group Common'],
						priority: 2,
						redeemData: {
							total: {
								value: 0.5,
								formula: 2
							}
						}				
					}
				],
				customer: {},
				location: {_id: storeId},
				staffId: staffId,		
			},
			order: {
				orderline: [  
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 }
				],
				customer: {},
				location: {_id: storeId},
				staffId: staffId,
			}

		}

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err);
				return;
			}

			newCustomer = cus;
			checkinData.order.customer = newCustomer;
			checkinData.occupancy.customer = newCustomer;
			done ();			
		});
	});

	afterEach (function (done){
		if (newOcc){
			Occupancies.remove ({_id: newOcc._id}, function (err, data){
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

	it ('should create an occupancy and update customer', function (done){
		checkinData.occupancy.promocodes = [];
		chai.request (server)
			.post ('/checkin/customer/' + newCustomer._id)
			.send ({data: checkinData})
			.end (function (err, res){
				if (err) {
					// console.log (err);
				}

				res.should.have.status (200); // this indicate updated customer

				newOcc = res.body.data.occupancy;
				newOrder = res.body.data.order;

				newOcc.should.to.exist;
				newOcc.customer.should.to.exist;
				newOcc.staffId.should.to.exist;
				newOcc.location._id.should.to.exist;
				newOcc.service.should.to.exist;
				newOcc.service.name.should.to.exist;
				newOcc.service.price.should.to.exist;
				newOcc.checkinTime.should.to.exist;

				newOrder.should.to.exist;
				newOrder.total.should.to.equal (30000);

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

	it ('should create a occupancy, update customer, and update booking when checkin from a booking');

	it ('should calculate subtotal and total of order and return order when customer who checking in also making an order, and should wait for customer to')


	xit ('should be invalid when promotion codes are invalid');

	xit ('should be invalid when promotion codes are expired');

	xit ('should be invalid when the same item displays more than one time in orderline')
	
	xit ('should be invalid no items in orderline')

	it ('should be invalid when required input is not provided', function (done){
		chai.request (server)
			.post ('/checkin/customer/' + newCustomer._id)
			.send ({data: {order: {}, occupancy: {}}})
			.end (function (err, res){
				if (err) {
					// console.log (err);
				}	
				res.body.should.have.property('error');
				done ();
			});		
	});
});

describe ('Update checked-in', function (){
	var newCustomer, newOcc;
	beforeEach (function (done){
		var mockcustomer = [
			{
				fullname: 'ABC',
				gender: 1,
				birthday: new Date ('1989-09-25'),
				phone: '0965999999',
				edu: {},
				email: 'abc@gmail.com',
				isStudent: false,
				checkinStatus: false,
			},
			{
				fullname: 'XYZ',
				gender: 2,
				birthday: new Date ('1988-09-25'),
				phone: '0965999998',
				edu: {},
				email: 'xyz@gmail.com',
				isStudent: false,
				checkinStatus: false,
			},			
		];

		var mockocc = {
			service: {
				price: 15000,
				name: 'Group Common'
			},
			checkinTime: moment (),
			promocodes: [{name: 'ACODE', codeType: 2, priority: 2, redeemData: {price: {value: 8000}}}],
			customer: {}		
		}

		Customers.insertMany (mockcustomer, function (err, newCus){
			if (err){
				console.log (err);
				return
			}

			newCustomer = newCus;
			mockocc.customer = newCus[0];

			Occupancies.create (mockocc, function (err, occ){
				if (err){
					console.log (err);
					return
				}

				newOcc = occ;
				done ();				
			});
		});

	});

	afterEach (function (done){
		var cusIds = newCustomer.map (function (x, i, arr){
			return x._id;
		});

		Occupancies.remove ({_id: newOcc._id}, function (err, data){
			if (err) {
				// console.log (err)
				return
			}

			Customers.remove ({_id: {$in: cusIds}}, function (err, data){
				if (err) {
					// console.log (err)
					return
				}

				done ();
			});

		});

	});

	it ('should update 1 occupancy and 2 customers when update who has been checked-in', function  (done){
		var updatedOcc = {
			_id: newOcc._id,
			customer: newCustomer[1]
		};

		chai.request (server)
			.post ('/checkin/edit/' + newOcc._id.toString ())
			.send ({data: updatedOcc})
			.end (function (err, res){
				if (err) {
					console.log (err);
				}

				res.should.to.have.status (200);
				res.body.data.should.to.exist;
				res.body.data.customer.should.to.exist;
				res.body.data.customer.fullname.should.to.equal (newCustomer[1].fullname);

				Customers.find ({_id: {$in: [newCustomer[1], newCustomer[0]]}}, function (err, foundCus){
					if (err) {
						console.log (err);
					}

					foundCus.should.to.exist;
					foundCus.length.should.to.equal (2);
					foundCus.map (function (x, i, arr){
						if (x._id == res.body.data.customer._id){
							x.occupancy[x.occupancy.length - 1].toString ().should.to.equal (newOcc._id.toString ());
						}
						else{
							x.occupancy.length.should.to.equal (0);
						}
					});

					done ();
				})
			});
	});

	it ('should update parent of all member occupancies when update who is the leader', function (done){
		done ();
	});

	it ('should update occupancy when update service')
	it ('should update member occupancies when update service of leader')
	it ('should remove parent when update service of a group member as common service')
	it ('should update checked in time')
	it ('should update promocode')

});

xdescribe ('Read check-in list', function (){
	var query, occ, customer, newCustomer, newOcc;
	beforeEach (function (done){
		var storeId = '58eb474538671b4224745192';
		var staffId = '58eb474538671b4224745192';

		query = {
			storeId: storeId,
		};

		customer = {
			firstname: 'x',
			middlename: 'y',
			lastname: 'z',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: '0965999999',
			edu: {},
			email: 'lastmiddlefirst@gmail.com',
			isStudent: false,
			checkinStatus: false,
		};

		occs = [
			{
				service: {
					price: 15000,
					name: 'group common'
				},
				location: {_id: storeId}
			},
			{
				service: {
					price: 150000,
					name: 'small group private'
				},
				location: {_id: storeId}
			},
			{
				service: {
					price: 220000,
					name: 'medium group private'
				},
				location: {_id: storeId}
			},			
			{
				service: {
					price: 15000,
					name: 'group common'
				},
				location: {_id: storeId},
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
			
			Occupancies.insertMany (occs, function (err, data){
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
		Occupancies.remove ({_id: {$in: occIds}}, function (err, result){
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

	xit ('should be invalid when required input is not provided /angular/checkin-list');
});


