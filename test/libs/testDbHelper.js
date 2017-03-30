var assert = require("assert"); // node.js core module
require('../../app_api/models/db');
var mongoose = require('mongoose');
var UserModel = mongoose.model('users');
var request = require('request');

suite('Database test', function() {

	suite('Create one new user', function(done) {
		test('should create one new user', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/users/user',
				body: {
					name:'cuong'
				},
				json: true
			}, function(err, res, body){
				console.log(res.statusCode);
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('Create some new users', function() {
		test('should create some new users', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/users/someUsers',
				body:[
						{name:'cun'},
						{name:'trung'},
						{name:'haha'}
					],
				json: true
			}, function(err, res, body){
				assert.equal(res.statusCode, 201);
				done();
			})
		});
	});

	suite('Update one by ID', function() {
		test('should update one user by ID', function(done) {
			var newUser = new UserModel();
			newUser.name = 'canh';
			newUser.save(function(err, user){
				if(err) throw(err);
				UserModel.findOne({name:'canh'}, function(err, user){
					assert.equal(user._id, 7);
				})
			});
		});
	});

	suite('Search one by ID', function() {
		test('should search one user by ID', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/users/user/search/58d8ebf120042d4228f2daa5',
				body:{},
				json: true
			}, function(err, res, body){
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('Search some users', function() {
		test('should search some users', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/users/user/find/some',
				body:{},
				json: true
			}, function(err, res, body){
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});
	teardown(function(){
		UserModel.findOneAndRemove({name:'canh'}, function(err){
			if(err) throw(err);
		})
	})
});