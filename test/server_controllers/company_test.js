var assert = require("assert"); // node.js core module
var request = require('request');

suite('Company test server', function() {
	suite('Read one company', function(done) {
		test('should render 1 company', function(done) {
			request({
				method:'GET',
				url:'http://localhost:3000/company',
				json: true
			}, function(err, res, body){
				console.log(body)
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('Edit one company', function(done) {
		test('should update role of a company', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/company/depts',
				body:{
					$set:{"role":"company"}
				},
				json: true
			}, function(err, res, body){
				console.log(body)
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('Edit one company', function(done) {
		test('should update role of a company', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/company/depts/dept/:deptid',
				body:{
					$set:{"role":"company"}
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