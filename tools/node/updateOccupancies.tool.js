process.env.NODE_ENV = 'analysis';

var server = require ('../../bin/www');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Occupancy = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');
var fastcsv = require ('fast-csv');
var request = require ('request');
var async = require ('async');

module.exports = new UpdateOccupancies ();

function UpdateOccupancies (){
	this.update = function (occ){
		var newOcc = new Occupancy (occ);
		newOcc.save (function (err, savedOcc){
			if (err){
				console.log (err);
				return;
			}

			if (savedOcc.paymentMethod && savedOcc.paymentMethod.length){
				console.log (savedOcc._id, savedOcc.paymentMethod[0].amount, savedOcc.paymentMethod[0].paidAmount, savedOcc.paymentMethod[0].paidTotal, savedOcc.paid)
			}
			else{
				console.log (savedOcc._id, savedOcc.paid)
			}		

		});
	}

	this.updatePrivateTotal = function (){
		Occupancy.find ({'service.name': /small|medium|large/i, $where: '!this.parent'}, function (err, foundOcc){
			if (err){
				console.log (err);
				return
			}

			function _addCodes (occ){
				if (occ.customer.fullname == 'NHỮ VÂN ANH'){
					code = {"name" : "PRIVATE_VIP_NHUVANANH", "codeType" : 3, "priority" : 2, "services" : [ "small group private" ], "redeemData" : { "total" : { "formula" : 2, value: 0.5 }}};	
					occ.promocodes = [code];	
				}
				else if (occ.customer.fullname == 'NGUYỄN THỊ BÍCH NGỌC'){
					code = {"name" : "PRIVATE_VIP", "codeType" : 3, "priority" : 2, "services" : [ "small group private" ], "redeemData" : { "total" : { "formula" : 5 }, "price" : { "value" : 75000 }, "usage" : { "max" : 2 } }};

					if (occ._id == '59448d5054261e3113b225db'){
						code.redeemData.usage.max = 3;
					}
					else if (occ._id == '59490da154261e3113b2280a'){
						code.redeemData.usage.max = 2.25;
					}
					else if (occ._id == '594bb0c1bcc02c563ba12282'){
						code.redeemData.usage.max = 2.25;
					}
					else if (occ._id == '594f1985529d7064c7b0684d'){
						code.redeemData.usage.max = 3.08;
					}					
					else if (occ._id == '594f54cebbbc9e12073d03f6'){
						code.redeemData.usage.max = 2.75;
					}	
					else if (occ._id == '5952473ec16d4a5da3085d36'){
						code.redeemData.usage.max = 2.33;
					}
					else if (occ._id == '59563db41e764475ca61b211'){
						code.redeemData.usage.max = 2.58;
					}						
					else if (occ._id == "595852eec482b80f7a17f5a1"){
						code.redeemData.usage.max = 3.17;
					}
					else if (occ._id == "59588d83c482b80f7a17f5a8"){
						code.redeemData.usage.max = 2.75;
					}					
					occ.promocodes = [code];

				}
				else if (occ.customer.fullname == 'TRẦN TUỆ TRUNG'){
					occ.promocodes = [
						{ "_id" : "5954dac5fdb8bc9ec2cddad9", "name" : "PRIVATE_VIP_TRANTUETRUNG", "codeType" : 3, "priority" : 2, "services" : [ "medium group private" ], "redeemData" : { "total" : { "formula" : 5 }, "price" : { "value" : 100000 }, "usage" : { "max" : 2.75 } } }
					]
				}
				else if (occ.customer.fullname == 'DOÃN DUY LINH'){
					occ.promocodes = [
						{"_id": "5958b7c6abd855db9f59c0d0", "name" : "PRIVATE_VIP_DOANDUYLINH", "codeType" : 3, "priority" : 2, "services" : [ "medium group private" ], "redeemData" : { "total" : { "formula" : 5 }, "price" : { "value" : 110000 }, "usage" : { "max" : 2 } } }
					]
				}								
			}

			function _updateTotal (occ){
				newOcc = new Occupancy (occ);
				newOcc.getTotal ();
				newOcc.status = 2;


				newOcc.save (function (err, savedOcc){
					if (err){
						console.log (err);
						return
					}

					console.log (savedOcc._id, savedOcc.customer.fullname, savedOcc.usage, savedOcc.total)
				})

			}

			targetOcc = foundOcc.filter (function (x, i, arr){
				var targetCustomers = []
				// return ['NHỮ VÂN ANH', 'NGUYỄN THỊ BÍCH NGỌC', 'TRẦN TUỆ TRUNG', 'DOÃN DUY LINH'].indexOf (x.customer.fullname) != -1
				return ['NHỮ VÂN ANH'].indexOf (x.customer.fullname) != -1
			});

			targetOcc.map (function (x, i, arr){
				_addCodes (x);
			});

			async.map (targetOcc, _updateTotal, function (err, result){
				// console.log (result)
			});		

		});
	}

	this.updatePaid = function (){
		var uocc = this;
		var _updatePaid = function (occ){
			db.Occupancy.update ({_id: occ._id}, {$set: {paid: occ.paid}}, function (err, updatedOcc){
				if (err){
					console.log (err);
					return
				}

			});
		}

		Occupancy.find ({'service.name': /common/i}, function (err, foundedOcc){
			if (err){
				console.log (err);
				return;
			}

			foundedOcc.map (function (x, i, arr){
				if (x.paymentMethod && x.paymentMethod.length){
					newAcc = new Accounts ();

					beforeTotal = x.total;
					var context = occ.getAccContext ();
					updatedAcc.withdraw (context);	

					x.getTotal ();
					beforeTotal = x.total;
					paid = beforeTotal - afterTotal;
				}
				else {
					x.paid = x.total;
				}
			});

			// async.map (foundedOcc, uocc.update, function (err, result){
			// 	// console.log (result)
			// });					

		});
	}

	this.updateAccount = function (){
		var uocc = this;
		function _updatePaid (occ){
			var newOcc = new Occupancy (occ);
			newOcc.save (function (err, result){
				if (err){
					console.log (err);
					return;
				}


			});
		}

		Occupancy.find ({}, function (err, foundedOcc){
			if (err){
				console.log (err);
				return;
			}

			foundedOcc.map (function (x, i, arr){
				if (x.paymentMethod && x.paymentMethod.length && x.paymentMethod[0].name == 'account'){
					if (x.paymentMethod[0].amount){
						x.paymentMethod[0].paidAmount = x.paymentMethod[0].amount;
					}

					if (!x.paymentMethod[0].paidTotal){
						// 
						
					}
				}


			});

			async.map (foundedOcc, uocc.update, function (err, result){
				// console.log (result)
			});	

		});
	}
}


var updator = new UpdateOccupancies ();
// updator.updatePrivateTotal ();
// updator.updateAccount ()
updator.updatePaid ();