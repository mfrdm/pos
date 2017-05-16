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

describe ('Create a booking', function (){
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
		Bookings.remove ({_id: newBooking._id}, function (err, result){
			if (err){
				console.log (err);
				return
			}

			done ();
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
			})

	});

});

describe ('Read one booking by Id', function (){

});

describe ('Read bookings', function (){

});

describe ('Read a booking', function (){

});

describe ('Update a booking', function (){

});