var chai = require ('chai');
var should = chai.should ();
var server = require ('../../app');
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes');
var Orders = require ('../../app_api/models/orders');


describe ('Orders', function (){

	describe ('Get usage', function (){
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
	});

	describe ('Normalize usage', function (){

	});

	describe ('Get subtotal', function (){
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

		it ('should return correct subTotal of side products', function (){
			val.orderline.splice (0, 1);
			var order = new Orders (val);
			var expectedSubTotal = [20000, 10000];
			order.getSubTotal ();
			order.orderline.map (function (x, i, arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});
		})

		it ('should return correct subTotal when having no promocode', function (){
			var order = new Orders (val);
			var usage = order.getUsageTime ();
			order.getSubTotal ();
			order.orderline[0].subTotal.should.to.equal (15000 * 1 * usage);
			order.orderline[1].subTotal.should.to.equal (10000 * 2);
			order.orderline[2].subTotal.should.to.equal (10000 * 1);
		});

		it ('should return sub total of service as 0 for members of group private room and subtotal of side products are not zero', function (){
			val.parent = '58eb474538671b4224745192';
			var order = new Orders (val);
			var usage = order.getUsageTime ();
			order.getSubTotal ();
			order.getTotal ();
			order.total.should.to.equal (30000);
			order.orderline[0].subTotal.should.to.equal (0);

		});

		it ('should return correct subtotal given codes YEUGREENSPACE', function (){
			val.orderline[0].promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE'
			}];

			expectedSubTotal = [7500, 20000, 10000];

			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.orderline.map (function (x,i,arr){

				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});

		});

		it ('should return correct subtotal given code STUDENTPRICE', function (){
			val.orderline[0].promocodes = [
				{
					codeType: 2, 
					_id: '58eb474538671b4224745192',
					name: 'STUDENTPRICE'
				},				
			];

			expectedSubTotal = [10000, 20000, 10000];

			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.orderline.map (function (x,i,arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});
		});

		it ('should return correct subtotal given code STUDENTPRICE and YEUGREENSPACE', function (){
			val.orderline[0].promocodes = [
				{
					codeType: 3, 
					_id: '58eb474538671b4224745192',
					name: 'YEUGREENSPACE'
				},					
				{
					codeType: 2, 
					_id: '58eb474538671b4224745192',
					name: 'STUDENTPRICE'
				},						
			];

			expectedSubTotal = [5000, 20000, 10000];

			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.orderline.map (function (x,i,arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});
		});

		it ('should return correct subtotal given code FREE1HOURCOMMON and STUDENTPRICE', function (){
			val.orderline[0].promocodes = [
				{
					codeType: 1, 
					_id: '58eb474538671b4224745192',
					name: 'FREE1HOURCOMMON'
				},					
				{
					codeType: 2, 
					_id: '58eb474538671b4224745192',
					name: 'STUDENTPRICE'
				},						
			];

			val.checkoutTime = '2017-05-10 8:00:00',

			expectedSubTotal = [10000, 20000, 10000];

			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.orderline.map (function (x,i,arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});			
		});

		it ('should return correct subtotal given code FREE2HOURSCOMMON and STUDENTPRICE', function (){
			val.orderline[0].promocodes = [
				{
					codeType: 1, 
					_id: '58eb474538671b4224745192',
					name: 'FREE2HOURSCOMMON'
				},					
				{
					codeType: 2, 
					_id: '58eb474538671b4224745192',
					name: 'STUDENTPRICE'
				},						
			];

			val.checkoutTime = '2017-05-10 9:00:00',

			expectedSubTotal = [10000, 20000, 10000];

			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.orderline.map (function (x,i,arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});	
		})

		it ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and product is Medium Group Private', function (){
			val.orderline[0].promocodes = [
				{
					codeType: 4, 
					_id: '58eb474538671b4224745192',
					name: 'PRIVATEDISCOUNTPRICE'
				},					
			];

			val.orderline[0].productName = 'Medium Group Private';
			val.orderline[0].price = 220000;
			val.checkoutTime = '2017-05-10 9:00:00',

			expectedSubTotal = [620000, 20000, 10000];

			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.orderline.map (function (x,i,arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});	
		});


		it ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and product is Small Group Private regardless customer has code STUDENTPRICE or not', function (){
			val.orderline[0].promocodes = [
				{
					codeType: 4, 
					_id: '58eb474538671b4224745192',
					name: 'PRIVATEDISCOUNTPRICE'
				},
				{
					codeType: 2, 
					_id: '58eb474538671b4224745192',
					name: 'STUDENTPRICE'
				},										
			];

			val.orderline[0].productName = 'Small Group Private';
			val.orderline[0].price = 150000;
			val.checkoutTime = '2017-05-10 9:00:00',

			expectedSubTotal = [390000, 20000, 10000];

			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.orderline.map (function (x,i,arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});	
		});
	});	

	describe ('Get total', function (){
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

		it ('should return correct total', function (){
			var expectedTotal = 45000;
			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.total.should.to.equal (expectedTotal);
		});

		it ('should round up total value', function (){
			val.checkoutTime = '2017-05-10 7:06:00';
			var expectedTotal = 47000;
			var order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			order.total.should.to.equal (expectedTotal);			
		});

		it ('should round down total value', function (){
			// no need
		});

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

});