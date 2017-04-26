var assert = require("assert"); // node.js core module
var request = require('request');

suite('Orders API test', function() {
// 	suite('Find some orders by given criteria', function(done) {
// 		test('should return some orders', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/orders?name=food',
// 				json:true
// 			}, function(err, res, body){
// 				console.log(body.data);
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Find one Order by given ID', function(done) {
// 		test('should return one Order', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/orders/order/58dcf445082aa549510ef5b9',
// 				json:true
// 			}, function(err, res, body){
// 				console.log(res.body)
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

	suite('create order', function(done) {
		test('should create new order', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/api/orders/create',
				body: {
					orderline: [
						{
							productId: "58eb2d71a83bc43a426f0bd3",
							productName: "Private Room",
							quantity: 1
						}
					],
					customer:{
						customerId: "58eb474538671b4224745192",
						firstname: "duc",
						lastname: "long",
						phone: 34234234,
					},
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",
				},
				json: true
			}, function(err, res, body){
				console.log(res.statusCode);
				assert.equal(res.statusCode, 201);
				done();
			})
		});
	});

// 	suite('Find and update one Orders by given ID', function(done) {
// 		test('should return one Orders and update', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/api/orders/order/58dcf445082aa549510ef5b9/edit/',
// 				body:{
// 					name: 'shit'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});
});