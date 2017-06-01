process.env.NODE_ENV = 'test';	
var chai = require ('chai');
var should = chai.should ();
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

	// Later
	xdescribe ('Read promotion codes', function (){

	});

	// Later
	xdescribe ('Validate promotion code', function (){
		it ('should be invalid when redeem non-exist promotion code');
		it ('should be invalid when redeem expired promotion code');
	});

	// Later
	xdescribe ('Check code', function (){

	});

	xdescribe ('Redeem mixed', function (){

		it ('should return discount price when usage is more than 1 hour for group private service', function (){
			var prices = [220000, 150000];
			var usage = 3.5;
			var code = 'PRIVATEDISCOUNTPRICE';
			var expectedTotal = [220000 + 200000 * 2.5, 150000 + 120000 * 2.5];
			var productNames = ['Medium Group Private', 'Small Group Private'];
			productNames.map (function (x, i, arr){
				var price = prices[i];
				var total = Promocodes.redeemMixed (code, usage, price, x);
				total.should.to.equal (expectedTotal[i]);
			});
			
		});

		it ('should return 0 total with code FREE1DAYCOMMON', function (){
			var prices = [10000, 10000];
			var usage = 3.5;
			var code = 'FREE1DAYCOMMON';
			var expectedTotal = [0,0];
			var productNames = ['Individual common', 'Group common'];
			productNames.map (function (x, i, arr){
				var price = prices[i];
				var total = Promocodes.redeemMixed (code, usage, price, x);
				total.should.to.equal (expectedTotal[i]);
			});
		});

		it ('should return 50% total with PRIVATEHAFTTOTAL', function (){
			var prices = [150000, 220000, 500000];
			var usage = 3.5;
			var code = 'PRIVATEHALFTOTAL';
			var expectedTotal = [prices[0] * usage * 0.5, prices[1] * usage * 0.5, prices[2] * usage * 0.5];
			var productNames = ['Small group private', 'Medium group private', 'Large group private'];
			productNames.map (function (x, i, arr){
				var price = prices[i];
				var total = Promocodes.redeemMixed (code, usage, price, x);
				total.should.to.equal (expectedTotal[i]);
			});
		});

	});

	xdescribe ('Redeem price', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return discount price for student using common services', function (){
			var price = 15000;
			var expectedPrice = [10000, 10000];
			var productNames = ['Group Common', 'Individual Common'];
			var code = "STUDENTPRICE";
			productNames.map (function (x,i,arr){
				var p = Promocodes.redeemPrice (code, price, x, usage);
				p.should.to.equal (expectedPrice[i]);
			});		
		});

		it ('should return original price for student using private services regardless having code STUDENTPRICE', function (){
			var prices = [220000, 150000];
			var expectedPrice = prices;
			var productNames = ['Medium Group Private', 'Small Group Private'];
			var code = "STUDENTPRICE";
			productNames.map (function (x,i,arr){
				var p = Promocodes.redeemPrice (code, prices[i], x, usage);
				p.should.to.equal (expectedPrice[i]);
			});		
		});

		it ('should return original price for non-student', function (){
			var price = 15000;
			var unExpectedPrice = [10000, 10000];
			var productNames = ['Group Common', 'Individual Common'];
			var code = "INVALIDCODE";
			productNames.map (function (x,i,arr){
				var p = Promocodes.redeemPrice (code, price, x, usage);
				p.should.to.not.equal (unExpectedPrice[i]);
			});		
		});

	});

	xdescribe ('Redeem total', function (){
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

	xdescribe ('Redeem usage', function (){
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

		it ('should return correct usage when redeem V01H06', function (){
			var code = 'V01H06';
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 1);
		});

		it ('should return correct usage when redeem V02H06', function (){
			var code = 'V02H06';
			usage = 3.5;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 2);
		});

		it ('should return correct usage when redeem V01H06 and usage is less than 1 hour', function (){
			var code = 'V01H06';
			usage = 0.2;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);		
		})

		it ('should return correct usage when redeem V02H06 and usage is less than 1 hour', function (){
			var code = 'V02H06';
			usage = 0.1;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);
		});			

	});

	describe ('Resolve code conflict', function (){
		var codes;
		beforeEach (function (){
			codes = [
				{name: 'code 1', codeType: 1, priority: 1},
				{name: 'code 2', codeType: 1, priority: 2},
				{name: 'code 3', codeType: 2, priority: 1},
				{name: 'code 4', codeType: 2, priority: 2},

			];
		})

		it ('should has no more than one code of the same type', function (){
			Promocodes.resolveConflict (codes);
			codes.should.have.lengthOf (2);
			codes[0].codeType.should.to.not.equal (codes[1].codeType);			
		})

		it ('should remove codes of the same type but lower priority', function (){
			Promocodes.resolveConflict (codes);
			codes.should.have.lengthOf (2);
			codes.map (function (x, i, arr){
				['code 2', 'code 4'].should.include (x.name)
			});
		})

		it ('should do anything with codes of different types', function (){
			codes = [
				{name: 'code 1', codeType: 1, priority: 1},
				{name: 'code 2', codeType: 2, priority: 2},
			];

			Promocodes.resolveConflict (codes);
			codes.should.have.lengthOf (2);

		});

		it ('should return error when dealing with code of the same types and same priority', function (){
			codes = [
				{name: 'code 1', codeType: 1, priority: 2},
				{name: 'code 2', codeType: 1, priority: 2},
			];
			
			try{
				Promocodes.resolveConflict (codes);
				false.should.equal (true);
			}	
			catch (err){
				false.should.equal (false);

			}
			
		})
	});

});