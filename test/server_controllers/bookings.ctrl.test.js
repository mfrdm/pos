process.env.NODE_ENV = 'development';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancy = mongoose.model ('occupancy');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var Bookings = mongoose.model ('bookings');
var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

xdescribe ('Create a booking', function (){
	this.timeout (3000);
	var customer, booking, newBooking, newCustomer;
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

		booking = {
			customer:{},
			checkinTime: moment (),
			checkoutTime: moment ().add (3, 'hour'), 
			service: {
				price: 220000,
				name: 'Medium Group Private'
			},			
			storeId: '58eb474538671b4224745192',
			staffId: '58eb474538671b4224745192',
			message: 'Máy chiếu và bảng từ', // other requirements from the customer			
		}

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus.getPublicFields();
			booking.customer = newCustomer;
			done ();

		});		

	});

	afterEach (function (done){
		Bookings.remove ({_id: newBooking._id}, function (err, bk){
			if (err){
				console.log (err);
				return
			}

			Customers.remove ({_id: newCustomer._id}, function (err, cus){
				if (err){
					console.log (err);
					return					
				}

				done ();
			});

			
		})
	});

	it ('should create a booking successfully', function (done){
		chai.request (server)
			.post ('/bookings/' + newCustomer._id)
			.send ({data: booking})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				newBooking = res.body.data;
				res.should.to.have.status (200);
				res.body.data.checkoutTime.should.to.exist;
				res.body.data.checkinTime.should.to.exist;
				res.body.data.customer.should.to.exist;
				res.body.data.staffId.should.to.exist;
				res.body.data.storeId.should.to.exist;
				res.body.data.status.should.to.equal (3);
				done()
			});

	});

});

xdescribe ('Read one booking by Id', function (){
	this.timeout (3000);
	var customer, booking, newBooking, newCustomer;
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

		booking = {
			customer:{},
			checkinTime: moment (),
			checkoutTime: moment ().add (3, 'hour'), 
			service: {
				price: 220000,
				name: 'Medium Group Private'
			},
			storeId: '58eb474538671b4224745192',
			staffId: '58eb474538671b4224745192',
			message: 'Máy chiếu và bảng từ', // other requirements from the customer			
		}

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus.getPublicFields();
			booking.customer = newCustomer;

			Bookings.create (booking, function (err, bk){
				if (err){
					console.log (err);
					return
				}

				newBooking = bk;
				done ();
			});

		});		

	});

	afterEach (function (done){
		Bookings.remove ({_id: newBooking._id}, function (err, bk){
			if (err){
				console.log (err);
				return
			}

			Customers.remove ({_id: newCustomer._id}, function (err, cus){
				if (err){
					console.log (err);
					return					
				}
				
				done ();
			});

			
		})
	});

	it ('should return one booking by its id', function (done){
		chai.request (server)
			.get ('/bookings/booking/' + newBooking._id)
			.query ({})
			.end (function (err, res){
				if (err){
					console.log (err);				
				}

				res.should.to.have.status (200);
				res.body.data.status.should.to.exist;
				res.body.data.customer.should.to.exist;

				done ();
			})
	});

});

describe ('Read bookings', function (){
	this.timeout (3000);
	var customer, booking, newBooking, newCustomer, query;
	beforeEach (function (done){
		query = {storeId: '58eb474538671b4224745192'};

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

		booking = [
			{
				customer:{},
				checkinTime: moment (),
				checkoutTime: moment ().add (3, 'hour'), 
				service: {
					price: 220000,
					name: 'Medium Group Private'
				},
				storeId: '58eb474538671b4224745192',
				staffId: '58eb474538671b4224745192',
				message: 'Máy chiếu và bảng từ', // other requirements from the customer			
			},
			{
				customer:{},
				checkinTime: moment ().add(-3, 'day'),
				checkoutTime: moment ().add (-3, 'day').add(4, 'hour'), 
				service: {
					price: 150000,
					name: 'Small Group Private'
				},
				storeId: '58eb474538671b4224745192',
				staffId: '58eb474538671b4224745192',
				message: 'Máy chiếu và bảng từ', // other requirements from the customer			
			}
		]		

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus.getPublicFields();
			booking.customer = newCustomer;

			Bookings.insertMany (booking, function (err, bk){
				if (err){
					console.log (err);
					return
				}

				newBooking = bk;
				done ();
			});

		});		

	});

	afterEach (function (done){
		bkIds = newBooking.map (function (x, i, arr){ return x._id});
		Bookings.remove ({_id: {$in: bkIds}}, function (err, bk){
			if (err){
				console.log (err);
				return
			}

			Customers.remove ({_id: newCustomer._id}, function (err, cus){
				if (err){
					console.log (err);
					return					
				}
				
				done ();
			});

			
		})
	});

	xit ('should read bookings on today when no date range provided', function (done){
		chai.request (server)
			.get ('/bookings/')
			.query (query)
			.end (function (err, res){
				if (err) console.log (err);
				var todayStart = moment (moment().format ('YYYY-MM-DD'));
				var todayEnd = moment (moment().format ('YYYY-MM-DD') + ' 23:59:59');

				res.should.to.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data.map (function (x, i, arr){
					moment (x.checkinTime).should.to.be.at.least (todayStart);
					moment (x.checkinTime).should.to.be.at.most (todayEnd);
				});
				done ()
			});
	});

	it ('should read bookings on specified date range when provided', function (done){
		query.start = moment().add (-7, 'day').format ('YYYY-MM-DD');
		query.end = moment().add (-3, 'day').format ('YYYY-MM-DD');

		chai.request (server)
			.get ('/bookings')
			.query (query)
			.end (function (err, res){
				if (err) {
					console.log (err)
				}

				var startDate = moment (query.start);
				var enddDate = moment (query.end + ' 23:59:59');

				res.should.to.have.status (200);
				res.body.data.should.to.have.length.of.at.least (1);
				res.body.data.map (function (x, i, arr){
					moment (x.checkinTime).should.to.be.at.least (startDate);
					moment (x.checkinTime).should.to.be.at.most (enddDate);
				});

				done ();

			});			
	});

});

describe ('Read a booking', function (){

});

describe ('Update a booking', function (){

});