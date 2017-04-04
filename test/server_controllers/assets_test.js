var assert = require("assert"); // node.js core module
var request = require('request');

suite('asset test server', function() {
	// suite('Read one asset', function(done) {
	// 	test('should render one asset by ID', function(done) {
	// 		request({
	// 			method:'GET',
	// 			url:'http://localhost:3000/assets/asset/58e34810d8ec053a04f900ec',
	// 			json: true
	// 		}, function(err, res, body){
	// 			console.log(body)
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Read some assets', function(done) {
	// 	test('should render some assets', function(done) {
	// 		request({
	// 			method:'GET',
	// 			url:'http://localhost:3000/assets',
	// 			json: true
	// 		}, function(err, res, body){
	// 			console.log(body)
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Create one asset', function(done) {
	// 	test('should create a asset', function(done) {
	// 		request({
	// 			method:'POST',
	// 			url:'http://localhost:3000/assets/create',
	// 			body:{
	// 				name:"chair",
	// 				quantity:5
	// 			},
	// 			json: true
	// 		}, function(err, res, body){
	// 			console.log(body)
	// 			assert.equal(res.statusCode, 200);
	// 			done();
	// 		})
	// 	});
	// });

	// suite('Edit one asset', function(done) {
	// 	test('should update manager of a asset', function(done) {
	// 		request({
	// 			method:'POST',
	// 			url:'http://localhost:3000/assets/asset/58e34810d8ec053a04f900ec/edit',
	// 			body:{
	// 				$set:{"quantity":"9"}
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