var mongoose = require('mongoose');
var Occupancy = mongoose.model ('Occupancies');
var moment = require ('moment');

module.exports = new OccupanciesCtrl ();

function OccupanciesCtrl (){
	this.readTransactions = function (req, res, next){
		var startHasMin = req.query.start ? 
		    (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? 
		    (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : 
			moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : 
			moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var conditions = {
			checkoutTime: {
				$gte: start, 
				$lte: end,
			},
			status: 2,
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		if (req.query.service){
			conditions['service.name'] = {$in: []};
			req.query.service.map (function (x, i, arr){
				conditions['service.name'].$in.push (x.toLowerCase ());
			})
		}

		var q = Occupancy.find (conditions, {total: 1, checkinTime: 1, checkoutTime: 1, 'customer.fullname': 1, 'service.name': 1});

		q.exec(function (err, occ){
			if (err){
				console.log (err);
				next (err);
				return
			}
			else {
				res.json ({data: occ});
			}
		}); 
	};

	this.readTotalCash = function (req, res, next){
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var conditions = {
			checkoutTime: {
				$gte: start, 
				$lte: end,
			},
			status: 2,
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		if (req.query.service){
			conditions['service.name'] = {$in: []};
			req.query.service.map (function (x, i, arr){
				conditions['service.name'].$in.push (x.toLowerCase ());
			})
		}

		var q = Occupancy.aggregate ([
			{
				$match: conditions
			}, 
			{
				$group: {
					_id: '$service.name', total: {$sum: "$paid"}
				}
			}
		]);

		q.exec(function (err, occ){
				if (err){
					console.log (err);
					next (err);
					return
				}
				else {
					res.json ({data: occ});
				}
			}
		); 			
	};

	this.readTotalRevenue = function (req, res, next){
		// later
	}

	this.readSomeByOneCustomer = function (req, res, next){
		/*
        Not a good api. Too much assumptions being made.
		*/
		var startHasMin = req.query.start ? 
			(req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? 
			(req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : 
			moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : 
			moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);
		var fullname = req.query.fullname;
		var service = req.query.service ? req.query.service : 'private';
		var status = req.query.status ? req.query.status : 2; // default is checked out.

		var conditions = {
			checkoutTime: {
				$gte: start, 
				$lte: end,
			},
			'customer.fullname': {$regex: fullname.toUpperCase ()},
			'service.name': {$regex: service},
			status: status,
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		var projection = {'total': 1, 'checkinTime': 1, 'checkoutTime': 1, 
			'customer.fullname': 1, 'service.name': 1, 'paid': 1, 
			'promocodes': 1, 'oriUsage': 1, 'price': 1}
		console.log(conditions)
		var q = Occupancy.find (conditions, projection);
		q.exec(function (err, occ){
			if (err){
				console.log (err);
				next (err);
				return
			}
			else {
				console.log(occ)
				res.json ({data: occ});
			}
		}); 		
	};

	this.searchByCustomer = function(req, res, next){
		var start = req.query.start ? moment (req.query.start).hour(0).minute(0) : 
			moment().hour(0).minute(0);
		var end = req.query.end ? moment (req.query.end).hour(23).minute(59) : 
			moment().hour(23).minute(59);
		// fix timezone problems
		start = new Date (start);
		end = new Date (end);
		var customername = req.query.customername;
		var service = req.query.service ? req.query.service : 'private';
		var status = req.query.status ? req.query.status : 2; // default is checked out.

		var conditions = {
			'createdAt': {
				$gte: start, 
				$lte: end,
			},
			'customer.fullname': {$regex: customername.toUpperCase ()},
			'service.name': {$regex: service},
			'status': status,
		};

		var projection = {'total': 1, 'checkinTime': 1, 'checkoutTime': 1, 
			'customer.fullname': 1, 'service.name': 1, 'paid': 1, 
			'promocodes': 1, 'oriUsage': 1, 'price': 1}

		var q = Occupancy.find (conditions, projection, function(err, occ){
			if (err){
				console.log (err);
				next (err);
				return
			}	
			res.json ({data: occ});		
		});		
	}

};