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

	describe ('Redeem codes', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return original usage when redeem invalid codes', function (){
			var code = [{name: 'INVALIDCODE'}];
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage);
		});

		it ('should return original total when redeem invalid codes', function (){
			var code = [{name: 'INVALIDCODE'}];
			var redeemedTotal = Promocodes.redeemPrice (code, total);
			redeemedTotal.should.to.equal (total);
		});	

		it ('should return correct total when redeem YEUGREENSPACE', function (){
			var code = [{name: 'YEUGREENSPACE'}];
			var redeemedTotal = Promocodes.redeemPrice (code, total);
			redeemedTotal.should.to.equal (total * 0.5);
		});

		it ('should return correct total when redeem STUDENT for group common and individual common', function (){
			var code = [{name: 'STUDENT'}];
			var productName = 'Individual Common';
			var redeemedTotal = Promocodes.redeemPrice (code, total, productName);
			redeemedTotal.should.to.equal (total * 2 / 3);		
		});	

		it ('should not redeem STUDENT for group private', function (){
			var code = [{name: 'STUDENT'}];
			var productName = 'medium group private';
			var redeemedTotal = Promocodes.redeemPrice (code, total, productName);
			redeemedTotal.should.to.equal (total);		
		});			

		it ('should return correct usage when redeem FREE1HOURCOMMON', function (){
			var code = [{name: 'FREE1HOURCOMMON'}];
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 1);
		});

		it ('should return correct usage when redeem FREE2HOURSCOMMON', function (){
			var code = [{name: 'FREE2HOURSCOMMON'}];
			usage = 3.5;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 2);
		});	

		it ('should return correct usage when redeem FREE1HOURCOMMON and usage is less than 1 hour', function (){
			var code = [{name: 'FREE1HOURCOMMON'}];
			usage = 0.2;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);		
		})

		it ('should return correct usage when redeem FREE2HOURSCOMMON and usage is less than 1 hour', function (){
			var code = [{name: 'FREE2HOURSCOMMON'}];
			usage = 0.1;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);
		});

	});

});