var assert = require ('assert'); // node.js core module
var request = require ('request');
var helper = require ('../../libs/node/helper');
var TestHelper = require ('../../libs/node/testHelper');


suite('User Api test', function() {
	// setup
	var server = helper.getAPIOption().server;
	this.timeout (3000);

// 	suite('Find some users by given criteria', function(done) {
// 		test('should return some users', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/users?firstname=cuong',
// 				body: {
// 					name:'trung'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				console.log(body.data);
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Find one users by given ID', function(done) {
// 		test('should return one users', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/api/users/user/58dcdda5a687cc1f0ca4895d',
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

	suite('create user', function(done) {
		var url = server + '/api/users/create';
		var body = {
			firstname:'Hiep',
			lastname: 'Pham'		
		}

		var th = new TestHelper ({url: url, method: 'POST', body: body});

		test('should create new users', function(done) {
			th.testSuccess (done, 201);
		});
	});

// 	suite('Find and update one users by given ID', function(done) {
// 		test('should return one users and update', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/api/users/user/58dcdda5a687cc1f0ca4895d/edit/',
// 				body:{
// 					firstname: 'duc'
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});


});