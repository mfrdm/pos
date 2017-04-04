var assert = require("assert"); // node.js core module
var request = require('request');

suite('customer test server', function() {
	suite('Read some customers', function(done) {
		test('should render some customers', function(done) {
			request({
				method:'GET',
				url:'http://localhost:3000/customers',
				json: true
			}, function(err, res, body){
				console.log(body)
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('Create one customer', function(done) {
		test('should update role of a customer', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/customers/create',
				body:{
					firstname:"tung",
					order:[],
					booking:[]
				},
				json: true
			}, function(err, res, body){
				console.log(body)
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});
});