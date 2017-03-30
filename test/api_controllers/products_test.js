// var assert = require("assert"); // node.js core module
// require('../../app_api/models/db');
// var request = require('request');

// suite('Products API test', function() {
// 	suite('Find some products by given criteria', function(done) {
// 		test('should return some products', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/products?name=phong',
// 				json:true
// 			}, function(err, res, body){
// 				console.log(body.data);
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Find one Dept by given ID', function(done) {
// 		test('should return one Dept', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/products/product/58dcf265ce345f43c5eb14be',
// 				json:true
// 			}, function(err, res, body){
// 				console.log(res.body)
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('create product', function(done) {
// 		test('should create new product', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/api/products/create',
// 				body: {
// 					name:'phong'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				console.log(res.statusCode);
// 				assert.equal(res.statusCode, 201);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Find and update one Depts by given ID', function(done) {
// 		test('should return one Depts and update', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/api/products/product/58dcf21ecef7dd4362855e4c/edit/',
// 				body:{
// 					name: 'truc'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});
// });