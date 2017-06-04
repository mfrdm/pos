process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes');
var Occupancy = require ('../../app_api/models/occupancy.model');
var moment = require ('moment');


describe ('Occupancy Model', function (){
	describe ('Get usage in hour', function (){
		var order, val;
		beforeEach (function (){
			val = {		
				checkinTime: moment ().add (-1, 'hour'),
				checkoutTime: moment (),					
			}
		});

		it ('should return correct usage time when it is below 6 mins', function (){
			val.checkinTime = moment ().add (-3, 'minute');
			val.checkoutTime = moment ();

			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (0);
		});

		it ('should return correct usage hour as 1 when it is greater than or equal 6 mins but less than 60 mins', function (){
			val.checkinTime = moment ().add (-30, 'minute');
			val.checkoutTime = moment ();

			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (1);
		});

		it ('should return correct usage time when it is greater than or equal 60 mins', function (){
			val.checkinTime = moment ().add (-66, 'minute');
			val.checkoutTime = moment ();		
			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (1.1);
		});	
	});

	describe ('Get after pre paid total', function (){
		it ('should return ')
	});

	xdescribe ('Get total', function (){
		var order, val;
		beforeEach (function (){
			val = {
				checkinTime: moment().add (-3.5, 'hour'),
				checkoutTime: moment(),
				customer: {
					isStudent: false, // NOTICE
				},
				service: {
					name: 'Group Common',
					price: 15000
				}
			}
		});		

		it ('should return total of service as 0 for members, not leader, using group private room', function (){
			val.parent = '58eb474538671b4224745192';
			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (0);

		});

		it ('should return correct total given codes YEUGREENSPACE when using common service', function (){
			val.promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE',
				priority: 2,
			}];

			expectedTotal = 26000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);

		});

		it ('should return correct total given codes YEUGREENSPACE when using common service and customer is student', function (){
			val.promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE',
				priority: 2,
			}];

			val.customer.isStudent = true;

			expectedTotal = 18000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);

		})

		it ('should return correct total given codes YEUGREENSPACE when using private service', function (){
			val.promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE',
				priority: 2,
			}];

			val.service = {
				name: 'Small group private',
				price: 150000
			}

			expectedTotal = 263000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);

		});

		it ('should return correct total given codes YEUGREENSPACE when using private service and customer is a student', function (){
			val.promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE',
				priority: 2,
			}];

			val.customer.isStudent = true;

			val.service = {
				name: 'Small group private',
				price: 150000
			}

			expectedTotal = 263000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);

		});		

		it ('should return correct subtotal given code STUDENTPRICE', function (){
			val.customer.isStudent = true;

			expectedTotal = 35000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);
		});

		it ('should return correct subtotal given code v01h06 and STUDENTPRICE', function (){
			val.customer.isStudent = true;
			val.promocodes = [
				{
					codeType: 1, 
					_id: '58eb474538671b4224745192',
					name: 'v01h06',
					priority: 2,
				},										
			];

			val.checkoutTime = moment ();
			val.checkinTime = moment ().add (-1.5, 'hour');

			expectedTotal = 5000;

			var occ = new Occupancy (val);

			occ.getTotal ();
			occ.promocodes.should.to.have.length.of.at.least (2);
			occ.total.should.to.equal (expectedTotal);		
		});

		it ('should return correct subtotal given code v02h06 and STUDENTPRICE', function (){
			val.customer.isStudent = true;
			val.promocodes = [
				{
					codeType: 1, 
					_id: '58eb474538671b4224745192',
					name: 'v02h06',
					priority: 2,
				},										
			];

			val.checkinTime = moment ().add (-3.2, 'hour');
			val.checkoutTime = moment ();

			expectedTotal = 12000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.promocodes.should.to.have.length.of.at.least (2);
			occ.total.should.to.equal (expectedTotal);
		})

		it ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and product is Medium Group Private', function (){

			val.service = {
				name: 'Medium Group Private',
				price: 220000,
			}
			val.checkinTime = moment ().add (-3.2, 'hour');
			val.checkoutTime = moment ();

			expectedTotal = 660000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.promocodes.should.to.have.length.of.at.least (1);
			occ.total.should.to.equal (expectedTotal);

		});

		it ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and product is Small Group Private, regardless customer is a student', function (){

			val.customer.isStudent = true;
			val.service = {
				name: 'Small Group Private',
				price: 150000,
			}

			val.checkinTime = moment ().add (-3.2, 'hour');
			val.checkoutTime = moment ();

			expectedTotal = 414000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.promocodes.should.to.have.length.of.at.least (1);
			occ.promocodes.map (function (x, i, arr){
				x.name.should.to.not.equal ('studentprice');
			})

			occ.total.should.to.equal (expectedTotal);
		});

		it ('should return correct total given code FREE1DAYCOMMON when using common service and customer is a student', function (){
			val.promocodes = [
				{
					codeType: 4, 
					_id: '58eb474538671b4224745192',
					name: 'FREE1DAYCOMMON',
					priority: 3
				},									
			];

			var expectedTotal = 0;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.promocodes.should.to.have.length.of.at.least (1);
			occ.promocodes.map (function (x, i, arr){
				x.name.should.to.not.equal ('studentprice');
			})	
			occ.total.should.to.equal (expectedTotal);
		})

		it ('should return correct total given code PRIVATEHALFTOTAL and ignore PRIVATEDISCOUNTPRICE', function (){
			val.promocodes = [
				{
					codeType: 4, 
					_id: '58eb474538671b4224745192',
					name: 'PRIVATEHALFTOTAL',
					priority: 3
				},										
			];

			val.service = {
				name: 'Small group private',
				price: 150000,
			}

			var expectedUsage = 3.5;
			var expectedTotal = 263000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);
		});

	});

	xdescribe ('Add default codes', function (){
		var occ;
		beforeEach (function (){
			occ = {
				service: {
					name: 'Group Common'
				},
				promocodes: [],
				customer: {
					isStudent: true,
				},
				usage: 3.2,
			}
		})

		it ('should add code studentprice, but not privatediscountprice, when a user is a student and using common service', function (){
			var pdp = 0;
			var sp = 0;

			var newOcc = new Occupancy (occ);

			newOcc.addDefaultCodes ();
			newOcc.promocodes.should.to.have.property ('length');
			newOcc.promocodes.should.have.length.of.at.least (1);
			newOcc.promocodes.map (function (x, i, arr){
				if (x.name == 'privatediscountprice' && x.codeType == 4){
					pdp ++;
				}
				if (x.name == 'studentprice' && x.codeType == 2){
					sp ++;
				}
			});

			pdp.should.to.equal (0);
			sp.should.to.equal (1);	
		});

		it ('should add code privatediscountprice, but not studentprice when using group private service and usage is more than 1 hour', function (){
			var pdp = 0;
			var sp = 0;
			occ.service.name = 'Medium group private';

			var newOcc = new Occupancy (occ);

			newOcc.addDefaultCodes ();
			newOcc.promocodes.should.to.have.property ('length');
			newOcc.promocodes.should.have.length.of.at.least (1);
			newOcc.promocodes.map (function (x, i, arr){
				if (x.name == 'privatediscountprice' && x.codeType == 4){
					pdp ++;
				}
				if (x.name == 'studentprice' && x.codeType == 2){
					sp ++;
				}				
			});

			pdp.should.to.equal (1);
			sp.should.to.equal (0);		
		})
	});

})