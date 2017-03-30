var assert = require("assert"); // node.js core module
require('../../app_api/models/db');
var mongoose = require('mongoose');
var UserModel = mongoose.model('users');
var request = require('request');

suite('User Api test', function() {
	suite('Find some users by given criteria', function(done) {
		test('should return some users', function(done) {
			request({
				method:'GET',
				url:'http://localhost:3000/api/users?firstname=cuong',
				body: {
					name:'cuong'
				},
				json: true
			}, function(err, res, body){
				console.log(body.data);
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('create user', function(done) {
		test('should create new users', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/api/users/create',
				body: {
					firstname:'trung'
				},
				json: true
			}, function(err, res, body){
				console.log(res.statusCode);
				assert.equal(res.statusCode, 201);
				done();
			})
		});
	});
});