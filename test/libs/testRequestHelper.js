// var assert = require ('assert');
// var request = require ('request');
// var requestHelper = require ('../../libs/node/requestHelper');

// describe ('Test / ', function (){
// 	describe ('Test readApi / ', function (){
// 		it ('status code should be 200', function (done){
// 			var req = res = qs = {};
// 			var view = dataFilter = '';
// 			var apiUrl = 'http://localhost:3000/test/readApi';
// 			requestHelper.readApi (req, res, apiUrl, view, qs, dataFilter, 
// 				function (){}, 
// 				function(body, err, response, req, res, reqOptions){
// 					assert.equal (response.statusCode, 200);
// 					done ();
// 				}
// 			);

// 		});
// 	});

// 	describe ('Test postApi / ', function (){
// 		it ('status code should be 201', function (done){
// 			var req = res = qs = body = {};
// 			var view = dataFilter = '';
// 			var apiUrl = 'http://localhost:3000/test/postApi';
// 			requestHelper.postApi (req, res, apiUrl, view, body, dataFilter, 
// 				function (){}, 
// 				function(body, err, response, req, res, reqOptions){
// 					assert.equal (response.statusCode, 201);
// 					done ();
// 				}
// 			);

// 		});
// 	});

// });