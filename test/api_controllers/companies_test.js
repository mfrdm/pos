var assert = require("assert"); // node.js core module
require('../../app_api/models/db');
var request = require('request');

suite('User Api test', function() {
	suite('Find some companies by given criteria', function(done) {
		test('should return some companies', function(done) {
			request({
				method:'GET',
				url:'http://localhost:3000/api/companies?name=Gre',
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

	suite('Find one company by given ID', function(done) {
		test('should return one company', function(done) {
			request({
				method:'GET',
				url:'http://localhost:3000/api/companies/company/58dceb2fa6a6ba3534414a55',
			}, function(err, res, body){
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('create company', function(done) {
		test('should create new company', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/api/companies/create',
				body: {
					name:'Green Space'
				},
				json: true
			}, function(err, res, body){
				console.log(res.statusCode);
				assert.equal(res.statusCode, 201);
				done();
			})
		});
	});

	suite('Find and update one company by given ID', function(done) {
		test('should return one company and update', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/api/companies/company/58dceb2fa6a6ba3534414a55/edit/',
				body:{
					name: 'Trolll'
				},
				json: true
			}, function(err, res, body){
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});
});