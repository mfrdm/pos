var validator = require ('validator')
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var RewardsCtrl = require ('./rewards.ctrl');

module.exports = new CustomersCtrl();

function CustomersCtrl() {
	var thisObj = this;
	this.readOverview = function(req, res) {
		var data = {
			user: {
				data:dataList
			},
			look:{
				title:"Customers",
				css:['']
			}
		};

		res.render('layout', {data:data})
	};

	this.readSomeCustomers = function (req, res, next){
		function cb (cus){
			res.json ({data: cus});
		}

		thisObj.find (req, res, next, cb);
	}

	this.find = function(req, res, next, cb) {
		var query;
		var maxReturnedItem = 30;
		var input = req.query.input; // email, phone, fullname
		if (!input){
			next (); // 
			return;
		}

		var conditions = {};

		input = validator.trim (input);
		var projections = {fullname: 1, phone: {$slice: [0,1]}, email: {$slice: [0,1]}, checkinStatus: 1, isStudent: 1, edu: 1, birthday: 1, occupancy: 1};

		if (validator.isEmail (input)){
			conditions.email = input;
		}
		else if (parseInt (input)){ // very trivial check.
			conditions.phone = input;
		}
		else { 
			conditions.fullname = {$regex: input.toUpperCase ()};
		}

		query = Customers.find (conditions, projections, function (err, cus){
			if (err){
				next (err);
				return
			}
			if (cus.length){
				cus = cus.slice (0, maxReturnedItem); // get the first maxReturnedItem customers
			}
			cb (cus);		
		});
	};

	// Assume one phone or email cannot be registered more than once
	this.checkExist = function (req, res, next){
		var searchedPhone = req.query.phone;
		var searchedEmail = req.query.email;
		var searchedFullname = req.query.fullname.toUpperCase (); 

		var query = {
			$or: [
				{fullname: searchedFullname},
			]
		}

		if (searchedEmail){
			query.$or.push ({email: searchedEmail});
		}

		if (searchedPhone){
			query.$or.push ({phone: searchedPhone});
		}

		Customers.find (query, {email: 1, phone: 1, fullname: 1, birthday: 1, isStudent: 1}, function (err, foundCustomers){
			if (err){
				console.log (err);
				next (err);
				return;
			}

			if (foundCustomers.length){
				var filteredCustomers = [];

				// prioritize phone and email
				foundCustomers.map (function (x, i, arr){
					if (x.fullname != searchedFullname) {
						filteredCustomers.push (x);
					}
					else if (x.fullname == searchedFullname && (x.phone == searchedPhone || x.email == searchedEmail)){
						filteredCustomers.push (x);
					}
				});

				if (!filteredCustomers.length){
					filteredCustomers = foundCustomers;
				}

				res.json ({data: filteredCustomers});	
			}
			else{
				res.json ({data: []});
			}

		});
	};

	this.readOneCustomerById = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers/customer/" + req.params.cusId;
		var view = null;
		var qs = {};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Return 1 specific Customer by ID",
					css:['']
				}
			};
			return data;
		};
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};

	this.createOneCustomer = function(req, res, next) {
		// sanitize
		req.body.data.firstname = validator.trim (req.body.data.firstname);
		req.body.data.middlename = validator.trim (req.body.data.middlename);
		req.body.data.lastname = validator.trim (req.body.data.lastname);
		req.body.data.phone = req.body.data.phone ? validator.trim (req.body.data.phone) : req.body.data.phone;
		req.body.data.email = req.body.data.email ? validator.trim (req.body.data.email) : req.body.data.email;

		// NOT REQUIRE PHONE OR EMAIL. CHANGE TO BE REQUIRED LATER
		// if (!req.body.data.email && !req.body.data.phone){
		// 	res.status (500).json ({error: {message: 'phone and email are not provided', code: 1}});
		// 	return;
		// }

		if (req.body.data.email && !validator.isEmail (req.body.data.email)){
			res.status (500).json ({error: {message: 'invalid email', code: 2}});
			return;
		};

		// this cause error since some new phone numbers are not recognized. Should turn off
		// if (req.body.data.phone && !validator.isMobilePhone (req.body.data.phone, 'vi-VN')){
		// 	res.status (500).json ({error: {message:'invalid phone', code: 3}});
		// 	return;
		// };

		var newCustomer = new Customers (req.body.data);

		newCustomer.save (function (err, cus){
			if (err){
				next (err);
				return 
			}
			else{
				function cb (rwd){
					res.json ({data: cus});
				}
				req.body.customer = cus;
				RewardsCtrl.initReward (req, res, next, cb)
			}
		});
	};

	this.updateOneCustomer = function(req, res) {
	};

	this.addAccount = function (req, res, next, cb){
		var cusId = req.body.acc.customer._id;
		var accId = req.body.acc._id;
		Customers.findOneAndUpdate ({_id: cusId}, {$push: {accounts: accId}}, {new: true}, function (err, cus){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (cb){
				cb (cus)
			}
			else{
				res.json ({data: cus});
			}				

		});
	};

	this.findOne = function (req, res, next, cb){
		var cusId = req.body.cus._id;
		Customers.findOne ({_id: cusId}, function (err, foundCus){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (cb){
				cb (foundCus)
			}
			else{
				res.json ({data: foundCus});
			}				
		})
	}

	this.findOneByContact = function (req, res, next, cb){
		var fullname = req.query.fullname;
		var phone = req.query.phone;
		var email = req.query.email;

		if (!fullname && !phone && !email){
			if (cb) cb (null);
			else next ();
			return;
		}

		var conditions = {};
		if (fullname) conditions.fullname = {$regex: fullname.toUpperCase ()};
		if (phone) conditions.phone = phone;
		if (email) conditions.email = email;

		Customers.find (conditions, function (err, foundCus){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (cb){
				cb (foundCus[0])
			}
			else{
				res.json ({data: foundCus[0]});
			}				
		})		
	}

};