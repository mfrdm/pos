process.env.NODE_ENV = 'development';
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

xdescribe ('Create an order', function (){
	var order, customer, newOrder, newCustomer;
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
				{_id: '58eb474538671b4224745192', productName: 'Coca', quantity: 1, price: 10000},
				{_id: '58eb474538671b4224745192', productName: 'Poca', quantity: 2, price: 10000},
			],
			customer: {},
			occupancyId: '58eb474538671b4224745192',
			storeId: "58eb474538671b4224745192",
			staffId: "58eb474538671b4224745192",

		};

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus.getPublicFields();
			order.customer = newCustomer;
			done ();	
		});		

	});

	afterEach (function (done){
		Orders.remove ({_id: newOrder._id}, function (err, data){
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

	it ('should create an order successully', function (done){
		chai.request (server)
			.post ('/orders/checkout')
			.send ({data: order})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				var expectedTotal = 30000;
				var expectedSubTotal = [10000, 20000];

				newOrder = res.body.data;
				res.should.have.status (200);
				res.body.data.status.should.to.equal (2);
				res.body.data.occupancyId.should.to.exist;
				res.body.data.total.should.to.equal (expectedTotal);
				res.body.data.orderline.map (function (x, i, arr){
					x.subTotal.should.to.equal (expectedSubTotal[i]);
				});

				done ();
			});
	});
});

describe ('Pay for an order', function (){
	var order, customer, newOrder, newCustomer;
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
				{_id: '58eb474538671b4224745192', productName: 'Coca', quantity: 1, price: 10000},
				{_id: '58eb474538671b4224745192', productName: 'Poca', quantity: 2, price: 10000},
			],
			customer: {},
			storeId: "58eb474538671b4224745192",
			staffId: "58eb474538671b4224745192",
			occupancyId: "58eb474538671b4224745192",

		};

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus.getPublicFields();
			order.customer = newCustomer;
			newOrder = new Orders (order);
			newOrder.getSubTotal ();
			newOrder.getTotal ();

			done();
			
		});		

	});

	afterEach (function (done){
		Orders.remove ({_id: newOrder._id}, function (err, data){
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

	it ('should update order successfully', function (done){
		chai.request (server)
			.post ('/orders/confirm')
			.send ({data: newOrder})
			.end (function (err, res){

				var expectedTotal = 30000;
				var expectedSubTotal = [10000, 20000];

				newOrder = res.body.data;
				res.should.have.status (200);
				res.body.data.status.should.to.equal (1);
				res.body.data.occupancyId.should.to.exist;
				res.body.data.total.should.to.equal (expectedTotal);
				res.body.data.orderline.map (function (x, i, arr){
					x.subTotal.should.to.equal (expectedSubTotal[i]);
				});

				done ();
			});
	})

});

describe ('Read orders', function (){
	var order, customer, newOrder, newCustomer;
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
				{_id: '58eb474538671b4224745192', productName: 'Coca', quantity: 1, price: 10000},
				{_id: '58eb474538671b4224745192', productName: 'Poca', quantity: 2, price: 10000},
			],
			customer: {},
			occupancyId: '58eb474538671b4224745192',
			storeId: "58eb474538671b4224745192",
			staffId: "58eb474538671b4224745192",

		};

		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus.getPublicFields();
			order.customer = newCustomer;
			newOrder = new Orders (order);
			newOrder.getSubTotal ();
			newOrder.getTotal ();

			chai.request (server)
				.post ('/orders/confirm')
				.send ({data: newOrder})
				.end (function (err, res){
					if (err){
						console.log (err)
						return
					}

					done ();
				});
				
		});		

	});

	afterEach (function (done){
		Orders.remove ({_id: newOrder._id}, function (err, data){
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

	it ('should return orders on today if day range is not provided', function (){
		// later
	});

	it ('should return orders within day range provided');
});

describe ('Update an order', function (){

});


