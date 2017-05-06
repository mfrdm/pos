process.env.NODE_ENV = "development";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var should = chai.should ();

chai.use (chaiHttp);
describe ('Checkout', function (){
	this.timeout(3000);

	xdescribe ('Create invoice', function (){
		var order;
		var newOrder;
		var expectedUsage;
		
		beforeEach (function (done){
			expectedUsage = 0.3;
			order = {
				promocodes:[{
					name: 'YEUGREENSPACE',
				}],
				orderline: [ 
					{ "productName" : "Common", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1, price: 10000 }, 
					{ "productName" : "Coca", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1, price: 10000 } 
				],
				customer:{
					_id: "58ff58e6e53ef40f4dd664cd",
					firstname: 'Hiep',
					lastname: 'Pham',
					phone: '0965284281',
					email: 'hiep@yahoo.com',
				},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkoutTime: moment ().add (expectedUsage, 'hours'), // TESTING	
			};

			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err);
						return
					}
					else{
						newOrder = res.body.data;
					}
					done ()
				});
		});

		afterEach (function (done){
			Orders.remove ({'_id': newOrder._id}, function (err, data){
				if (err){
					console.log (err)
					return
				}

				done ();
			});
		});

		xit ('should read and return invoice successfully', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOrder._id)
				.end (function (err, res){
					if (err){
						// console.log (err)
					}

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.usage.should.to.exist;
					done ();
				});
		});

		xit ('should get promotion code when exist', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOrder._id)
				.end (function (err, res){
					if (err){
						console.log (err)
					}

					res.should.have.status (200);
					res.body.data.promocodes[0].name.should.to.exist;
					done ();
				});		
		});

		xit ('should calculate correct usage time', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOrder._id)
				.end (function (err, res){
					if (err){
						console.log (err)
					}

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.usage.should.to.equal (expectedUsage);
					done ();
				});		
		});

		xit ('should calculate correct total without promotion', function (done){
			order.promocodes = [];
			var expectedTotal = order.orderline[0].price * expectedUsage * order.orderline[0].quantity  + order.orderline[1].price * order.orderline[1].quantity + order.orderline[2].price * order.orderline[2].quantity;
			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err);
						return
					}
					else{
						newOrder = res.body.data;
						chai.request (server)
							.get ('/checkout/invoice/' + newOrder._id)
							.end (function (err, res){
								if (err){
									console.log (err)
								}
								res.should.have.status (200);
								res.body.data.should.to.exist;
								res.body.data.usage.should.to.equal (expectedUsage);
								res.body.data.total.should.to.equal (expectedTotal);

								done ();
							});	
					}
				});				
		});	


		xit ('should calculate correct total with promocode', function (done){
			expectedTotal = 0.5 * (order.orderline[0].price * expectedUsage * order.orderline[0].quantity  + order.orderline[1].price * order.orderline[1].quantity + order.orderline[2].price * order.orderline[2].quantity);
			chai.request (server)
				.get ('/checkout/invoice/' + newOrder._id)
				.end (function (err, res){
					if (err){
						console.log (err)
					}
					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.usage.should.to.equal (expectedUsage);
					res.body.data.total.should.to.equal (expectedTotal);
					done ();
				});			
		});


		xit ('should validate promotion code')
		xit ('should save invoice into db before return data to client')

		xit ('should be invalid when not found required input')

	});

	describe ('Checkout exception', function (){
		var newOrder, newCustomer;

		afterEach (function (done){
			Customers.remove ({_id: newCustomer._id}, function (err, data){
				if (err){
					console.log (err)
					return
				}

				Orders.remove ({'_id': newOrder._id}, function (err, data){
					if (err){
						console.log (err)
						return
					}

					done ();
				});

			})
		});

		it ('should detect user is student when he is')

		it ('should detect user is not student when he is not')

		xit ('should return correct total and usage when a customer is a student. Student get discounts', function (done){
			var customer = {
				firstname: 'XXX',
				email: 'hiep@mail.com',
				password: '123456',
				lastname: 'YYY',
				phone: '099284323121',
				birthday: new Date ('1989-10-01'),
				gender: 1,
				edu: [{
					title: 1,
					start: new Date ('2017-01-01'),
				}]
			};

			chai.request (server)
				.post ('/customers/create')
				.send ({data: customer})
				.end (function (err, res){
					if (err){
						console.log (err)
						return
					}
					res.should.have.status (200)
					newCustomer = res.body.data;

					var expectedUsage = 2;
					var order = {
						promocodes:[{
							name: 'YEUGREENSPACE',
						}],
						orderline: [ 
							{ "productName" : "Group Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 15000 }, 
							{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
							{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 } 
						],
						customer:{
							_id: newCustomer._id,
							firstname: newCustomer.firstname,
							lastname: newCustomer.lastname,
							phone: newCustomer.phone,
							email: newCustomer.email,
						},
						storeId: "58eb474538671b4224745192",
						staffId: "58eb474538671b4224745192",
						checkoutTime: moment ().add (expectedUsage, 'hours'),			
					};

					var expectedTotal = (10000 * order.orderline[0].quantity * expectedUsage + order.orderline[1].price * order.orderline[1].quantity + order.orderline[2].price * order.orderline[2].quantity) / 2;

					chai.request (server)
						.post ('/checkin/customer/' + order.customer._id)
						.send ({data: order})
						.end (function (err, res){
							if (err) {
								console.log (err);
								return
							}
							else{
								res.should.have.status(200)
								newOrder = res.body.data;
								chai.request (server)
									.get ('/checkout/invoice/' + newOrder._id)
									.end (function (err, res){
										if (err){
											console.log (err)
										}

										res.should.have.status (200);
										res.body.data.should.to.exist;
										res.body.data.usage.should.to.equal (expectedUsage);
										res.body.data.total.should.to.equal (expectedTotal);
										done ();
									});	

							}
						});



				})
		})

		it ('should return correct total and usage when a customer uses a combo');

		it ('should return correct total and usage when a customer uses a combo and uses more than expected time')

		xit ('should return correct total and usage when a customer is a student', function (done){
			var expectedUsage = 2;
			var order = {
				promocodes:[{
					name: 'YEUGREENSPACE',
					name: 'SINHVIENGREENSPACE',
				}],
				orderline: [ 
					{ "productName" : "Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 15000 }, 
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 } 
				],
				customer:{
					_id: "58ff58e6e53ef40f4dd664cd",
					firstname: 'Hiep',
					lastname: 'Pham',
					phone: '0965284281',
					email: 'hiep@yahoo.com',
				},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkoutTime: moment ().add (expectedUsage, 'hours'),			
			};

			var expectedTotal = (10000 * order.orderline[0].quantity * expectedUsage + order.orderline[1].price * order.orderline[1].quantity + order.orderline[2].price * order.orderline[2].quantity) / 2;

			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err);
						return
					}
					else{
						newOrder = res.body.data;
						chai.request (server)
							.get ('/checkout/invoice/' + newOrder._id)
							.end (function (err, res){
								if (err){
									// console.log (err)
								}
								res.should.have.status (200);
								res.body.data.should.to.exist;
								res.body.data.usage.should.to.equal (expectedUsage);
								res.body.data.total.should.to.equal (expectedTotal);
								done ();
							});	

					}
				});

		});

		xit ('should return correct total when usage is lower than a threshold', function (done){

			var expectedUsage = 0;
			var order = {
				promocodes:[{
					name: 'YEUGREENSPACE',
				}],
				orderline: [ 
					{ "productName" : "Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 }, 
					{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 } 
				],
				customer:{
					_id: "58ff58e6e53ef40f4dd664cd",
					firstname: 'Hiep',
					lastname: 'Pham',
					phone: '0965284281',
					email: 'hiep@yahoo.com',
				},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkoutTime: moment ().add (expectedUsage, 'hours'),			
			};

			var expectedTotal = (order.orderline[1].price * order.orderline[1].quantity + order.orderline[2].price * order.orderline[2].quantity) / 2;

			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err);
						return
					}
					else{
						newOrder = res.body.data;
						chai.request (server)
							.get ('/checkout/invoice/' + newOrder._id)
							.end (function (err, res){
								if (err){
									// console.log (err)
								}
								res.should.have.status (200);
								res.body.data.should.to.exist;
								res.body.data.usage.should.to.equal (expectedUsage);
								res.body.data.total.should.to.equal (expectedTotal);
								done ();
							});
					}
				});

		})

		// should never happen!!!
		xit ('should return correct total and usage when start time is less than open time', function (done){

		});

		// should never happen!!!
		xit ('should return correct total and usage when end time is less than close time', function (done){

		});	
	})

	xdescribe ('Confirm checkout', function (){
		var order, expectedUsage, newOrder;
		beforeEach (function (done){
			expectedUsage = 0.3;
			order = {
				promocodes:[{
					name: 'YEUGREENSPACE',
				}],
				orderline: [ 
					{ "productName" : "Common", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1, price: 10000 }, 
					{ "productName" : "Coca", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 2, price: 10000 }, 
					{ "productName" : "Poca", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1, price: 10000 } 
				],
				customer:{
					_id: "58ff58e6e53ef40f4dd664cd",
					firstname: 'Hiep',
					lastname: 'Pham',
					phone: '0965284281',
					email: 'hiep@yahoo.com',
				},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkoutTime: moment ().add (expectedUsage, 'hours'),			
			};

			chai.request (server)
				.post ('/checkin/customer/' + order.customer._id)
				.send ({data: order})
				.end (function (err, res){
					if (err) {
						console.log (err);
						return
					}
					else{
						newOrder = res.body.data;
						chai.request (server)
							.get ('/checkout/invoice/' + newOrder._id)
							.end (function (err, res){
								if (err){
									console.log (err)
									return
								}

								newOrder = res.body.data;

								done ();
							});		

					}
				});						
		})

		afterEach (function (done){
			Orders.remove ({'_id': newOrder._id}, function (err, data){
				if (err){
					console.log (err)
					return
				}

				done ();
			});
		})

		it ('should update chekcout data successfully', function (done){
			chai.request (server)
				.post ('/checkout/')
				.send ({data: newOrder})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}
					res.should.have.status (200);
					res.body.data.status.should.to.equal (2);
					res.body.data.usage.should.to.be.ok;
					res.body.data.total.should.to.be.ok;
					done ()
				});
		});

		it ('should compare and realize the submitted data and original data are the same')
		it ('should compare and realize the submitted data and original data are NOT the same')
	});
})

