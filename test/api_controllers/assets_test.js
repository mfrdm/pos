var assert = require ('assert'); // node.js core module
var request = require ('request');
var helper = require ('../../libs/node/helper');
var TestHelper =  require ('../../libs/node/testHelper');

// suite ('Test assets API.', function (){
// 	// setup
// 	var server = helper.getAPIOption().server;

// 	suite ('Read some assets.', function (){
// 		var url = server + '/api/assets';
// 		var qs = {
// 			userId: 'xxxx',
// 			status: 1,
// 		};

// 		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

// 		test ('Should detect required input is not provided', function (done){
// 			th.testRequiredInput (done);
// 		});

// 		test ('Should detect status is in invalid format', function (done){
// 			var oldStatus = qs.status;
// 			qs.status = 'invalid format';
// 			th.testInputFormat (done, qs);
// 			qs.status = oldStatus;
// 		});		

// 		test ('Should detect status value is within valid range', function (done){
// 			var oldStatus = qs.status;
// 			qs.status = 'invalid value';
// 			th.testInputValue (done, qs);
// 			qs.status = oldStatus;
// 		});	

// 		test ('Should detect user has no permission to read assets', function (done){
// 			th.testPermission (done, 'no permission');	
// 		});

// 	});

	// suite ('Read one asset by Id.', function (){
	// 	var assetId = 2132132;
	// 	var url = server + '/api/assets/asset/' + assetId;
	// 	var qs = {
	// 		userId: 'xxxx',
	// 		assetId: 2312323,
	// 	};

	// 	var th = new TestHelper ({url: url, method: 'GET', qs: qs});

	// 	test ('Should detect required input is not provided', function (done){
	// 		th.testRequiredInput (done);
	// 	});

	// 	test ('Should detect user has no permission to read assets', function (done){
	// 		th.testPermission (done, 'no permission');	
	// 	});

	// });

	// suite ('Create one asset.', function (){
	// 	var url = server + '/api/assets/create';
	// 	var body = {
	// 		userId: 'xxxx',
	// 		name: 'Table',
	// 		assetCategory: 1,
	// 		quantity: 12,
	// 		status: 12,
	// 	};

	// 	var th = new TestHelper ({url: url, method: 'POST', body: body});

	// 	test ('Should detect required input is not provided', function (done){
	// 		th.testRequiredInput (done);
	// 	});

	// 	test ('Should detect input format is invalid', function (done){
	// 		th.testInputFormat (done, {
	// 			userId: body.userId,
	// 			name: 'invalid format',
	// 			assetCategory: 'invalid format',
	// 			quantity: 'invalid format',
	// 			status: 'invalid format',				
	// 		});
	// 	});

	// 	test ('Should detect input value is invalid', function (done){
	// 		th.testInputValue (done, {
	// 			userId: body.userId,
	// 			name: 'invalid value',
	// 			assetCategory: 'invalid value',
	// 			quantity: 'invalid value',
	// 			status: 'invalid value',				
	// 		});
	// 	});		

	// 	test ('Should detect user has no permission to create assets', function (done){
	// 		th.testPermission (done, 'no permission');	
	// 	});


	// });

	// suite ('Update one asset.', function (){
	// 	var assetId = 1234332;
	// 	var url = server + '/api/assets/asset/' + assetId + '/edit';
	// 	var body = {
	// 		userId: 'xxxx',
	// 		name: 'Table',
	// 		assetCategory: 1,
	// 		quantity: 12,
	// 		status: 12,
	// 	};

	// 	var th = new TestHelper ({url: url, method: 'POST', body: body});

	// 	test ('Should detect required input is not provided', function (done){
	// 		th.testRequiredInput (done);
	// 	});

	// 	test ('Should detect input format is invalid', function (done){
	// 		th.testInputFormat (done, {
	// 			userId: body.userId,
	// 			name: 'invalid format',
	// 			assetCategory: 'invalid format',
	// 			quantity: 'invalid format',
	// 			status: 'invalid format',				
	// 		});
	// 	});

	// 	test ('Should detect input value is invalid', function (done){
	// 		th.testInputValue (done, {
	// 			userId: body.userId,
	// 			name: 'invalid value',
	// 			assetCategory: 'invalid value',
	// 			quantity: 'invalid value',
	// 			status: 'invalid value',				
	// 		});
	// 	});	

	// 	test ('Should detect user has no permission to update assets', function (done){
	// 		th.testPermission (done, 'no permission');	
	// 	});
	// });


// });
