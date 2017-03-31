var assert = require ("assert"); // node.js core module
var request = require ('request');
var helper = require ('../../libs/node/helper');

suite ('Test booking API.', function() {
	// setup
	var server = helper.getAPIOption().server;

	// suite ('Update a booking', function (){
	// 	var route = '/api/bookings/booking';
	// 	var bookingId = 'xxxx';
	// 	var url = server + route + '/' + bookingId + '/edit';
	// 	var body = {
	// 		userId: 'xxxxxx',
	// 		checkinTime: '2017-04-10 10:11:20',
	// 	};

	// 	test ('Should detect user id is not provided', function (done){
	// 		var oldUserId = body.userId;
	// 		body.userId = '';

	// 		request ({
	// 			method: 'POST',
	// 			url: url,
	// 			json: true,
	// 			body: body,
	// 		}, function (err, res, body){
	// 			assert.equal (res.statusCode, 400);
	// 			done();				
	// 		});

	// 		body.userId = oldUserId;

	// 	});

	// 	test ('Should detect a user has no permission to update a booking', function (done){
	// 		var oldUserId = body.userId;
	// 		body.userId = 'invalid value';

	// 		request ({
	// 			method: 'POST',
	// 			url: url,
	// 			json: true,
	// 			body: body,
	// 		}, function (err, res, body){
	// 			assert.equal (res.statusCode, 403);
	// 			done();				
	// 		});

	// 		body.userId = oldUserId;
	// 	});


	// 	test ('Should detect checkinTime is invalid', function (done){
	// 		var oldCheckinTime = body.checkinTime;
	// 		body.checkinTime = 'invalid value';

	// 		request ({
	// 			method: 'POST',
	// 			url: url,
	// 			json: true,
	// 			body: body,
	// 		}, function (err, res, body){
	// 			assert.equal (res.statusCode, 400);
	// 			done();				
	// 		});

	// 		body.checkinTime = oldCheckinTime;
	// 	});

	// });


	// suite ('Create a booking', function (){
	// 	var route = '/api/bookings/create';
	// 	var url = server + route;
	// 	var body = {

	// 	};

	// 	test ('Should detect required input is not provided', function (done){
	// 		var oldCheckinTime = body.checkinTime;
	// 		body.checkinTime = '';

	// 		request ({
	// 			method: 'POST',
	// 			url: url,
	// 			json: true,
	// 			body: body,
	// 		}, function (err, res, body){
	// 			assert.equal (res.statusCode, 400);
	// 			done();				
	// 		});

	// 		body.checkinTime = oldCheckinTime;
	// 	});

	// 	test ('Should detect input is in incorrect format', function (done){
	// 		var oldCheckinTime = body.checkinTime;
	// 		body.checkinTime = 'invalid value';

	// 		request ({
	// 			method: 'POST',
	// 			url: url,
	// 			json: true,
	// 			body: body,
	// 		}, function (err, res, body){
	// 			assert.equal (res.statusCode, 400);
	// 			done();				
	// 		});		

	// 		body.checkinTime = oldCheckinTime;	
	// 	});

	// 	test ('Should detect invalid input', function (done){
	// 		assert.equal (true, false);
	// 		done();
	// 	});
	// });

	suite ('Find one booking by its ID.', function(){
		var route = '/api/bookings/booking/';
		var url = server + route;	
		var bookingid = 'x';

		var qs = {};
			
		test ('Should detect user has no permission to access a booking', function (done){
			assert.equal (true, false);
			done();
		});

		test ('Should detect booking id is invalid', function (done){
			var oldId = bookingid;
			bookingid = 'invalid value';

			request ({
				method:'GET',
				url: url + bookingid,
				json: true,
				qs: qs,
			}, function (err, res, body) {
				assert.equal(res.statusCode, 400);
				done();
			});	

			bookingId = oldId;
		});

		test ('Should detect required input is not provided', function (done){
			assert.equal(true, false);
			done();		
		});

	});


	// suite ('Find some booking given criteria.', function() {
	// 	var qs = {
	// 		customerId: 2312312,
	// 		product: 1,
	// 		location: 1,
	// 		start: '2017-03-31 10:20:00',
	// 		end: '2017-03-31 12:20:00',
	// 	}

	// 	var route = '/api/bookings';
	// 	var url = server + route;

	// 	test ('Should detect empty required input', function (done){
	// 		var oldStart = qs.start;
	// 		qs.start = '';

	// 		request({
	// 			method:'GET',
	// 			url: url,
	// 			json: true,
	// 			qs: qs,
	// 		}, function(err, res, body){
	// 			assert.equal(res.statusCode, 400);
	// 			done();
	// 		});

	// 		qs.start = oldStart;
	// 	});


	// 	test('Should detect start and end dates are not in correct format', function (done){
	// 		var oldEnd = qs.end;
	// 		qs.end = 'invalid value';
	// 		// qs.end = 'xxx';

	// 		request({
	// 			method:'GET',
	// 			url: url,
	// 			json: true,
	// 			qs: qs,
	// 		}, function(err, res, body){
	// 			assert.equal(res.statusCode, 400);
	// 			done();
	// 		});	

	// 		qs.end = oldEnd;	
	// 	});


	// 	test('Should detect end date is less than start date', function (done){
	// 		// setup
	// 		var oldStart = qs.start;
	// 		var oldEnd = qs.end;

	// 		qs.start = oldEnd;
	// 		qs.end = oldStart;

	// 		request({
	// 			method:'GET',
	// 			url: url,
	// 			json: true,
	// 			qs: qs,
	// 		}, function(err, res, body){
	// 			assert.equal(res.statusCode, 400);
	// 			done();
	// 		});

	// 		// tear down
	// 		qs.start = oldStart;
	// 		qs.end = oldEnd;

	// 	});

	// });

});