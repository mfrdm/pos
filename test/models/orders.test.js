var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes');
var Orders = require ('../../app_api/models/orders');


describe ('Orders', function (){
	var order, val;
	beforeEach (function (){
		val = {
			checkinTime: '2017-05-10 6:00:00',
			checkoutTime: '2017-05-10 7:00:00',			
			orderline: [ 
				{ "productName" : "Group Common", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 15000 }, 
				{ "productName" : "Coca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 2, price: 10000 }, 
				{ "productName" : "Poca", "_id" : "58ff58e6e53ef40f4dd664cd", "quantity" : 1, price: 10000 }
			],
			customer: {
				_id: '58ff58e6e53ef40f4dd664cd',
				firstname: 'Hiep',
				lastname: 'Pham',
				middlename: 'Manh',
				email: 'hiep@gmail.com',
				phone: '0995435439'
			},
			storeId: "58eb474538671b4224745192",
			staffId: "58eb474538671b4224745192",			
		}

	});

	it ('should be invalid when required input is not provided', function (done){
		order = new Orders ({});
		order.validate (function (err){
			err.errors['customer.id'].should.to.exist;
			err.errors.storeId.should.to.exist;
			err.errors.staff.should.to.exist;
		});

		done ();
	});

	it ('should be invalid when total < 0', function (done){
		var val = {
			total: -100,
		}

		var order = new Orders (val);
		order.validate (function (err){
			err.errors.total.should.to.exist;
			done ();
		});
	});

	it ('should be valid when total > 0', function (done){
		var val = {
			total: 100,
		}

		var order = new Orders (val);
		order.validate (function (err){
			err.errors.should.to.not.have.property ('total');
			done ();
		});
	});	

	it ('should return correct usage time when it is below 6 mins', function (){
		val.checkinTime = '2017-05-10 6:05:00';
		val.checkoutTime = '2017-05-10 6:08:00';

		var order = new Orders (val);
		var usage = order.getUsageTime ();
		usage.should.to.equal (0);
	});

	it ('should return correct usage time when it is greater than or equal 6 mins but less than 60 mins', function (){
		val.checkinTime = '2017-05-10 6:05:00';
		val.checkoutTime = '2017-05-10 6:25:00';

		var order = new Orders (val);
		var usage = order.getUsageTime ();
		usage.should.to.equal (1);
	});

	it ('should return correct usage time when it is greater than or equal 60 mins', function (){
		val.checkinTime = '2017-05-10 6:05:00';
		val.checkoutTime = '2017-05-10 7:11:00';		
		var order = new Orders (val);
		var usage = order.getUsageTime ();
		usage.should.to.equal (1.1);
	});	

	it ('should return correct subTotal when having no promocode', function (){
		var order = new Orders (val);
		var usage = order.getUsageTime ();
		order.getSubTotal ();
		order.orderline[0].subTotal.should.to.equal (15000 * 1 * usage);
		order.orderline[1].subTotal.should.to.equal (10000 * 2);
		order.orderline[2].subTotal.should.to.equal (10000 * 1);
	});

	it ('should return correct total', function (){
		var order = new Orders (val);
		var usage = order.getUsageTime ();
		order.getSubTotal ();
		order.getTotal ();
		order.total.should.to.equal (15000 * 1 * usage + 10000 * 2 + 10000 *1);
	});

});