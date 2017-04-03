// var assert = require("assert"); // node.js core module
// var request = require('request');
// var helper = require('../../libs/node/helper');

// suite('Test booking API.', function() {
// 	suite('Find some booking given criteria.', function(done) {
// 		var qs = {
// 			customerId: 2312312,
// 			service: 1,
// 			location: 1,
// 			start: '2017-03-31 10:20:00',
// 			end: '2017-03-31 12:20:00',
// 		}

// 		test ('Should detect empty required input', function (done){
// 			var oldStart = qs.start;
// 			qs.start = '';

// 			request({
// 				method:'GET',
// 				url: helper.getAPIOption().server + '/api/bookings',
// 				json: true,
// 				qs: qs,
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 400);
// 				done();
// 			});

// 			qs.start = oldStart;
// 		});


// 		test('Should detect end date is less than start date', function (done){
// 			// setup
// 			var oldStart = qs.start;
// 			var oldEnd = qs.end;

// 			qs.start = oldEnd;
// 			qs.end = oldStart;

// 			request({
// 				method:'GET',
// 				url: helper.getAPIOption().server + '/api/bookings',
// 				json: true,
// 				qs: qs,
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 400);
// 				done();
// 			});

// 			// tear down
// 			qs.start = oldStart;
// 			qs.end = oldEnd;

// 		});

// 		test('Should return bookings in given input date', function(done) {
// 			request({
// 				method:'GET',
// 				url: helper.getAPIOption().server + '/api/bookings',
// 				json: true,
// 				qs: qs,
// 			}, function(err, res, body){
// 				assert.equal (new Date (body.bookings[0].checkinTime) >= new Date(qs.start), true);
// 				assert.equal (new Date (body.bookings[0].checkinTime) <= new Date(qs.end), true);
// 				done();
// 			});
// 		});

// 		test('Should return successful code', function(done) {
// 			request({
// 				method:'GET',
// 				url: helper.getAPIOption().server + '/api/bookings',
// 				json: true,
// 				qs: qs,
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			});
// 		});

// 	});

// });