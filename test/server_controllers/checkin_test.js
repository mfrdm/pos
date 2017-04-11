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

	suite('Create new order with a specific customer', function(done) {
		test('should create new order for a customer', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/checkin/58e1fc1f7106c63ea5619726',
				body:{
					orderline:[{
						productId:"58eb2d71a83bc43a426f0bd3",
						productName:"Private Room",
						price:10000
					}],
					status:1
				},
				json: true
			}, function(err, res, body){
				console.log(body)
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

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

	// suite('Edit order of a customer', function(done) {
	// 	test('should change the product line', function(done) {
	// 		request({
	// 			method:'POST',
	// 			url:'http://localhost:3000/checkin/58e1fef23a4948415f0932df/edit',
	// 			body:{
	// 				$set:{
	// 					"orderline":[{
	// 						productId:"58e1fbb34f76af3e1a7fcd5f",
	// 						productName:"food",
	// 						price:5000,
	// 						quantity:222
	// 					},
	// 					{
	// 						productId:"58e1fdc4cf2a403fd0b3a811",
	// 						productName:"fruit",
	// 						price:10000,
	// 						quantity:54
	// 					}]
	// 				}
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