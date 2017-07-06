process.env.NODE_ENV = "test";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Occupancy = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');
var should = chai.should ();
console.log(process.cwd())
chai.use (chaiHttp);

xdescribe ('Checkout', function (){
	this.timeout(3000);
	describe ('Create invoice', function (){
		var occupancies, customers;
		var newOcc, newCustomer;
		var newAcc;

		beforeEach (function (done){
			customers = [
				{
					firstname: 'a',
					middlename: 'b',
					lastname: 'c',
					birthday: '1989-09-25',
					phone: '0965999999',
					edu: {},
					email: 'abc@gmail.com',
					isStudent: false,
					checkinStatus: false,
				},
				{
					firstname: 'x',
					middlename: 'y',
					lastname: 'z',
					birthday: '1988-09-25',
					phone: '0965999998',
					edu: {},
					email: 'xyz@gmail.com',
					isStudent: true,
					checkinStatus: false,
				},				

			];

			occupancies = [
				{
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
				},				
				{
					service: {
						price: 150000,
						name: 'Small group private'
					},
					promocodes: [],
					customer: {},
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",
					checkinTime: moment ().add (-2.3, 'hours'),	
					checkoutTime: moment (),	
				},
				{
					service: {
						price: 15000,
						name: 'Individual common'
					},
					promocodes: [],
					customer: {},
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",
					checkinTime: moment ().add (-0.5, 'hours'),	
					checkoutTime: moment (),	
				},
				{
					service: {
						price: 150000,
						name: 'Small group private'
					},
					promocodes: [],
					parent: "58eb474538671b4224745192",
					customer: {},
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",
					checkinTime: moment ().add (-2.3, 'hours'),	
					checkoutTime: moment (),	
				},
				{
					service: {
						price: 150000,
						name: 'Small group private'
					},
					promocodes: [
						{
							name: 'code 4',
							codeType: 3,
							services: ['small group private'],
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
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",
					checkinTime: moment ().add (-2.3, 'hours'),	
					checkoutTime: moment (),	
				},
				{
					service: {
						price: 150000,
						name: 'Small group private'
					},
					promocodes: [
						{
							name: 'code 4',
							codeType: 3,
							services: ['small group private'],
							priority: 2,
							redeemData: {
								total: {
									value: 0.5,
									formula: 2
								}
							}					
						},
						{
							name: 'code 5',
							codeType: 3,
							services: ['small group private'],
							priority: 2,
							redeemData: {
								total: {
									value: 0.1,
									formula: 2
								}
							}					
						},											
					],
					customer: {},
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",
					checkinTime: moment ().add (-2.3, 'hours'),	
					checkoutTime: moment (),	
				},
			]

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
					start: moment (),
					end: moment().hour (23).minute (59),
					services: ['group common', 'individual common']
				},												
			];

			Customers.insertMany (customers, function (err, cus){
				if (err){
					console.log (err)
					return
				}

				newCustomer = cus;
				occupancies[0].customer = cus[0];
				occupancies[1].customer = cus[1];
				occupancies[2].customer = cus[1];
				occupancies[3].customer = cus[1];
				occupancies[4].customer = cus[1];
				occupancies[5].customer = cus[1];

				Occupancy.insertMany (occupancies, function (err, occ){
					if (err){
						console.log (err)
						return
					}

					newOcc = occ;

					accounts.map (function (x, i, arr){
						x.customer = newCustomer[0]._id;
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

						Customers.update ({_id: newCustomer[0]._id}, {$set: {accounts: newAccIds}}, function (err, cus){
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
			});

			var cusIds = newCustomer.map (function (x, i, arr){
				return x._id;
			});

			var occIds = newOcc.map (function (x, i, arr){
				return x._id;
			});

			Occupancy.remove ({_id: {$in: occIds}}, function (err, data){
				if (err) {
					// console.log (err)
					return
				}
				Customers.remove ({_id: {$in: cusIds}}, function (err, data){
					if (err) {
						// console.log (err)
						return
					}

					Accounts.remove ({_id: {$in: accIds}}, function (err, result){
						if (err) {
							// console.log (err)
							return
						}

						done ();					
					});

					
				});

			});

		});

		it ('should return invoice successfully with correct total when no code applied', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc[0]._id)
				.end (function (err, res){
					if (err){
						console.log (err)
					}

					var foundOcc = res.body.data;
					res.should.have.status (200);
					foundOcc.should.to.exist;

					foundOcc.total.should.to.exist;
					foundOcc.usage.should.to.exist;
					foundOcc.checkoutTime.should.to.exist;
					foundOcc.usage.should.to.equal (1);
					foundOcc.price.should.to.equal (15000);
					foundOcc.total.should.to.equal (15000);
					foundOcc.promocodes.should.to.exist;
					foundOcc.promocodes.length.should.to.equal (0);

					done ();
				});
		});

		it ('should return invoice with correct total and usage when customer is a student', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc[2]._id)
				.end (function (err, res){
					if (err){
						// console.log (err)
					}

					res.should.have.status (200);
					var foundOcc = res.body.data;

					foundOcc.should.to.exist;
					foundOcc.total.should.to.exist;
					foundOcc.usage.should.to.exist;
					foundOcc.checkoutTime.should.to.exist;
					foundOcc.usage.should.to.equal (1);
					foundOcc.price.should.to.equal (10000);
					foundOcc.total.should.to.equal (10000);

					foundOcc.promocodes.length.should.to.be.at.least (1);

					done ();
				});			
		})

		it ('should return invoice with correct total and usage when customer used private service, customer is a leader, and usage is greater than 1 hour', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc[1]._id)
				.end (function (err, res){
					if (err){
						// console.log (err)
					}

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.usage.should.to.exist;
					res.body.data.checkoutTime.should.to.exist;
					res.body.data.should.to.not.have.property ('parent');
					res.body.data.usage.should.to.equal (2.3);
					res.body.data.price.should.to.equal (150000);
					res.body.data.total.should.to.equal (306000);

					res.body.data.promocodes.length.should.to.be.at.least (1);

					done ();
				});				
		})	

		it ('should return invoice with correct total and usage when customer used private service, customer is a member, and usage is greater than 1 hour', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc[3]._id)
				.end (function (err, res){
					if (err){
						// console.log (err)
					}

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.usage.should.to.exist;
					res.body.data.checkoutTime.should.to.exist;
					res.body.data.parent.should.to.exist;
					res.body.data.usage.should.to.equal (2.3);
					res.body.data.price.should.to.equal (150000);
					res.body.data.total.should.to.equal (0);

					done ();
				});				
		})

		it ('should return invoice with correct total and usage when customer used private service, customer is a leader, usage is greater than 1 hour, and a total code is applied', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc[4]._id)
				.end (function (err, res){
					if (err){
						console.log (err);
					}

					res.should.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.total.should.to.exist;
					res.body.data.usage.should.to.exist;
					res.body.data.checkoutTime.should.to.exist;
					res.body.data.should.to.not.have.property ('parent');
					res.body.data.usage.should.to.equal (2.3);
					res.body.data.price.should.to.equal (150000);
					res.body.data.total.should.to.equal (173000);

					done ();
				});	
		});	

		it ('should return non-expired account if existed', function (done){

			chai.request (server)
				.get ('/checkout/invoice/' + newOcc[0]._id)
				.end (function (err, res){
					if (err){
						console.log (err);
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

		it ('should not return expired accounts')

		it ('should not non-expired accounts, but amount is 0')
		it ('should not non-expired accounts, but amount is 0')

		it ('should renew and renewable account and reuturn it')

		it ('should be invalid when two codes of the same priority is provided', function (done){
			chai.request (server)
				.get ('/checkout/invoice/' + newOcc[5]._id)
				.end (function (err, res){
					if (err){
						// console.log (err);
					}

					res.should.have.status (500);

					done ();
				});	
		});
	});

	xdescribe ('withdraw an account', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		var newAcc;
		
		beforeEach (function (done){
			customer = {
				firstname: 'a',
				middlename: 'b',
				lastname: 'c',
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
				{
					amount: 30000,
					unit: 'vnd',
					start: moment (),
					end: moment().add (30, 'day'),
					services: ['group common', 'individual common']
				},
				{
					amount: 100000,
					unit: 'vnd',
					start: moment (),
					end: moment().add (30, 'day'),
					services: ['group common', 'individual common']
				},	
				{
					price: 350000,
					amount: 0,
					unit: 'hour',
					start: moment (),
					end: moment().add (30, 'day'),					
					services: ['group common', 'individual common'],
					recursive: {
						isRecursive: true,
						lastRenewDate: moment ().add (-1, 'day'),
						recursiveType: 1,
						renewNum: 0,
						maxRenewNum: 3,
						baseAmount: 3				
					}
				},
				{
					price: 60000,
					amount: 1,
					unit: 'hour',
					start: moment (),
					end: moment().hour(23).minute (59),					
					services: ['group common', 'individual common'],
					recursive: {
						isRecursive: false				
					}
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
		
		xit ('should return correct total, remain, and paid when withdraw from an HOUR account when the amount in account is less than or equal being-paid amount', function (done){
			chai.request (server)
				.get ('/checkout/account/withdraw/' + newAcc[1]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (15000);
					res.body.data.acc.remain.should.equal (0);
					res.body.data.acc.paidAmount.should.equal (2);
					res.body.data.acc.paidTotal.should.equal (30000);

					done ();
				});				
		});

		xit ('should return correct total, remain, and paid when withdraw from an HOUR account when the amount in account is greater than being-paid amount', function (done){
			chai.request (server)
				.get ('/checkout/account/withdraw/' + newAcc[0]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (0);
					res.body.data.acc.remain.should.equal (7);
					res.body.data.acc.paidAmount.should.equal (3);
					res.body.data.acc.paidTotal.should.equal (45000);
					done ();
				});				
		})	

		it ('should return correct total, remain, and paid when withdraw from an CASH account when the amount in account is less than or equal being-paid amount', function (done){
			chai.request (server)
				.get ('/checkout/account/withdraw/' + newAcc[4]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (15000);
					res.body.data.acc.remain.should.equal (0);
					res.body.data.acc.paidAmount.should.equal (30000);
					res.body.data.acc.paidTotal.should.equal (30000);
					done ();
				});				
		})

		it ('should return correct total, remain, and paid when withdraw from an CASH account when the amount in account is greater than being-paid amount', function (done){
			chai.request (server)
				.get ('/checkout/account/withdraw/' + newAcc[5]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (0);
					res.body.data.acc.remain.should.equal (55000);
					res.body.data.acc.paidAmount.should.equal (45000);
					res.body.data.acc.paidTotal.should.equal (45000);
					done ();
				});				
		})

		xit ('should return correct total when withdraw from a 1 day common combo account', function (done){
			chai.request (server)	
				.get ('/checkout/account/withdraw/' + newAcc[2]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (0);
					res.body.data.acc.remain.should.equal (21);
					res.body.data.acc.paidAmount.should.equal (3);
					res.body.data.acc.paidTotal.should.equal (45000);
					done ();
				});			
		})

		xit ('should return correct total when withdraw from a 3h-1-month common combo account', function (done){
			chai.request (server)	
				.get ('/checkout/account/withdraw/' + newAcc[3]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (0);
					res.body.data.acc.remain.should.equal (0);
					res.body.data.acc.paidAmount.should.equal (3);
					res.body.data.acc.paidTotal.should.equal (45000);
					done ();
				});
		});

		it ('should update an an account when the account is renewed', function (done){
			var now = moment ();
			chai.request (server)	
				.get ('/checkout/account/withdraw/' + newAcc[6]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						// console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (0);
					res.body.data.acc.remain.should.equal (0);
					res.body.data.acc.paidAmount.should.equal (3);
					res.body.data.acc.paidTotal.should.equal (45000);					

					Accounts.findOne ({_id: res.body.data.acc._id}, {amount: 1, 'recursive.lastRenewDate': 1, 'recursive.renewNum': 1}, function (err, foundAcc){

						if (err){
							console.log (err);
						}

						foundAcc.amount.should.to.equal (3);
						moment(foundAcc.recursive.lastRenewDate).isSameOrAfter (now).should.to.equal (true);
						foundAcc.recursive.renewNum.should.to.equal (1);
						done ();
					})

					
				});
		})

		it ('should not update an account when it is not renewable', function (done){
			chai.request (server)	
				.get ('/checkout/account/withdraw/' + newAcc[7]._id.toString ())
				.query ({occ: JSON.stringify (newOcc)})
				.end (function (err, res){
					if (err) {
						// console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;
					res.body.data.occ.total.should.equal (30000);
					res.body.data.acc.remain.should.equal (0);
					res.body.data.acc.paidAmount.should.equal (1);
					res.body.data.acc.paidTotal.should.equal (15000);

					Accounts.findOne ({_id: res.body.data.acc._id}, {amount: 1, 'recursive.isRecursive': 1}, function (err, foundAcc){

						if (err){
							console.log (err);
						}

						foundAcc.amount.should.to.equal (1);
						foundAcc.recursive.isRecursive.should.to.equal (false);
						done ();
					})

					
				});			
		})
	})

	xdescribe ('Confirm checkout', function (){
		var occupancy, customer;
		var newOcc, newCustomer;
		var accounts, newAcc;
		
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
						{
							name: 'Free 1 day common',
							codeType: 3,
							services: ['small group private'],
							priority: 2,
							redeemData: {
								total: {
									value: 0
								}
							}					
						}						
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
						{
							name: 'Private half total',
							codeType: 3,
							services: ['small group private'],
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
					checkinTime: moment (),
					checkoutTime: moment ().add (2, 'hours'),	
				},

			];

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
					start: moment ().add (-2, 'day'),
					end: moment().add (-1, 'day'),
					services: ['group common', 'individual common']
				},
				{
					amount: 3,
					unit: 'hour',
					start: moment (),
					end: moment().hour(23).minute (59),
					services: ['small group private']
				},


			]

			Customers.create (customer, function (err, cus){
				if (err){
					console.log (err)
					return
				}

				newCustomer = cus;

				accounts.map (function (x, i, arr){
					x.customer = newCustomer;
				});

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

					Accounts.insertMany (accounts, function (err, acc){
						if (err){
							console.log (err);
							return
						}

						newAcc = acc;

						done ();
					})

					
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

		it ('should checkout successfully when no account is used', function (done){
		
			chai.request (server)
				.post ('/checkout/')
				.send ({data: newOcc[0]})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;

					Occupancy.findOne ({_id: newOcc[0]._id}, {usage: 1, total: 1, promocodes: 1, price: 1}, function (err, foundOcc){
						if (err){
							console.log (err);
						}

						foundOcc.should.to.exist;
						foundOcc.total.should.to.equal (20000);
						foundOcc.usage.should.to.equal (2);
						foundOcc.price.should.to.equal (10000)
						foundOcc.promocodes.should.to.have.length.of.at.least (1);	

						done ();
					})

					
				});
		});

		it ('should checkout successfully when an account is used', function (done){
			var selectedOcc = newOcc[2];
			var selectedAcc = newAcc[2];

			selectedOcc.paymentMethod = [
				{
					name: 'account',
					_id: selectedAcc._id,
					paid: 2,
					unit: selectedAcc.unit,
					paidTotal: 150000,
					paidAmount: 2,
					remain: 1,					
				}
			];

			chai.request (server)
				.post ('/checkout/')
				.send ({data: selectedOcc})
				.end (function (err, res){
					if (err) {
						console.log (err)
					}

					res.should.to.have.status (200);
					res.body.data.should.to.exist;

					Occupancy.findOne ({_id: selectedOcc._id}, {usage: 1, total: 1, price: 1,promocodes: 1, paymentMethod: 1, oriUsage: 1}, function (err, foundOcc){
						if (err){
							console.log (err);
						}

						foundOcc.should.to.exist;
						foundOcc.total.should.to.equal (150000);
						foundOcc.usage.should.to.equal (2);
						foundOcc.oriUsage.should.to.equal (2);
						foundOcc.price.should.to.equal (150000);
						foundOcc.promocodes.should.to.have.length.of.at.least (1);	

						foundOcc.paymentMethod.length.should.to.equal (1);
						foundOcc.paymentMethod[0].paidAmount.should.to.equal (2);
						foundOcc.paymentMethod[0].paidTotal.should.to.equal (150000);
						foundOcc.paymentMethod[0].name.should.to.equal ('account');

						Accounts.findOne ({_id: selectedAcc._id}, function (err, foundAcc){
							if (err){
								console.log (err);
							}

							foundAcc.amount.should.to.equal (1);
							done ();
						})

						
					})

					
				});
		});
	});

})

