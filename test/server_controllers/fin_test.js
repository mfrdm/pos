var assert = require ('assert'); // node.js core module
var request = require ('request');
var helper = require ('../../libs/node/helper');
var TestHelper =  require ('../../libs/node/testHelper');
var dateFormat = require ('dateFormat');

suite ('Test finance.', function (){
	// setup
	var server = helper.getAPIOption().server;
	this.timeout (3000);
	var costId = '58e4754f95e39314c6bf3bc2';

	suite ('Read some costs.', function (){
		var url = server + '/fin/costs/';

		var qs = {
			userId: 'xxxx',
			start: '2017-01-03',
			end: '2017-01-10',
		};

		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

		test ('Should return successful code', function (done){
			th.testSuccess (done);
		});

	});

	suite ('Read one cost by Id.', function (){
		var url = server + '/fin/costs/cost/' + costId;
		var qs = {
			userId: 'xxxx',
		};

		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

		test ('Should return successful code', function (done){
			th.testSuccess (done);
		});

	});	

	suite ('Create one cost.', function (){
		var url = server + '/fin/costs/create';
		var body = {
			userId: 'xxxx',
			amount: Math.ceil((Math.random () * 100000)),
			costType: 1,
		};

		var th = new TestHelper ({url: url, method: 'POST', body: body});

		test ('Should return successful code', function (done){
			th.testSuccess (done, 201);
		});

	});	


	suite ('Update one cost.', function (){
		var url = server + '/fin/costs/cost/' + costId + '/edit';
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

		test ('Should return successful code', function (done){
			th.testSuccess (done);
		});

	});		


});