var assert = require("assert"); // node.js core module
var request = require('request');

suite('Checkin controller test', function() {
	// suite('Return all customers currently use service', function(done) {
	// 	test('should return some customers', function(done) {
	// 		request({
	// 			method:'GET',
	// 			url:'http://localhost:3000/checkin',
	// 			json: true
	// 		}, function(err, res, body){
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Go to a specific customer', function(done) {
	// 	test('should go to a customer site', function(done) {
	// 		request({
	// 			method:'GET',
	// 			url:'http://localhost:3000/customers/customer/58e1aaa448718713c731e60e',
	// 			json: true
	// 		}, function(err, res, body){
	// 			console.log(body)
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Create new order with a specific customer', function(done) {
	// 	test('should create new order for a customer', function(done) {
	// 		request({
	// 			method:'POST',
	// 			url:'http://localhost:3000/checkin/58e1d0e388be352a95ef516e',
	// 			body:{
	// 				name:"personal room",
	// 				status:1
	// 			},
	// 			json: true
	// 		}, function(err, res, body){
	// 			console.log(body)
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Append order to a customer', function(done) {
	// 	test('should add new order to a customer - edit customer', function(done) {
	// 		request({
	// 			method:'POST',
	// 			url:'http://localhost:3000/customers/customer/58e1aaa448718713c731e60e/edit',
	// 			body:{
	// 				"order":{"orderId":"58e1b9f18aaa051fb326d23d"}
	// 			},
	// 			json: true
	// 		}, function(err, res, body){
	// 			console.log(body)
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });
});