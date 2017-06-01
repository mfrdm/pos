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
				// checkinTime: '2017-05-10 6:00:00',
				// checkoutTime: '2017-05-10 7:00:00',		
				checkinTime: moment ().add (-1, 'hour'),
				checkoutTime: moment (),					
			}
		});

		xit ('should return correct usage time when it is below 6 mins', function (){
			val.checkinTime = moment ().add (-3, 'minute');
			val.checkoutTime = moment ();

			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (0);
		});

		xit ('should return correct usage hour as 1 when it is greater than or equal 6 mins but less than 60 mins', function (){
			val.checkinTime = moment ().add (-20, 'minute');
			val.checkoutTime = moment ();

			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (1);
		});

		xit ('should return correct usage time when it is greater than or equal 60 mins', function (){
			val.checkinTime = moment ().add (-6, 'minute');
			val.checkoutTime = moment ();		
			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (1.1);
		});	
	});

	describe ('Get total', function (){
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

		xit ('should return total of service as 0 for members, not leader, using group private room', function (){
			val.parent = '58eb474538671b4224745192';
			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (0);

		});

		xit ('should return correct total given codes YEUGREENSPACE when using common service', function (){
			val.promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE'
			}];

			expectedTotal = 26000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);

		});

		xit ('should return correct total given codes YEUGREENSPACE when using private service', function (){
			val.promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE'
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

		xit ('should return correct subtotal given code STUDENTPRICE', function (){
			val.promocodes = [
				{
					codeType: 2, 
					_id: '58eb474538671b4224745192',
					name: 'STUDENTPRICE'
				},				
			];

			expectedTotal = 10000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);
		});

		xit ('should return correct subtotal given code STUDENTPRICE and YEUGREENSPACE', function (){
			val.promocodes = [
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

			expectedTotal = 5000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);
		});

		xit ('should return correct subtotal given code v01h06 and STUDENTPRICE', function (){
			val.promocodes = [
				{
					codeType: 1, 
					_id: '58eb474538671b4224745192',
					name: 'v01h06'
				},										
			];

			val.checkoutTime = moment ().add (-1.5, 'hour');

			expectedTotal = 10000;

			var occ = new Occupancy (val);

			occ.getTotal ();
			occ.promocodes.should.to.have.length.of.at.least (1);
			occ.total.should.to.equal (expectedTotal);		
		});

		xit ('should return correct subtotal given code v02h06 and STUDENTPRICE', function (){
			val.promocodes = [
				{
					codeType: 1, 
					_id: '58eb474538671b4224745192',
					name: 'v02h06'
				},										
			];

			val.checkinTime = moment ().add (-3.2, 'hour');
			val.checkoutTime = moment ();

			expectedTotal = 12000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);
		})

		xit ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and product is Medium Group Private', function (){
			val.promocodes = [
				{
					codeType: 4, 
					_id: '58eb474538671b4224745192',
					name: 'PRIVATEDISCOUNTPRICE'
				},					
			];

			val.service = {
				name: 'Medium Group Private',
				price: 220000,
			}

			val.checkoutTime = '2017-05-10 9:00:00',

			expectedTotal = 620000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);

		});


		xit ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and product is Small Group Private regardless customer has code STUDENTPRICE or not', function (){
			val.promocodes = [
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

			val.service = {
				name: 'Small Group Private',
				price: 150000,
			}

			val.checkinTime = '2017-05-10 7:03:00'
			val.checkoutTime = '2017-05-10 14:55:00',

			expectedTotal = 978000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);
		});

		xit ('should return correct total given code FREE1DAYCOMMON', function (){
			val.promocodes = [
				{
					codeType: 4, 
					_id: '58eb474538671b4224745192',
					name: 'FREE1DAYCOMMON'
				},
				{
					codeType: 2, 
					_id: '58eb474538671b4224745192',
					name: 'STUDENTPRICE'
				},										
			];

			var expectedTotal = 0;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);
		})

		xit ('should return correct total given code PRIVATEHALFTOTAL and ignore PRIVATEDISCOUNTPRICE', function (){
			val.promocodes = [
				{
					codeType: 4, 
					_id: '58eb474538671b4224745192',
					name: 'PRIVATEHALFTOTAL'
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