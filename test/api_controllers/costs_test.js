var assert = require ('assert'); // node.js core module
var request = require ('request');
var helper = require ('../../libs/node/helper');
var TestHelper =  require ('../../libs/node/testHelper');
var dateFormat = require ('dateFormat');

suite ('Test costs API.', function (){
	// setup
	var server = helper.getAPIOption().server;
	var costId = '58e4754f95e39314c6bf3bc2';
	this.timeout (3000);

	suite ('Read some costs.', function (){

		var url = server + '/api/costs';
		var qs = {
			userId: 'xxxx',
			start: '2017-01-31',
			end: '2017-03-30',
		};

		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

		test ('Should detect required input is not provided', function (done){
			th.testRequiredInput (done);
		});

		test ('Should detect date is in invalid format', function (done){
			var oldStart = qs.start;
			var oldEnd = qs.end;

			qs.start = 'invalid format';
			qs.end = 'invalid format';

			th.testInputFormat (done, qs);

			qs.start = oldStart;
			qs.end = oldEnd;
		});		

		test ('Should detect start date is greater than end date', function (done){
			var oldStart = qs.start;
			var oldEnd = qs.end;
			qs.start = oldEnd;
			qs.end = oldStart;

			th.testInputValue (done, qs);

			qs.start = oldStart;
			qs.end = oldEnd;
		});	

		test ('Should detect user has no permission to read cost', function (done){
			th.testPermission (done, 'no permission');	
		});

	});

	suite ('Read one cost by ID.', function (){
		var url = server + '/api/costs/cost/' + costId;
		var qs = {
			userId: 'xxxx',
		};

		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

		test ('Should detect required input is not provided', function (done){
			th.testRequiredInput (done);	

		});

		test ('Should detect user has no permission', function (done){
			th.testPermission (done, 'no permission');			
		});

	});	

	suite ('Create one cost.', function (){
		var url = server + '/api/costs/create';
		var body = {
			userId: 'xxxx',
			amount: Math.ceil((Math.random () * 100000)),
			costType: 1,
		};		

		var th = new TestHelper ({url: url, method: 'POST', body: body});

		test ('Should detect required input is not provided', function (done){
			th.testRequiredInput (done);
		});

		test ('Should detect input is in invalid format', function (done){
			var oldAmount = body.amount;
			var oldCostType = body.costType;

			body.amount = 'invalid format';
			body.costType = 'invalid format';

			th.testInputFormat (done, body);

			body.amount = oldAmount;
			body.costType = oldCostType;
		});

		test ('Should detect user has no permission', function (done){
			th.testPermission (done, 'no permission');			
		});

		test ('Should successfully create one cost', function (done){
			th.testSuccess (done, 201);
		});

	});

	suite ('Update one cost.', function (){
		var url = server + '/api/costs/cost/' + costId + '/edit';
		var body = {
			userId: 'xxxx',
			amount: Math.ceil((Math.random () * 100000)),
			costType: 2,
			updateAt: {
				time: dateFormat ('isoDateTime'),
				explain: 'test'
			}
		};	

		var th = new TestHelper ({url: url, method: 'POST', body: body});

		test ('Should detect required input is not provided', function (done){
			th.testRequiredInput (done);
		});

		test ('Should detect input is in invalid format', function (done){
			var oldAmount = body.amount;
			var oldCostType = body.costType;
			body.amount = 'invalid format';
			body.costType = 'invalid format';

			th.testInputFormat (done, body)

			body.amount = oldAmount;
			body.costType = oldCostType;

		});

		test ('Should detect user has no permission', function (done){
			th.testPermission (done, 'no permission');			
		});	

		test ('Should successfully update one cost', function (done){
			th.testSuccess (done, 200);
		});

	});

});