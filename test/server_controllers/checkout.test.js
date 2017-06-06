process.env.NODE_ENV = "test";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var Occupancy = mongoose.model ('occupancy');
var Deposite = mongoose.model ('deposit');
var should = chai.should ();

chai.use (chaiHttp);

describe ('Checkout', function (){
	this.timeout(3000);
	xdescribe ('Create invoice', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		var newAcc;
		
		beforeEach (function (done){
			customer = {
				firstname: 'Customer_Firstname',
				middlename: 'Customer_Middlename',
				lastname: 'Customer_Lastname',
				gender: 1,
				birthday: new Date ('1989-09-25'),
				phone: '0965999999',
				edu: {},
				email: 'lastmiddlefirst@gmail.com', // manuallt required in some cases
				isStudent: false,
				checkinStatus: false,
			};

			occupancy = {
				service: {
					price: 15000,
					name: 'Group Common'
				},
				promocodes: [],
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkinTime: moment ().add (-0.3, 'hours'),	
				checkoutTime: moment (),	
			};

			accounts = [
				{
					amount: 10,
					unit: 'hour',
					start: moment (),
					end: moment().add (5, 'day'),
					services: ['group common', 'individual common']
				},
				{
					amount: 100000,
					unit: 'cash',
					start: moment (),
					end: moment().add (5, 'day'),
					services: ['all']
				},
				{
					amount: 20000,
					unit: 'cash',
					start: moment ().add (-5, 'day'),
					end: moment().add (-2, 'day'),
					services: ['all']
				},
				{
					amount: 24,
					unit: 'hour',
					active: false,
					start: moment (),
					end: moment().hour (23).minute (59),
					services: ['group common', 'individual common']
				},												
			]


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

					accounts.map (function (x, i, arr){
						x.customer = newCustomer._id;
					});

					Accounts.insertMany (accounts, function (err, acc){
						if (err){
							console.log (err)
							return
						}

						newAcc = acc;
						var newAccIds = newAcc.map (function (x, i, arr){
							return x._id;
						})

						Customers.update ({_id: newCustomer._id}, {$set: {accounts: newAccIds}}, function (err, cus){
							if (err){
								console.log (err)
								return
							}

							done ();						
						});

					});

					
				});
			});

		});

		afterEach (function (done){
			var accIds = newAcc.map (function (x, i, arr){
				return x._id;
			})
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

					Accounts.remove ({_id: accIds}, function (err, result){
						if (err) {
							// console.log (err)
							return
						}

						done ();					
					});

					
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

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.usage.should.to.exist;
					res.body.data.checkoutTime.should.to.exist;
					res.body.data.usage.should.to.equal (1);
					res.body.data.total.should.to.equal (15000);

					done ();
				});
		});

		xit ('should return non-expired account if existed', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc._id)
				.end (function (err, res){
					if (err){
						console.log (err)
					}

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.usage.should.to.exist;
					res.body.data.checkoutTime.should.to.exist;

					res.body.data.accounts.should.to.have.length.of (accounts.length - 1);
					done ();
				});			
		});

		it ('should be invalid when not found required input')

	});

	describe ('withdraw an account', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		var newAcc;
		
		beforeEach (function (done){
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

			occupancy = {
				service: {
					price: 15000,
					name: 'Group Common'
				},
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkinTime: moment ().add (-3, 'hour'),		
				checkoutTime: moment ()	
			};

			accounts = [
				{
					amount: 10,
					unit: 'hour',
					start: moment (),
					end: moment().add (5, 'day'),
					services: ['group common', 'individual common']
				},
				{
					amount: 2,
					unit: 'hour',
					start: moment (),
					end: moment().add (5, 'day'),
					services: ['group common', 'individual common']
				},				
				{
					amount: 24,
					unit: 'hour',
					start: moment (),
					end: moment().hour(23).minute (59),
					services: ['group common', 'individual common']
				},
				{
					amount: 3,
					unit: 'hour',
					start: moment (),
					end: moment().hour(23).minute (59),
					services: ['group common', 'individual common']
				},
			]


			Customers.create (customer, function (err, cus){
				if (err){
					console.log (err)
					return
				}

				newCustomer = cus.getPublicFields();
				occupancy.customer = newCustomer;

				Occupancy.create (occupancy, function (err, occ){
					if (err){
						// console.log (err)
						return
					}

					newOcc = occ;
					newOcc.getTotal ();

					accounts.map (function (x, i, arr){
						x.customer = newCustomer._id;
					});

					Accounts.insertMany (accounts, function (err, acc){
						if (err){
							// console.log (err)
							return
						}

						newAcc = acc;
						var newAccIds = newAcc.map (function (x, i, arr){
							return x._id;
						})

						Customers.update ({_id: newCustomer._id}, {$set: {accounts: newAccIds}}, function (err, cus){
							if (err){
								// console.log (err)
								return
							}

							done ();						
						});

					});

					
				});
			});

		});

		afterEach (function (done){
			var accIds = newAcc.map (function (x, i, arr){
				return x._id;
			});

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

					Accounts.remove ({_id: accIds}, function (err, result){
						if (err) {
							// console.log (err)
							return
						}

						done ();					
					});

					
				});

			});

		});
		
		it ('should return correct total, withdrawn usage, remain account when withdraw from a hour usage account', function (done){
			chai.request (server)
				.get ('/checkout/account/withdraw')
				.query ({occ: JSON.stringify (newOcc), accId: newAcc[0]._id.toString ()})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.equal (0);
					res.body.data.withdrawnUsage.should.equal (3);
					res.body.data.accAmountRemain.should.equal (7);

					done ();
				});			
		})

		it ('should return correct total, withdrawn usage, remain account when withdraw from a 1 day common combo account', function (done){
			chai.request (server)	
				.get ('/checkout/account/withdraw')
				.query ({occ: JSON.stringify (newOcc), accId: newAcc[2]._id.toString ()})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.equal (0);
					res.body.data.withdrawnUsage.should.equal (3);
					res.body.data.accAmountRemain.should.equal (21);

					done ();
				});			
		})

		it ('should return correct total, withdrawn usage, remain account when withdraw from a 3h-1-month common combo account', function (done){
			chai.request (server)	
				.get ('/checkout/account/withdraw')
				.query ({occ: JSON.stringify (newOcc), accId: newAcc[3]._id.toString ()})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.equal (0);
					res.body.data.withdrawnUsage.should.equal (3);
					res.body.data.accAmountRemain.should.equal (0);
					done ();
				});
		});

	})

	xdescribe ('Confirm checkout', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		
		beforeEach (function (done){
			customer = {
				firstname: 'Customer_Firstname',
				middlename: 'Customer_Middlename',
				lastname: 'Customer_Lastname',
				gender: 1,
				birthday: new Date ('1989-09-25'),
				phone: '0965999999',
				edu: {},
				email: 'lastmiddlefirst@gmail.com', // manuallt required in some cases
				isStudent: true,
				checkinStatus: false,
			};

			occupancy = [
				{
					service: {
						price: 15000,
						name: 'Individual Common'
					},
					promocodes: [],
					customer: {},	
					checkinTime: moment (),
					checkoutTime: moment ().add (2, 'hours'),	
				},			
				{
					service: {
						price: 15000,
						name: 'Group Common'
					},
					promocodes: [
						{name: 'FREE1DAYCOMMON', codeType: 4, priority: 3},
					],
					customer: {},	
					checkinTime: moment (),
					checkoutTime: moment ().add (2, 'hours'),	
				},
				{
					service: {
						price: 150000,
						name: 'Small group private'
					},
					promocodes: [
						{name: 'PRIVATEHALFTOTAL', codeType: 4, priority: 3}
					],
					customer: {},	
					checkinTime: moment (),
					checkoutTime: moment ().add (2, 'hours'),	
				},

			];

			Customers.create (customer, function (err, cus){
				if (err){
					console.log (err)
					return
				}

				newCustomer = cus.getPublicFields();

				occupancy.map (function (x, i, arr){
					x.customer = newCustomer;
				});

				Occupancy.insertMany (occupancy, function (err, occ){
					if (err){
						console.log (err)
						return
					}

					newOcc = occ;
					newOcc.map(function(x, i, arr){
						x.getTotal ();
					});

					done ();
				});
			});

		});

		afterEach (function (done){
			var ids = newOcc.map (function (x, i, arr){return x._id});
			Occupancy.remove ({_id: {$in: ids}}, function (err, data){
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

		it ('should update checkout data successfully', function (done){
			chai.request (server)
				.post ('/checkout/')
				.send ({data: newOcc[0]})
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
					res.body.data.usage.should.to.equal (2);
					res.body.data.total.should.to.equal (10000 * 2);
					done ();
				});
		});

		it ('should checkout success, return correct total and usage, and ignore discount for small group private service when using code PRIVATEHALFTOTAL', function (done){
			chai.request (server)
				.post ('/checkout/')
				.send ({data: newOcc[2]})
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
					res.body.data.usage.should.to.equal (2);
					res.body.data.total.should.to.equal (150000);
					done ();
				});			
		});

		it ('should checkout success, return correct total and usage, and ignore discount for medium group private service when using code PRIVATEHALFTOTAL')
		it ('should checkout success, return correct total and usage, and ignore discount for large group private service when using code PRIVATEHALFTOTAL')
		it ('should checkout success, return 0 total and usage for group common service when using code FREE1DAYCOMMON', function (done){
			chai.request (server)
				.post ('/checkout/')
				.send ({data: newOcc[1]})
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
					res.body.data.usage.should.to.equal (2);
					res.body.data.total.should.to.equal (0);
					done ();
				});					
		});

		it ('should checkout success, return 0 total and usage for individual common service when using code FREE1DAYCOMMON')

		it ('should add note successfully')

	});

	xdescribe ('Confirm checkout using pre paid account', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		var newAcc;
		
		beforeEach (function (done){
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

			occupancy = {
				service: {
					price: 15000,
					name: 'Group Common'
				},
				customer: {},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",
				checkinTime: moment ().add (-3, 'hour'),		
				checkoutTime: moment (),
			};

			accounts = [
				{
					amount: 2,
					unit: 'hour',
					start: moment (),
					end: moment().add (5, 'day'),
					services: ['group common', 'individual common']
				}
			]


			Customers.create (customer, function (err, cus){
				if (err){
					console.log (err)
					return
				}

				newCustomer = cus.getPublicFields();
				occupancy.customer = newCustomer;

				Occupancy.create (occupancy, function (err, occ){
					if (err){
						// console.log (err)
						return
					}

					newOcc = occ;
					newOcc.getTotal ();

					accounts.map (function (x, i, arr){
						x.customer = newCustomer._id;
					});

					Accounts.insertMany (accounts, function (err, acc){
						if (err){
							// console.log (err)
							return
						}

						newAcc = acc;	

						// indicate the service is pay part by account
						newOcc.paymentMethod = [
							{methodId: newAcc[0]._id, name: 'account', amount: 2, paid: 30000}
						];

						var newAccIds = newAcc.map (function (x, i, arr){
							return x._id;
						})

						Customers.update ({_id: newCustomer._id}, {$set: {accounts: newAccIds}}, function (err, cus){
							if (err){
								// console.log (err)
								return
							}

							done ();						
						});

					});

					
				});
			});
		});

		afterEach (function (done){
			var accIds = newAcc.map (function (x, i, arr){
				return x._id;
			});

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

					Accounts.remove ({_id: accIds}, function (err, result){
						if (err) {
							// console.log (err)
							return
						}

						done ();					
					});

					
				});

			});
		});

		it ('should update account when it is used', function (done){
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
					res.body.data.total.should.to.equal (15000);
					res.body.data.paymentMethod[0].paid.should.to.equal (30000);
					res.body.data.paymentMethod[0].amount.should.to.equal (2);

					Accounts.findOne ({_id: newAcc[0]._id}, function (err, acc){
						if (err){
							console.log (err)
						}

						acc.should.to.exist;
						acc.amount.should.to.equal (0);
						

						done ();
					});

					
				});					
		});


	});
})

