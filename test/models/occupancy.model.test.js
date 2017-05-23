var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes');
var Occupancy = require ('../../app_api/models/occupancy.model');

describe ('Occupancy Model', function (){
	xdescribe ('Get usage in hour', function (){
		var order, val;
		beforeEach (function (){
			val = {
				checkinTime: '2017-05-10 6:00:00',
				checkoutTime: '2017-05-10 7:00:00',		
			}
		});

		it ('should return correct usage time when it is below 6 mins', function (){
			val.checkinTime = '2017-05-10 6:05:00';
			val.checkoutTime = '2017-05-10 6:08:00';

			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (0);
		});

		it ('should return correct usage time when it is greater than or equal 6 mins but less than 60 mins', function (){
			val.checkinTime = '2017-05-10 6:05:00';
			val.checkoutTime = '2017-05-10 6:25:00';

			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (1);
		});

		it ('should return correct usage time when it is greater than or equal 60 mins', function (){
			val.checkinTime = '2017-05-10 6:05:00';
			val.checkoutTime = '2017-05-10 7:11:00';		
			var occ = new Occupancy (val);
			var usage = occ.getUsageTime ();
			usage.should.to.equal (1.1);
		});	
	});

	xdescribe ('Get total', function (){
		var order, val;
		beforeEach (function (){
			val = {
				checkinTime: '2017-05-10 6:00:00',
				checkoutTime: '2017-05-10 7:00:00',
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

		xit ('should return correct subtotal given codes YEUGREENSPACE', function (){
			val.promocodes = [{
				codeType: 3, 
				_id: '58eb474538671b4224745192',
				name: 'YEUGREENSPACE'
			}];

			expectedTotal = 8000;

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

		xit ('should return correct subtotal given code FREE1HOURCOMMON and STUDENTPRICE', function (){
			val.promocodes = [
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

			expectedTotal = 10000;

			var occ = new Occupancy (val);
			occ.getTotal ();
			occ.total.should.to.equal (expectedTotal);		
		});

		xit ('should return correct subtotal given code FREE2HOURSCOMMON and STUDENTPRICE', function (){
			val.promocodes = [
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

			val.checkinTime = '2017-05-10 10:31:00',
			val.checkoutTime = '2017-05-10 13:43:00',

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


		it ('should return correct subtotal given code PRIVATEDISCOUNTPRICE and product is Small Group Private regardless customer has code STUDENTPRICE or not', function (){
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
			console.log (occ)
			occ.total.should.to.equal (expectedTotal);
		});

		it ('should return correct total after redeem usage. Apply new usage as if it was the original')
	});

})