xdescribe('Checkout members with leader', function() {
    this.timeout(3000);
    describe('Leader without members', function() {
        var mockOccs, mockCustomers, newOcc, newCustomer, group, selectedAcc;
        beforeEach(function(done) {
            mockCustomers = [
	            {
	                firstname: 'p',
	                middlename: 'q',
	                lastname: 'k',
	                birthday: '1988-09-25',
	                phone: '0965999997',
	                edu: {},
	                email: 'hgf@gmail.com',
	                isStudent: true,
	                checkinStatus: false,
	            },
	            {
	                firstname: 'g',
	                middlename: 'f',
	                lastname: 's',
	                birthday: '1988-09-25',
	                phone: '0984731656',
	                edu: {},
	                email: 'hsdff@gmail.com',
	                isStudent: true,
	                checkinStatus: false,
	            }
            ];

            mockAccounts = [
	            {
	                amount: 10,
	                unit: 'hour',
	                start: moment(),
	                end: moment().add(5, 'day'),
	                services: ['group common', 'individual common']
	            }, {
	                amount: 2,
	                unit: 'hour',
	                start: moment(),
	                end: moment().add(5, 'day'),
	                services: ['group common', 'individual common']
	            }, {
	                amount: 24,
	                unit: 'hour',
	                start: moment(),
	                end: moment().hour(23).minute(59),
	                services: ['group common', 'individual common']
	            }, {
	                amount: 3,
	                unit: 'hour',
	                start: moment(),
	                end: moment().hour(23).minute(59),
	                services: ['group common', 'individual common']
	            }, {
	                amount: 10,
	                unit: 'hour',
	                start: moment(),
	                end: moment().add(30, 'day'),
	                services: ['small group private', 'individual common']
	            }
            ];

            mockOccs = [
	            {
	            	_id: '5941dbd882dedd1a1ceb1044',
	                createdAt: '2017-06-15T00:59:04.561Z',
	                status: 1,
	                customer: {},
	                promocodes: [],
	                service: {
	                    name: 'small group private',
	                    price: 150000,
	                },
	                paymentMethod: [],
	                checkinTime: moment().add(-3, 'hour'),
                	checkoutTime: moment(),
	            }, {
	                "_id": "5941dbe482dedd1a1ceb1045",
	                "parent": "5941dbd882dedd1a1ceb1044",
	                "updateAt": [],
	                "status": 1,
	                "customer": {},
	                "promocodes": [],
	                "service": {
	                    "name": "small group private",
	                    "price": 150000,
	                },
	                "paymentMethod": [],
	                checkinTime: moment().add(-3, 'hour'),
                	checkoutTime: moment(),
	            }, {
	            	_id: '5941dbd882dedd1a1ceb1046',
	                createdAt: '2017-06-15T00:59:04.561Z',
	                status: 1,
	                customer: {},
	                promocodes: [],
	                service: {
	                    name: 'small group private',
	                    price: 150000,
	                },
	                paymentMethod: [{name:'account', paid:2}],
	                checkinTime: moment().add(-3, 'hour'),
                	checkoutTime: moment(),
	            },{
	            	_id: '5941dbd882dedd1a1ceb1047',
	            	"parent": "5941dbd882dedd1a1ceb1046",
	                createdAt: '2017-06-15T00:59:04.561Z',
	                status: 1,
	                customer: {},
	                promocodes: [],
	                service: {
	                    name: 'small group private',
	                    price: 150000,
	                },
	                paymentMethod: [],
	                checkinTime: moment().add(-3, 'hour'),
                	checkoutTime: moment(),
	            }
            ];

            Customers.insertMany(mockCustomers, function(err, cus) {
                if (err) {
                    console.log(err)
                    return
                }

                newCustomer = cus;
                mockOccs[0].customer = cus[0];
                mockOccs[1].customer = cus[1];
                mockOccs[2].customer = cus[0];
                mockOccs[3].customer = cus[1];

                Occupancy.insertMany(mockOccs, function(err, occ) {
                    if (err) {
                        console.log(err)
                        return
                    }

                    newOcc = occ;
                    newOcc[0].getTotal();
                    newOcc[1].getTotal();
                    newOcc[2].getTotal();
                    newOcc[3].getTotal();

                    mockAccounts.map(function(x, i, arr) {
                        x.customer = newCustomer[0]._id;
                    });

                    Accounts.insertMany(mockAccounts, function(err, acc) {
                        if (err) {
                            console.log(err)
                            return
                        }

                        newAcc = acc;
                        var newAccIds = newAcc.map(function(x, i, arr) {
                            return x._id;
                        })
                        selectedAcc = newAcc[4];

			            newOcc[2].paymentMethod = [{
			                _id: selectedAcc._id,
							name: 'account',
							unit: selectedAcc.unit,
							paidTotal: 150000,
							paidAmount: 2,
							remain: 8,
			            }];

                        Customers.update({ _id: newCustomer[0]._id }, { $set: { accounts: newAccIds } }, function(err, cus) {
                            if (err) {
                                console.log(err)
                                return
                            }

                            done();
                        });

                    });


                });
            });
        });

        afterEach(function(done) {
            var accIds = newAcc.map(function(x, i, arr) {
                return x._id;
            });

            var cusIds = newCustomer.map(function(x, i, arr) {
                return x._id;
            });

            var occIds = newOcc.map(function(x, i, arr) {
                return x._id;
            });

            Occupancy.remove({ _id: { $in: occIds } }, function(err, data) {
                if (err) {
                    // console.log (err)
                    return
                }
                Customers.remove({ _id: { $in: cusIds } }, function(err, data) {
                    if (err) {
                        // console.log (err)
                        return
                    }

                    Accounts.remove({ _id: { $in: accIds } }, function(err, result) {
                        if (err) {
                            // console.log (err)
                            return
                        }

                        done();
                    });


                });

            });

        });

        it('should confirm checkout for leader with member successfully', function(done) {
            chai.request(server)
                .post('/checkout/group')
                .send({ data: newOcc.slice(0,3) })
                .end(function(err, res) {
                    if (err) {
                        console.log(err);
                    }

                    // find all occupancies at once, then test
                    // Similarly, find all customers at once, then test

                    // test status
                    res.body.data.message.should.equal('success')
                    Occupancy.find({}, function(err, occ){
                    	if (err) {
                            return
                        }
                        
                        // test all things updated
                        console.log(occ)
                        occ[0].status.should.equal(2);// only [0][1] checkout
                        occ[1].status.should.equal(2);
                        occ[2].status.should.equal(2);
                        occ[3].status.should.equal(1);
                        Customers.find({}, function(err, cus) {
                            if (err) {
                                return
                            }
                            console.log(cus)
                            // test all things updated
                            cus[0].checkinStatus.should.equal(false);
                            cus[1].checkinStatus.should.equal(false);
                            done()
                        })
                    })
                    
                });
        })

        it ('should confirm checkout for leader and member with account', function(done){
        	chai.request(server)
                .post('/checkout/group')
                .send({ data: newOcc.slice(2) })
                .end(function(err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.body.data.message.should.equal('success')
                    Occupancy.find({}, function(err, occ){
                    	if (err) {
                            return
                        }

                        console.log(occ)
                        occ[0].status.should.equal(1);
                        occ[1].status.should.equal(1);
                        occ[2].status.should.equal(2);
                        occ[3].status.should.equal(2);

                        Customers.find({}, function(err, cus) {
                            if (err) {
                                return
                            }

                            cus[0].checkinStatus.should.equal(false);
                            cus[1].checkinStatus.should.equal(false);
                            Accounts.findOne({ _id: selectedAcc._id }, function(err, foundAcc) {
                                if (err) {
                                    console.log(err);
                                }

                                foundAcc.amount.should.to.equal(8);
                                done()
                            })
                        })
                    })
                    
                });
        })
    })
})

