// var assert = require("assert"); // node.js core module
// require('../../app_api/models/db');
// var request = require('request');

// suite('User Api test', function() {
// 	suite('Find some customers by given criteria', function(done) {
// 		test('should return some customers', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/customers?firstname=tuan',
// 				body: {
// 					name:'cuong'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				console.log(body.data);
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Find one customers by given ID', function(done) {
// 		test('should return one customers', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/customers/customer/58dce1ca07a54b26559034e4',
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('create customers', function(done) {
// 		test('should create new customers', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/api/customers/create',
// 				body: {
// 					firstname:'tuan'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				console.log(res.statusCode);
// 				assert.equal(res.statusCode, 201);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Find and update one customers by given ID', function(done) {
// 		test('should return one customers and update', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/api/customers/customer/58dce1ca07a54b26559034e4/edit/',
// 				body:{
// 					firstname: 'hahnh'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});
// });