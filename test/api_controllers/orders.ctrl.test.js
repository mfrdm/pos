process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

xdescribe ('Get total', function (){
	var orders, newOrders, query;

	beforeEach (function (done){
		var orders = [
			{total: 10000, status: 1, createdAt: moment ()},
			{total: 20000, status: 1, createdAt: moment ()},
			{total: 15000, status: 1, createdAt: moment ().add (-3, 'day')},
		]

		Orders.insertMany (orders, function (err, ords){
			if (err){
				console.log (err);
				return
			}

			newOrders = ords;
			done ();
		});
	});

	afterEach (function (done){
		var ids = newOrders.map (function (x, i, arr){
			return x._id;
		});

		Orders.remove ({_id: {$in: ids}}, function (err, result){
			if (err){
				console.log (err);
				return
			}

			done ();

		});		
	});

	xit ('should read total on today if no date range provided and return correct total of each type of services', function (done){
		chai.request (server)
			.get ('/api/orders/total')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}	

				var expectedTotal = 30000;
				var totals = res.body.data;

				res.should.have.status (200);

				totals.map (function (x, i, arr){
					x.total.should.to.equal (expectedTotal);
				});

				done ();
			});


	});

	it ('should read total within a date range if provided and return correct total of each type of services', function (done){
		query = {
			start: moment ().add (-3, 'days').format ('YYYY-MM-DD'),
			end: moment ().add (-3, 'days').format ('YYYY-MM-DD'),		
		};

		chai.request (server)
			.get ('/api/orders/total')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}	

				var expectedTotal = 15000;

				var totals = res.body.data;

				res.should.have.status (200);

				totals.map (function (x, i, arr){
					x.total.should.to.equal (expectedTotal);
				});

				done ();
			});


	});	

});

describe ('Get transactions', function (){
	beforeEach (function (done){
		var orders = [
			{total: 10000, status: 1, createdAt: moment (), orderline: [{productName: 'candy', price: 10000, quantity: 1}], customer: {fullname: 'xxx'}},
			{total: 20000, status: 1, createdAt: moment (), orderline: [{productName: 'candy', price: 10000, quantity: 1}], customer: {fullname: 'xxx'}},
			{total: 15000, status: 1, createdAt: moment ().add (-3, 'day'), orderline: [{productName: 'candy', price: 10000, quantity: 1}], customer: {fullname: 'xxx'}},
		];

		Orders.insertMany (orders, function (err, ords){
			if (err){
				console.log (err);
				return
			}

			newOrders = ords;
			done ();
		});
	});

	afterEach (function (done){
		var ids = newOrders.map (function (x, i, arr){
			return x._id;
		});

		Orders.remove ({_id: {$in: ids}}, function (err, result){
			if (err){
				console.log (err);
				return
			}

			done ();

		});		
	});	

	xit ('should return transaction within date range when provided', function (done){
		query = {

		}

		chai.request (server)
			.get ('/api/orders/transactions')
			.query ()
			.end (function (err, res){
				if (err){
					console.log (err);
				}	

				var trans = res.body.data;

				res.should.have.status (200);
				trans.should.to.have.lengthOf (2);
				trans.map (function (x, i, arr){
					x.orderline.should.to.exist;
					x.createdAt.should.to.exist;
					x.total.should.to.exist;
					x.customer.fullname.should.to.exist;
				});

				done ();
			});	
	});

	it ('should return transaction on today when data range not provided', function (done){
		query = {
			start: moment ().add (-3, 'days').format ('YYYY-MM-DD'),
			end: moment ().add (-3, 'days').format ('YYYY-MM-DD'),		
		};

		chai.request (server)
			.get ('/api/orders/transactions')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}	

				var trans = res.body.data;
				var expectedStart = moment ().add (-3, 'days').hour(0).minute(0);
				var expectedEnd = moment ().add (-3, 'days').hour(23).minute(59);

				res.should.have.status (200);

				trans.should.to.have.lengthOf (1);
				trans.map (function (x, i, arr){
					x.orderline.should.to.exist;
					x.createdAt.should.to.exist;
					x.total.should.to.exist;
					x.customer.fullname.should.to.exist;
					moment (x.createdAt).should.to.be.at.least (expectedStart);
					moment (x.createdAt).should.to.be.at.most (expectedEnd);
				});

				done ();
			});		
	});

});

