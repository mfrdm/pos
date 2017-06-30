process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Deposits = mongoose.model ('Deposits');
var Customers = mongoose.model ('customers'); 
var Accounts = mongoose.model ('Accounts');

var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

describe ('Create one account', function (){

	var customer, deposits, newCustomer, newAcc, newDeposit, accounts;
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

		accounts = [
			{
				name: '1dCommon',
				price: 80000, // 
				amount: 24,
				unit: 'hour',
				desc: "",
				services: ['group common', 'individual common'], // name of service applied
				label: {
					vn: "Combo 1 ngày",
					en: "1 day commbo",
				},
				recursive: {
					isRecursive: false
				},
				expireDateNum: 1
			},
			{
				name: '3dCommon',
				price: 190000, // 
				amount: 24,
				unit: 'hour',
				desc: "",
				services: ['group common', 'individual common'], // name of service applied
				label: {
					vn: "Combo 3 ngày",
					en: "1 day commbo",
				},
				recursive: {
					isRecursive: true,
					lastRenewDate: new Date (),
					renewNum: 0, // number of renew
					maxRenewNum: 3, // 
					recursiveType: 1, // daily: 1, monthly: 2, annually: 3
					baseAmount: 24
				},
				expireDateNum: 7,
			},
			{
				name: 'cash',
				price: 200000, // 
				amount: 200000,
				unit: 'cash',
				desc: "",
				services: ['all'], // name of service applied
				label: {
					vn: "Tài khoàn tiền mặt 200,000 vnđ",
					en: "Cash account",
				},
				recursive: {
					isRecursive: false
				},
				expireDateNum: 30,
			},			
		];

		deposits = [
			{
				account: accounts[0],
				customer: {}
			},
			{
				account: accounts[1],
				customer: {}
			},
			{
				account: accounts[2],
				customer: {}
			}			
		];


		Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus;

			deposits = deposits.map (function (x, i, arr){
				x.customer = newCustomer;
				var curAccount = x.account;
				var d = new Deposits (x);
				d.getTotal ();
				d = d.toObject ();
				d.account = curAccount;
				return d
			});

			done ();

		});

	});

	afterEach (function (done){
		var accId = newAcc._id;
		var depositId = newDeposit._id;

		Customers.remove ({_id: newCustomer._id}, function (err, data){
			if (err){
				console.log (err);
				return
			}

			Deposits.remove ({_id: depositId}, function (err, result){
				if (err) {
					console.log (err)
					return
				}

				Accounts.remove ({_id: accId}, function (err, result){
					if (err) {
						console.log (err)
						return
					}

					done ();
				});				
			});
		});
	});


	it ('should successfully create an hour account, update customer, and create a deposit', function (done){
		chai.request (server)
			.post ('/deposits/create')
			.send ({data: deposits[0]})
			.end (function (err, res){
				if (err) {
					console.log (err);
				}

				res.should.have.status (200);
				res.body.data.should.to.exist;
				res.body.data.message.should.to.equal ('success');

				newDeposit = { _id: res.body.data._id};

				Deposits.findOne ({_id: newDeposit._id}, function (err, foundDeposit){
					if (err){
						console.log (err);
					}

					foundDeposit.total.should.to.equal (80000);
					foundDeposit.quantity.should.to.equal (1);
					foundDeposit.status.should.to.equal (1);

					Accounts.findOne ({_id: foundDeposit.account._id}, function (err, foundAcc){

						if (err){
							console.log (err);
						}

						newAcc = foundAcc;
						foundAcc.should.to.exist;

						Customers.findOne ({_id: newCustomer._id}, function (err, foundCus){
							if (err) {
								console.log (err)
							}

							foundCus.should.to.exist;
							foundCus.accounts.should.include (foundAcc._id.toString ());

							done ();

						});
					});
				});

			});		
	});

	it ('should successfully create an cash account, update customer, and create a deposit', function (done){
		chai.request (server)
			.post ('/deposits/create')
			.send ({data: deposits[2]})
			.end (function (err, res){
				if (err) {
					console.log (err);
				}

				res.should.have.status (200);
				res.body.data.should.to.exist;
				res.body.data.message.should.to.equal ('success');

				newDeposit = { _id: res.body.data._id};

				Deposits.findOne ({_id: newDeposit._id}, function (err, foundDeposit){
					if (err){
						console.log (err);
					}

					foundDeposit.total.should.to.equal (200000);
					foundDeposit.quantity.should.to.equal (1);
					foundDeposit.status.should.to.equal (1);

					Accounts.findOne ({_id: foundDeposit.account._id}, function (err, foundAcc){

						if (err){
							console.log (err);
						}

						newAcc = foundAcc;
						foundAcc.should.to.exist;

						Customers.findOne ({_id: newCustomer._id}, function (err, foundCus){
							if (err) {
								console.log (err)
							}

							foundCus.should.to.exist;
							foundCus.accounts.should.include (foundAcc._id.toString ());

							done ();

						});
					});
				});

			});	
	})

});

xdescribe ('Read invoice', function (){
	//
})

xdescribe ('Read groupon', function (){
	var deposits, newDeposit, query;
	beforeEach (function (done){
		deposits = [
			{
				groupon: {
					quantity: 4,
					isLeader: true
				},
				account: {},
				customer: {fullname: 'ABC'},
				location: {_id: "58eb474538671b4224745192"}
			},
			{
				groupon: {
					quantity: 6,
					isLeader: true
				},
				account: {},
				customer: {fullname: 'XYZ'},
				location: {_id: "58eb474538671b4224745192"}
			},
			{
				groupon: {
					quantity: 10,
					isLeader: true
				},
				account: {},
				customer: {fullname: 'GNL'},
				createdAt: moment ().add (-2, 'day'),
				location: {_id: "58eb474538671b4224745191"}
			},			
		];

		query = {
			storeId: "58eb474538671b4224745192"
		} 

		Deposits.insertMany (deposits, function (err, newDep){
			if (err){
				console.log (err);
				return
			}

			newDeposit = newDep;
			done ();
		});

	});

	afterEach (function (done){
		var depIds = newDeposit.map (function (x, i, arr){ return x._id });
		Deposits.remove ({_id: {$in: depIds}}, function (err, result){
			if (err){
				console.log (err);
				return
			}

			done ();
		})
	});

	it ('should return today groupon when no date is provided', function (done){
		chai.request (server)
			.get ('/deposits/groupon')
			.query (query)
			.end (function (err, res){
				if (err) {
					// console.log (err);
				}

				var expectedCustomer = ['XYZ', 'ABC'];

				res.should.to.have.status (200);
				res.body.data.should.to.have.lengthOf (2);
				res.body.data.map (function (x, i, arr){
					expectedCustomer.indexOf (x.customer.fullname).should.to.not.equal (-1);
					x.groupon.isLeader.should.to.equal (true);
					x.groupon.quantity.should.to.be.at.least (3);
				});

				done ();

			});
	})

	it ('should return groupon within provided date range')
})