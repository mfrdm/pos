var assert = require("assert"); // node.js core module
var request = require('request');

suite('Booking test server', function() {
	// suite('Show all the bookings', function(done) {
	// 	test('should return array of book as data', function(done) {
	// 		request({
	// 			method:'GET',
	// 			url:'http://localhost:3000/bookings',
	// 			json: true
	// 		}, function(err, res, body){
	// 			console.log(body)
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Create a booking', function(done) {
	// 	test('should create new booking with cusid', function(done) {
	// 		request({
	// 			method:'POST',
	// 			url:'http://localhost:3000/bookings/58e1fc1f7106c63ea5619726',
	// 			body:{
	// 				productId:"58e1fbb34f76af3e1a7fcd5f"
	// 			},
	// 			json: true
	// 		}, function(err, res, body){
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Edit a booking', function(done) {
	// 	test('should update status of booking', function(done) {
	// 		request({
	// 			method:'POST',
	// 			url:'http://localhost:3000/bookings/58e2f5e1a1ebc517e8e81234/edit',
	// 			body:{
	// 				$set:{"status":"1"}
	// 			},
	// 			json: true
	// 		}, function(err, res, body){
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });	
});