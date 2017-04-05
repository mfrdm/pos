var assert = require ('assert'); // node.js core module
var request = require ('request');
var helper = require ('../../libs/node/helper');
var TestHelper =  require ('../../libs/node/testHelper');
var dateFormat = require ('dateFormat');
var mongoose = require ('mongoose');

suite ('Test products.', function (){
	// setup
	var server = helper.getAPIOption().server;
	this.timeout (3000);
	var productId = '58e4cc569adecc33cc51da4a';
	var compId = new mongoose.Types	.ObjectId ();

	suite ('Read some products.', function (){
		var url = server + '/products';
		var qs = {
			userId: 'xxxx',
			compId: compId,
		};

		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

		test ('Should return successful code', function (done){
			th.testSuccess (done);
		});
	});

	suite ('Read one product by ID.', function (){
		var url = server + '/products/product/' + productId;
		var qs = {
			userId: 'xxxx',
		};

		var th = new TestHelper ({url: url, method: 'GET', qs: qs});

		test ('Should return successful code', function (done){
			th.testSuccess (done);
		});
	});

	suite ('Create one product.', function (){
		var url = server + '/products/create';
		var body = {
			userId: 'xxxx',
			name: 'Test product' ,
			price: Math.ceil (Math.random() * 10000),
			category: 1,
			compId: compId
		};

		var th = new TestHelper ({url: url, method: 'POST', body: body});

		test ('Should return successful code', function (done){
			th.testSuccess (done, 201);
		});
	});

	suite ('Update one product.', function (){
		var url = server + '/products/product/' + productId + '/edit';
		var body = {
			userId: 'xxxx',
			name: 'Test product_' + Date.now() ,
			price: Math.ceil (Math.random() * 10000),
			category: 2,
			updateAt: {
				time: dateFormat('isoDateTime'),
				explain: 'Test', 
			},			
			compId: compId
		};

		var th = new TestHelper ({url: url, method: 'POST', body: body});

		test ('Should return successful code', function (done){
			th.testSuccess (done);
		});
	});


});