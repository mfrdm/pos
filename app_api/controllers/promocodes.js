var mongoose = require('mongoose');
var Promocodes = mongoose.model('Promocodes');
var moment = require ('moment')

module.exports = new PromocodeCtrl ();

function PromocodeCtrl (){
	this.createOne = function (req, res, next){
		var start = req.query.start ? moment (req.query.start) : moment().hour(0).minute(0);
		var end = req.query.end ? moment (req.query.end).hour(23).minute(59) : moment().hour(23).minute(59);

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
}