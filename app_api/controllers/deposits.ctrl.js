var mongoose = require('mongoose');
var Deposits = mongoose.model ('Deposits');
var moment = require ('moment');

module.exports = new DepositCtrl ();

function DepositCtrl (){
	this.readSomeByOneCustomer = function (req, res, next){
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);
		var fullname = req.query.fullname;

		var conditions = {
			createdAt: {
				$gte: start, 
				$lte: end,
			},
			'customer.fullname': {$regex: fullname.toUpperCase ()}
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		var q = Deposits.find (conditions);

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

	this.readTotalCost = function (req, res, next){
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		console.log (start, end)

		var conditions = {
			createdAt: {
				$gte: start, 
				$lte: end,
			},
			'customer.email': 'phammanhhiep89@gmail.com', // Pham Manh Hiep
			'customer.phone': '0965284281',
			total: {$lt: 0}
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		var q = Deposits.aggregate ([
			{
				$match: conditions
			}, 
			{
				$group: {
					_id: null, total: {$sum: "$total"}
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

	this.readTotalDeposit = function (req, res, next){
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var conditions = {
			createdAt: {
				$gte: start, 
				$lte: end,
			},
			total: {$gte: 0},
			'customer.email': {$ne: 'phammanhhiep89@gmail.com'}, // Pham Manh Hiep
			'customer.phone': {$ne: '0965284281'},			
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		var q = Deposits.aggregate ([
			{
				$match: conditions
			}, 
			{
				$group: {
					_id: '$account.name', total: {$sum: "$total"}
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
		});		
	};
}