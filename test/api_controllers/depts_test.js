// var assert = require("assert"); // node.js core module
// require('../../app_api/models/db');
// var request = require('request');

// suite('User Api test', function() {
// 	suite('Find some Depts by given criteria', function(done) {
// 		test('should return some Depts', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/companies/depts?name=pr',
// 				json: true
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
// 				url:'http://localhost:3000/api/depts/dept/58dcef41b1447039cef02206',
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('create dept', function(done) {
// 		test('should create new depts', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/api/depts/create',
// 				body: {
// 					name:'pr'
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
// 				url:'http://localhost:3000/api/depts/dept/58dcef41b1447039cef02206/edit/',
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