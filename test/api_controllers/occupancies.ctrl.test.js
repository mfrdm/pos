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

describe ('Read total', function (){
	var newOccs, query;
	beforeEach(function (done){
		query = {};

		var occ = [
			{total: 100000, checkinTime: moment ().add (-2, 'hour'), checkoutTime: moment (), service: { name: 'group common', price: 10000}, status: 2},
			{total: 100000, checkinTime: moment ().add (-2, 'hour'), checkoutTime: moment (), service: { name: 'group common', price: 10000}, status: 2},
			{total: 100000, checkinTime: moment ().add (-2, 'hour'), checkoutTime: moment (), service: { name: 'individual common', price: 10000}, status: 2},
		];

		Occupancy.insertMany (occ, function (err, docs){
			if (err){
				console.log (err);
				return
			}

			newOccs = docs;
			done();
		});

	});

	afterEach (function (done){
		var ids = newOccs.map (function (x, i, arr){
			return x._id;
		});

		Occupancy.remove ({_id: {$in: ids}}, function (err, result){
			if (err){
				console.log (err);
				return
			}

			done ();

		});

	});

	it ('should read total on today if no date range provided and return correct total of each type of services', function (done){
		chai.request (server)
			.get ('/api/occupancies/total')
			.query (query)
			.end (function (err, res){
				if (err){
					console.log (err);
				}	

				var expectedTotal = {'group common': 200000, 'individual common': 100000}
				var totals = res.body.data;

				res.should.have.status (200);

				// STOP here: has issue using moment with mongo. wrap with built-in Date instead

				totals.map (function (x, i, arr){
					x.total.should.to.equal (expectedTotal[x.service.name])	
				});

				done ();
			});
	});

	it ('should read total within a date range if provided and return correct total of each type of services');

});