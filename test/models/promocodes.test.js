var chai = require ('chai');
var should = chai.should ()
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes');

describe ('Promotion Code', function (){

	xdescribe ('Create a promotion code', function (){
		it ('should be invalid when required input is not provided', function (){
			var pc = new Promocodes ();
			pc.validate (function (err){
				expect (err.errors.name).to.exist;
				expect (err.errors.start).to.exist;
				expect (err.errors.end).to.exist;
			});
		});		
	})

	xdescribe ('Read promotion codes', function (){

	});

	xdescribe ('Validate promotion code', function (){
		it ('should be invalid when redeem non-exist promotion code');
		it ('should be invalid when redeem expired promotion code');
	});

	xdescribe ('Check code conflict', function (){

	});

	describe ('Redeem price', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return discount price when usage is more than 1 hour for group private service', function (){
			usage = 3;
			productNames = ['medium group private', 'small group private'];
			prices = [220000, 150000];
			rewardPrices = [200000, 120000];

			productNames.map (function (p, i, arr){
				Promocodes.redeemPrice (null, prices[i], p, usage).should.to.equal (rewardPrices[i])
			});
		});

		it ('should return original price for other products regardless more or less than 1 hour', function (){
			usage = 3;
			productNames = ['group common', 'group common'];
			prices = [220000, 150000];

			productNames.map (function (p, i, arr){
				Promocodes.redeemPrice (null, prices[i], p, usage).should.to.equal (prices[i])
			});
		});

		// it ('should return discount price for student', function (){
		// 	var price = 15000;
		// 	var expectedPrice = [10000, 10000];
		// 	var productNames = ['group common', 'individual common'];
		// 	var code = "STUDENT";
		// 	productNames.map (function (x,i,arr){
		// 		var p = Promocodes.redeemPrice (code, price, x, usage);
		// 		p.should.to.equal (expectedPrice[i]);
		// 	});		
		// });

		// it ('should return original price for non-student', function (){
		// 	var price = 15000;
		// 	var expectedPrice = [10000, 10000];
		// 	var productNames = ['group common', 'individual common'];
		// 	var code = "NONSTUDENT";
		// 	productNames.map (function (x,i,arr){
		// 		var p = Promocodes.redeemPrice (code, price, x, usage);
		// 		p.should.to.not.equal (expectedPrice[i]);
		// 	});		
		// });

	});

	describe ('Redeem total', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return original total when redeem invalid codes', function (){
			var code = 'INVALIDCODE';
			var redeemedTotal = Promocodes.redeemTotal (code, total); 
			redeemedTotal.should.to.equal (total);
		});	

		it ('should return correct total when redeem YEUGREENSPACE', function (){
			var code = 'YEUGREENSPACE';
			var redeemedTotal = Promocodes.redeemTotal (code, total);
			redeemedTotal.should.to.equal (total * 0.5);
		});

	});

	describe ('Redeem usage', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return original usage when redeem invalid codes', function (){
			var code = 'INVALIDCODE';
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage);
		});

		it ('should return correct usage when redeem FREE1HOURCOMMON', function (){
			var code = 'FREE1HOURCOMMON';
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 1);
		});

		it ('should return correct usage when redeem FREE2HOURSCOMMON', function (){
			var code = 'FREE2HOURSCOMMON';
			usage = 3.5;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 2);
		});

		it ('should return correct usage when redeem FREE1HOURCOMMON and usage is less than 1 hour', function (){
			var code = 'FREE1HOURCOMMON';
			usage = 0.2;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);		
		})

		it ('should return correct usage when redeem FREE2HOURSCOMMON and usage is less than 1 hour', function (){
			var code = 'FREE2HOURSCOMMON';
			usage = 0.1;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);
		});			

	});

	describe ('Redeem student account', function (){
		it ('should return student price for group and individual common and when customer is student', function (){
			var codes = ['STUDENT', 'YEUGREENSPACE'];
			var expectedPrice = 10000;
			var productNames = ['group common', 'individual common'];
			var fixedPrice;
			productNames.map (function (p, i, arr){
				fixedPrice = Promocodes.redeemStudentAccount (codes, p);
				fixedPrice.price.should.to.equal (expectedPrice);	
			});
		
		});

		it ('should return original price for other services rather than group and individual common for students', function (){
			var codes = ['STUDENT', 'YEUGREENSPACE'];
			var price = 220000;
			var productNames = ['medium group private', 'small group private'];
			var fixedPrice;
			productNames.map (function (p, i, arr){
				fixedPrice = Promocodes.redeemStudentAccount (codes, p, price);
				fixedPrice.price.should.to.equal (price);	
			});			
		})
	});

});