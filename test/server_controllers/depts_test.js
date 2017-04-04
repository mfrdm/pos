// var assert = require("assert"); // node.js core module
// var request = require('request');

// suite('dept test server', function() {
// 	suite('Read one dept', function(done) {
// 		test('should render one dept by ID', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/company/depts/dept/58e34810d8ec053a04f900ec',
// 				json: true
// 			}, function(err, res, body){
// 				console.log(body)
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Read some depts', function(done) {
// 		test('should render 1 dept', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/company/depts',
// 				json: true
// 			}, function(err, res, body){
// 				console.log(body)
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Create one dept', function(done) {
// 		test('should update role of a dept', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/company/depts/create',
// 				body:{
// 					name:"teama",
// 					manager:"tuan",
// 					staffList:[]
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				console.log(body)
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Edit one dept', function(done) {
// 		test('should update manager of a dept', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/company/depts/dept/58e34810d8ec053a04f900ec/edit',
// 				body:{
// 					$set:{"manager":"thanh"}
// 				},
// 				json: true
// 			}, function(err, res, body){
// 				console.log(body)
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});
// });