var mongoose = require('mongoose');
var Promocodes = mongoose.model('Promocodes');
var moment = require ('moment')

module.exports = new PromocodeCtrl ();

function PromocodeCtrl (){
	this.createOne = function (req, res, next){
		var start = req.query.start ? moment (req.query.start) : moment().hour(0).minute(0);
		var end = req.query.end ? moment (req.query.end).hour(23).minute(59) : 
		    moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);				
		var total = req.query.total;
		var maxUsage = req.query.maxUsage;
		var customerName = req.query.customerName;
		var service = req.query.service.split ('/');

		service = service.map (function (x, i, arr){
			if (x.toLowerCase ().indexOf ('small') != -1){
				return 'small group private'
			}
			else if (x.toLowerCase ().indexOf ('medium') != -1){
				return 'medium group private'
			}
			else if (x.toLowerCase ().indexOf ('large') != -1){
				return 'large group private'
			}			
		});

		var label = {
			vn: 'Private - Giá VIP - ' + customerName.toUpperCase (),
		}

		var code = {
			name: 'PRIVATE_VIP_' + customerName.toUpperCase ().split (' ').join (''),
			start: start,
			end: end,
			desc: '', 
			codeType: 3, // default
			excluded: false,
			label: label,
			priority : 2,
			services: service,
			redeemData: {
				total: {
					formula: 6,
					min: total,
				},
				usage: {
					max: maxUsage
				}
			}
		}

		var newCode = new Promocodes (code);
		newCode.save (function (err, code){
			if (err){
				next (err);
				return;
			}
			res.sendStatus (200);
		});	
	}

	this.createPrivate = function(req, res, next){
		/*
        Create private vip codes.
		*/
		var start = req.query.start ? moment (req.query.start) : moment().hour(0).minute(0);
		var end = req.query.end ? moment (req.query.end).hour(23).minute(59) : 
		    moment().hour(23).minute(59);
		// fix timezone problems
		start = new Date (start);
		end = new Date (end);				
		var codename = req.query.codename;
		var service = req.query.service.split ('/');
		var code = req.query.code;
        var selectedCode = null;

		services = service.map (function (x, i, arr){
			if (x.toLowerCase ().indexOf ('s') != -1){
				return 'small group private'
			}
			else if (x.toLowerCase ().indexOf ('m') != -1){
				return 'medium group private'
			}
			else if (x.toLowerCase ().indexOf ('l') != -1){
				return 'large group private'
			}			
		});

		var label = {
			vn: 'Private VIP - ' + codename.toUpperCase (),
		}
		
		// Discount in a fix period of time. After that, normal price.
		var code6 = {
		    "name" : "", "desc" : "",
		    "start" : null, "end" : null, 
		    "codeType" : 3, "priority" : 2, 
		    "updatedAt" : [], 
		    "excluded" : false, 
		    "redeemData" : { 
		        "usage" : { "max" : null }, 
		        "total" : { "formula" : "6", "min" : null }, 
		        "dayofweek" : [ ] 
		    }, 
		    "customers" : [ ], "services" : [], 
		    "label" : { "vn" : null }
		};

		// Free of charge in X hour.
		var codeFreeX = {};

		// Charge at a fixed amount.
		var code7 = {			
		};

		// Charge at a special price
		var codePrice = {
		    "name" : "", "desc" : "",
		    "start" : null, "end" : null, 
		    "codeType" : 2, "priority" : 2, 
		    "updatedAt" : [], 
		    "excluded" : false, 
		    "redeemData" : { 
		        "price" : { "formula" : "1", "value" : null }, 
		    }, 
		    "customers" : [ ], "services" : [], 
		    "label" : { "vn" : null }			
		};

		if(code == 1){ // code6
			var minTotal = req.query.minTotal;
			var maxUsage = req.query.maxUsage;
			if (!minTotal || !maxUsage){
				console.log('Min total or max usage is not provided.');
				next();
				return;
			}
			code6.redeemData.usage.max = maxUsage;
			code6.redeemData.total.min = minTotal;
			selectedCode = code6;
		}
		else if(code == 2){ // code7

		}
		else if(code == 3){ // codeFreeX

		}
		else if(code == 4){ // codePrice
			var specialPrice = req.query.specialPrice;
			if (!specialPrice){
				console.log('Special price is not provided.');
				next();
				return;
			} 

			codePrice.redeemData.price.value = specialPrice;
			selectedCode = codePrice;
		}
		else{
			console.log('No code matched.');
			next();
			return;
		}

		selectedCode.name = 'PRIVATE_VIP_' + codename.toUpperCase ().split (' ').join ('');
		selectedCode.start = start;
		selectedCode.end = end;
		selectedCode.label = label;
		selectedCode.services = services;

		var newCode = new Promocodes (selectedCode);
		newCode.save (function (err, createdCode){
			if (err){
				next (err);
				return;
			}
			res.json ({code: createdCode})
		});	
	};


	this.createCommon = function(req, res, next){
        /*
        Create common codes.
        Always applied to all services. No need to specify.
        */

		var start = req.query.start ? moment (req.query.start) : moment().hour(0).minute(0);
		var end = req.query.end ? moment (req.query.end).hour(23).minute(59) : 
		    moment().hour(23).minute(59);
		// fix timezone problems
		start = new Date (start);
		end = new Date (end);				
		var codename = req.query.codename;
		// var services = req.query.service.split ('/'); 
		var code = req.query.code;
		var label = {
			vn: 'Common VIP - ' + codename.toUpperCase (),
		}

        // Free of charge in X hour.
        var codeFreeX = {
            "name" : "", "desc" : "",
            "start" : null, "end" : null, 
            "codeType" : 1, 
            "excluded" : false, 
            "label" : { "vn" : "" }, "priority" : 2, 
            "services" : [ "individual common", "group common" ], 
            "redeemData" : { "usage" : { "value" : null, "formula" : 1 } } 
        };

		// Charge at a special price
		var codePrice = {
		    "name" : "", "desc" : "",
		    "start" : null, "end" : null, 
		    "codeType" : 2, "priority" : 2, 
		    "updatedAt" : [], 
		    "excluded" : false, 
		    "redeemData" : { 
		        "price" : { "formula" : "1", "value" : null }, 
		    }, 
		    "customers" : [ ], "services" : [ "individual common", "group common" ], 
		    "label" : { "vn" : null }			
		};

        var selectedCode = null;

        if (code == 3){ // codeFreeX
        	var freeUsage = req.query.freeUsage;
        	if (!freeUsage){
        		console.log('Free usage not provided.');
        		next();
        		return;
        	}
        	codeFreeX.redeemData.usage.value = freeUsage;
        	selectedCode = codeFreeX;
        }
		else if(code == 4){ // codePrice
			var specialPrice = req.query.specialPrice;
			if (!specialPrice){
				console.log('Special price is not provided.');
				next();
				return;
			} 

			codePrice.redeemData.price.value = specialPrice;
			selectedCode = codePrice;
		}
		else{
			console.log('No code matched.');
			next();
			return;
		}

        selectedCode.name = 'COMMON_VIP_' + codename.toUpperCase ().split (' ').join ('');
		selectedCode.start = start;
		selectedCode.end = end;
		selectedCode.label = label;

		var newCode = new Promocodes (selectedCode);
		newCode.save (function (err, createdCode){
			if (err){
				next (err);
				return;
			}
			res.json ({code: createdCode})
		});	
	} 


	this.query = function(req, res, next){
		/*
        Query promocode given its name and period.
		*/
		var start = req.query.start ? moment (req.query.start) : moment().hour(0).minute(0);
		var end = req.query.end ? moment (req.query.end).hour(23).minute(59) : 
		    moment().hour(23).minute(59);
		start = new Date (start); // fix timezone problems
		end = new Date (end); // fix timezone problems			
		var codename = req.query.codename;

		var condition = {}

		// Pending ...	
	}     
}