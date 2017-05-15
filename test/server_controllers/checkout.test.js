process.env.NODE_ENV = "development";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var Occupancy = mongoose.model ('occupancy');
var should = chai.should ();

chai.use (chaiHttp);

describe ('Checkout', function (){
	this.timeout(3000);
	xdescribe ('Create invoice', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		
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

			occupancy = {
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
				checkoutTime: moment ().add (0.3, 'hours'),	
			};

			Customers.create (customer, function (err, cus){
				if (err){
					console.log (err)
					return
				}

				newCustomer = cus.getPublicFields();
				occupancy.customer = newCustomer;

				Occupancy.create (occupancy, function (err, occ){
					if (err){
						console.log (err)
						return
					}

					newOcc = occ;
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
					done ();
				});

			});

		});


		it ('should return invoice successfully', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc._id)
				.end (function (err, res){
					if (err){
						console.log (err)
					}

					console.log (res.body.data)

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.usage.should.to.exist;
					res.body.data.checkoutTime.should.to.exist;

					done ();
				});
		});

		it ('should be invalid when not found required input')

	});

	describe ('Confirm checkout', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		
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

			occupancy = {
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
				checkoutTime: moment ().add (1.3, 'hours'),	
			};

			Customers.create (customer, function (err, cus){
				if (err){
					console.log (err)
					return
				}

				newCustomer = cus.getPublicFields();
				occupancy.customer = newCustomer;

				Occupancy.create (occupancy, function (err, occ){
					if (err){
						console.log (err)
						return
					}

					newOcc = occ;
					newOcc.getTotal ();
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
					done ();
				});

			});

		});

		it ('should update chekcout data successfully', function (done){
			chai.request (server)
				.post ('/checkout/')
				.send ({data: newOcc})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.body.data.should.to.exist;
					res.body.data.checkoutTime.should.to.exist;
					res.body.data.checkinTime.should.to.exist;
					res.body.data.usage.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.customer.should.to.exist;
					done ();
				});
		});

		it ('should compare and realize the submitted data and original data are the same')
		it ('should compare and realize the submitted data and original data are NOT the same')
	});
})

