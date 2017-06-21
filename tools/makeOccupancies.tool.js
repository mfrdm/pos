var server = require ('../bin/www');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Occupancy = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');
var fastcsv = require ('fast-csv');
var request = require ('request');
var async = require ('async');

module.exports = new MakeOccupancies ();

function MakeOccupancies (){
	// data is an array of array
	this.model = function (data){
		var result = [];

		data.map (function (x, i, arr){
			result.push ({
				customer: {
					_id: x[12],
					fullname: x[2],
					email: x[4],
					phone: x[5],
					isStudent: x[13]
				},
				service:{
					name: x[6],
					price: x[14]
				},
				promocode: x[7],
				checkinTime: x[8],
				checkoutTime: x[9],
				note: x[11],
				createdAt: x[8]
			})
		});

		return result;
	}

	this.addCode = function (data){
		var studentprice = { 
			"redeemData" : { "price" : { "value" : 10000 } }, 
			"priority" : 1, 
			"codeType" : 2, 
			"name" : "studentprice"
		}

		var FSC_01H_052017 = { 
			"redeemData" : { "usage" : { "value" : 1, "formula" : "1" } }, 
			"priority" : 2, 
			"codeType" : 1, 
			"name" : "FSC_01H_052017"
		};

		var FSC_02H_052017 = { 
			"redeemData" : { "usage" : { "value" : 2, "formula" : "1" } }, 
			"priority" : 2, 
			"codeType" : 1, 
			"name" : "FSC_02H_052017"
		};

		var GS5 = { 
			"redeemData" : { "usage" : { "value" : 1, "formula" : "1" } }, 
			"priority" : 2, 
			"codeType" : 1, 
			"name" : "GS5"
		};		

		var WEDNESDAY_01h_052017 = { 
			"redeemData" : { "usage" : { "value" : 1, "formula" : "1" } }, 
			"priority" : 2, 
			"codeType" : 1, 
			"name" : "WEDNESDAY_01h_052017"
		};

		var MARKETING_01h_052017 = { 
			"redeemData" : { "usage" : { "value" : 1, "formula" : "1" } }, 
			"priority" : 2, 
			"codeType" : 1, 
			"name" : "MARKETING_01h_052017"
		};	

		var codes = {
			MARKETING_01h_052017: MARKETING_01h_052017,
			WEDNESDAY_01h_052017: WEDNESDAY_01h_052017,
			GS5: GS5,
			FSC_02H_052017: FSC_02H_052017,
			FSC_01H_052017: FSC_01H_052017,
			studentprice: studentprice
		}


		data.map (function (x, i, arr){
			x.promocodes = [];

			if (codes[x.promocode]){
				x.promocodes.push (codes[x.promocode]);
			}

			if (x.customer.isStudent){
				x.promocodes.push (codes['studentprice']);
			}
			
		})	

		return data
	}

	this.insert = function (data){
		var host = process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test' ? process.env.LOCAL_HOST : process.env.REMOTE_HOST;

		request ({
			url: host + 'checkout/create-occupancy',
			method: 'POST',
			json: true,
			body: {data: data}

		}, function (err, res, body){
			if (err){
				console.log (err);
			}

			// console.log (body)
		})
	}

}

var fpath = 'data/20170507_20170523/fixed_occupancies.csv';
var occList = [];
fastcsv.fromPath (fpath)
	.on ('data', function (data){
		occList.push (data);
	})
	.on ('end', function (){

		var maker = new MakeOccupancies ();
		var occ = maker.model (occList.slice (1));
		occ = maker.addCode (occ);

		async.map (occ, maker.insert, function (err, result){
			// console.log (result)
		})
	})
