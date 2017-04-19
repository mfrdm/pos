var assert = require ('assert'); // node.js core module
var request = require ('request');
var helper = require ('../../libs/node/helper');
var TestHelper = require ('../../libs/node/testHelper');


suite('Authentication test.', function() {
	// setup
	var server = helper.getAPIOption().server;
	this.timeout (3000);

	// test ('Should have set JWT_SECRET as an environment variable', function (done){
	// 	new TestHelper().placeholder (done);
	// });

	suite ('User request access to a resource.', function (){
		var url = server + '/';
		qs = {}
		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

		// test ('Should detect user does not login', function (done){
			
		// 	var qs = {
		// 		token: 'invalid value'
		// 	};

		// 	th.testStdInputValue (done, qs, 401);
		// });

		test ('Should successfully access', function (done){
			// login
			// access later
			request (
				{
					method: 'POST',
					url: server + '/api/login',
					json: true,
					body: {
						email: 'hieppm.greenspace-cw@greenspace-cw.com',
						// firstname: 'Hiep',
						// lastname: 'Pham',
						password: 'greenspace',
						phone: '0965284281',	
					}									
				}, 
				function (err, res, body){
					request (
						{
							method: 'GET',
							url: server + '/',
							json: true,
							qs: {
								payload: body.token
							}
						},
						function (err, res, body){
							assert (true, false);
							done()
						}
					);
				}
			);	
		})
	});


	// suite ('User register local account.', function (){
	// 	var url = server + '/api/register';
	// 	var body = {
	// 		email: 'hieppm.greenspace-cw@greenspace-cw.com',
	// 		firstname: 'Hiep',
	// 		lastname: 'Pham',
	// 		password: 'greenspace',
	// 		phone: '0965284281',
	// 	};

	// 	var th = new TestHelper ({url: url, method: 'POST', body: body});		

	// 	test ('Should detect not enough input', function (done){
	// 		th.testRequiredInput (done);
	// 	});

	// 	test ('Should detect invalid format', function (done){
	// 		th.placeholder (done);		
	// 	})

	// 	test ('Should detect phone or email is used to create another account', function (done){
	// 		th.placeholder (done);
	// 	});

	// 	test ('Should create a new user account', function (done){
	// 		// comment out to prevent create new account
	// 		// th.testSuccess (done, 201);
	// 		th.placeholder (done);
	// 	});

	// });

	// suite ('User logs in local account.', function (){

	// 	var url = server + '/api/login';
	// 	var body = {
	// 		email: 'hieppm.greenspace-cw@greenspace-cw.com',
	// 		// firstname: 'Hiep',
	// 		// lastname: 'Pham',
	// 		password: 'greenspace',
	// 		phone: '0965284281',
	// 	};

	// 	var th = new TestHelper ({url: url, method: 'POST', body: body});	

	// 	test ('Should aware user does not register', function (done){
	// 		var nonRegisterPhone = '0000000';
	// 		var oldPhone = body.phone;
	// 		body.phone = nonRegisterPhone;
	// 		th.testStdInputValue (done, body, 401);
	// 		body.phone = oldPhone;
	// 	});

	// 	test ('Should login successfully', function (done) {
	// 		th.testSuccess (done);
	// 	});
	// })

});