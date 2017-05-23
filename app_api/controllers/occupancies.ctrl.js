var mongoose = require('mongoose');
var Occupancy = mongoose.model ('occupancy');
var moment = require ('moment');

module.exports = new OccupanciesCtrl ();

function OccupanciesCtrl (){
	this.readSomeOccupancies = function (){

	}

	this.readTotal = function (req, res, next){
		var today = moment ();
		var start = req.query.start ? new Date (req.query.start) : new Date (today.format ('YYYY-MM-DD'));
		var end = req.query.end ? new Date (req.query.end + ' 23:59:59') : new Date (today.format ('YYYY-MM-DD') + ' 23:59:59');

		var stmt = 	{
			checkoutTime: {
				$gte: start, 
				$lte: end,
			},
			status: 2,
		};

		if (req.query.storeId){
			stmt['location._id'] = req.query.storeId;
		}

		if (req.query.service){
			stmt['service.name'] = {$in: []};
			req.query.service.map (function (x, i, arr){
				stmt['service.name'].$in.push (x.toLowerCase ());
			})
		}

		var q = Occupancy.aggregate ([{$match: stmt}, {$group: {_id: '$service.name', total: {$sum: "$total"}}}]);

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
	}

};