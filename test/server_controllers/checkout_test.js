var assert = require("assert"); // node.js core module
var request = require('request');

suite('Checkout controller test', function() {
	suite('Go to invoice page', function(done) {
		test('should go to invoice page', function(done) {
			request({
				method:'GET',
				url:'http://localhost:3000/checkout/invoice/58e1d0e388be352a95ef516e',
				json: true
			}, function(err, res, body){
				console.log(body);
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});

	suite('Confirm checkout', function(done) {
		test('should change the status of order to 2', function(done) {
			request({
				method:'POST',
				url:'http://localhost:3000/checkout',
				body:{
					orderId:"58e1d0ffdc077b2ad78d139d"
				},
				json: true
			}, function(err, res, body){
				console.log(body);
				assert.equal(res.statusCode, 200);
				done();
			})
		});
	});
})