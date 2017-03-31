var assert = require("assert"); // node.js core module
var request = require('request');

suite('Checkin controller test', function() {
	suite('Return all customers currently use service', function(done) {
		test('should return some companies', function(done) {
			request({
				method:'GET',
				url:'http://localhost:3000/checkin',
				json: true
			}, function(err, res, body){
				console.log(body);
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});
});