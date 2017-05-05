// var assert = require("assert"); // node.js core module
// var request = require('request');

// suite('Hr test server', function() {
// 	suite('Read one staff', function(done) {
// 		test('should render 1 staff', function(done) {
// 			request({
// 				method:'GET',
// 				url:'http://localhost:3000/hr/employees/employee/58e30a50fc633b266e9377e5',
// 				json: true
// 			}, function(err, res, body){
// 				console.log(body)
// 				assert.equal(res.statusCode, 200);
// 				done();
// 			})
// 		});
// 	});

// 	suite('Edit a staff', function(done) {
// 		test('should update role of a staff', function(done) {
// 			request({
// 				method:'POST',
// 				url:'http://localhost:3000/hr/employees/employee/58e30a50fc633b266e9377e5/edit',
// 				body:{
// 					$set:{"role":"staff"}
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