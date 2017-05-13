var chai = require ('chai');
var should = chai.should ();
var server = require ('../../app');
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes');
var Orders = require ('../../app_api/models/orders');


describe ('Orders', function (){

	xdescribe ('Get usage', function (){
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

	xdescribe ('Normalize usage', function (){

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

		xit ('should return correct subTotal of side products', function (){
			val.orderline.splice (0, 1);
			var order = new Orders (val);
			var expectedSubTotal = [20000, 10000];
			order.getSubTotal ();
			order.orderline.map (function (x, i, arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});
		})

		xit ('should return correct subTotal when having no promocode', function (){
			var order = new Orders (val);
			var usage = order.getUsageTime ();
			order.getSubTotal ();
			order.orderline[0].subTotal.should.to.equal (15000 * 1 * usage);
			order.orderline[1].subTotal.should.to.equal (10000 * 2);
			order.orderline[2].subTotal.should.to.equal (10000 * 1);
		});

		xit ('should return sub total of service as 0 for members of group private room and subtotal of side products are not zero', function (){
			val.parent = '58eb474538671b4224745192';
			var order = new Orders (val);
			var usage = order.getUsageTime ();
			order.getSubTotal ();
			order.getTotal ();
			order.total.should.to.equal (30000);
			order.orderline[0].subTotal.should.to.equal (0);

		});

		xit ('should return correct subtotal given codes YEUGREENSPACE', function (){
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

		xit ('should return correct subtotal given code STUDENTPRICE', function (){
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

		it ('should return correct subtotal given code STUDENTPRICE', function (){
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

		it ('should return correct subtotal given code FREE1HOURCOMMON and STUDENTPRICE')
		it ('should return correct subtotal given code FREE2HOURSCOMMON and STUDENTPRICE')
		it ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and STUDENTPRICE')


	});	

	xdescribe ('Get total', function (){
		it ('should return correct total');
		it ('should round total values like 500, 1500, and 1300 to 1000, 2000, and 1000')
	});


	xit ('should be invalid when required input is not provided', function (done){
		order = new Orders ({});
		order.validate (function (err){
			err.errors['customer.id'].should.to.exist;
			err.errors.storeId.should.to.exist;
			err.errors.staff.should.to.exist;
		});

		done ();
	});

	xit ('should be invalid when total < 0', function (done){
		var val = {
			total: -100,
		}

		var order = new Orders (val);
		order.validate (function (err){
			err.errors.total.should.to.exist;
			done ();
		});
	});

	xit ('should be valid when total > 0', function (done){
		var val = {
			total: 100,
		}

		var order = new Orders (val);
		order.validate (function (err){
			err.errors.should.to.not.have.property ('total');
			done ();
		});
	});	

	xit ('should return correct total when having no promocode', function (){
		var order = new Orders (val);
		var usage = order.getUsageTime ();
		order.getSubTotal ();
		order.getTotal ();
		order.total.should.to.equal (15000 * 1 * usage + 10000 * 2 + 10000 *1);
	});

	xit ('should return correct total when having code FREE1HOURCOMMON and code STUDENT', function (){
		val.orderline[0].promocodes = [{_id: '58eb474538671b4224745192', name: 'FREE1HOURCOMMON'}, {_id: '58eb474538671b4224745192', name: 'STUDENT'}];

		var order = new Orders (val);
		var usage = order.getUsageTime ();
		var expectedSubTotal = [0, 20000, 10000];
		var expectedTotal = 30000;

		order.getSubTotal ();
		order.getTotal ();
		order.total.should.to.equal (expectedTotal);
		order.orderline.map (function (x, i, arr){
			x.subTotal.should.to.equal (expectedSubTotal[i]);
		});	
	});

	xit ('should return correct total when having code FREE2HOURSCOMMON and code STUDENT', function (){
		val.orderline[0].promocodes = [{_id: '58eb474538671b4224745192', name: 'FREE2HOURSCOMMON'}, {_id: '58eb474538671b4224745192', name: 'STUDENT'}];

		val.checkoutTime = '2017-05-10 10:00:00';

		var order = new Orders (val);
		var usage = order.getUsageTime ();
		var expectedSubTotal = [20000, 20000, 10000];
		var expectedTotal = 50000;

		order.getSubTotal ();
		order.getTotal ();
		order.total.should.to.equal (expectedTotal);
		order.orderline.map (function (x, i, arr){
			x.subTotal.should.to.equal (expectedSubTotal[i]);
		});			
	})

	xit ('should return correct total when usage is more than 1 hour, and service is medium group private', function (){
		val.orderline[0] = { productName : "Medium Group Private", _id : "58ff58e6e53ef40f4dd664cd", quantity : 1, price: 220000 };
		val.usage = 4;
		var order = new Orders (val);
		var usage = order.getUsageTime ();
		var expectedSubTotal = [820000, 20000, 10000];
		var expectedTotal = 850000;

		order.getSubTotal ();
		order.getTotal ();
		order.total.should.to.equal (expectedTotal);
		order.orderline.map (function (x, i, arr){
			x.subTotal.should.to.equal (expectedSubTotal[i]);
		});			

	});

	it ('should return correct total when having code STUDENT, usage is more than 1 hour, and service is small group private');

});