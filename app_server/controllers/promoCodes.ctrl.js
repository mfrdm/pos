var mongoose = require ('mongoose');
var PromoCodes = mongoose.model ('Promocodes');
var moment = require ('moment');

module.exports = new PromoCodesCtrl();

function PromoCodesCtrl() {
	this.createOneCode = function (req, res, next){
		var pc = new PromoCodes (req.body.data);
		pc.save (function (err, newCode){
			if (err){
				next (err);
				return
			}
			if (newCode){
				res.json ({data: newCode});
			}
			else {
				next ();
			}
		})
	};

	this.updateOneCode = function (req, res, next){
		PromoCodes.findByIdAndUpdate(req.params.codeId, req.body.data, {new: true}, function(err, data){
			if (err){
				next (err)
				return
			}
			else{
				res.json ({data: data});
				return
			}
		})
	};

	this.readOneCodeById = function (req, res, next){
		PromoCodes.findById ({_id: req.params.codeId}, function (err, data){
			if (err){
				next (err)
				return
			}
			if (data && Object.keys(data).length){
				res.json({data: data});
			}
			else{
				next ();
			}
			
		});
	};

	this.readSomeCodes = function (req, res, next){
		var today = new Date ();
		var conditions = {
			start: {$lte: today}, 
			end: {$gte: today},
			excluded: false,
		};

		PromoCodes.find (conditions, {name: 1, label: 1, codeType: 1, conflict: 1, override: 1, services:1}, function (err, foundCodes){
			if (err){
				next (err);
				return
			}

			res.json ({data: foundCodes});
		});
	}

	this.readCodeInfo = function(req, res, next){
		var defaultValues = {};

		// REMOVE later
		defaultValues.codeType = [
			{value:1, 'label':'usage', formula:[
				{value:'1', label:'Giảm thời gian sử dụng'},
				{value:'', label:'Đặt thời gian sử dụng'}
			]},
			{value:2, 'label':'price', formula:[
				{value:'1', label:'Giảm phần trăm giá gốc'},
				{value:'', label:'Đặt giá mới'}
			]},
			{'value':3, 'label':'total', formula:[
				{value:'1', label:'Giảm giá giờ đầu'},
				{value:'2', label:'Giảm giá theo %'},
				{value:'', label:'Đặt tổng tiền thanh toán mới'}
			]},
			{'value':4, 'label':'quantity', formula:[
				{value:'1', label:'Giảm số lượng'},
				{value:'', label:'Đặt số lượng mới'}
			]}
		];

		// defaultValues.formulars = {
		// 	total: [
		// 		{label: {vn: 'Giảm giá sau X giờ'}, formula: 1},
		// 		{label: {vn: 'Giảm phần trăm'}, formula: 2},
		// 		{label: {vn: 'Đặt giá mới và thời gian tối thiểu'}, formula: 3},
		// 		{label: {vn: 'Đặt giá mới và miễn phí 1 khoảng thời gian'}, formula: 4},
		// 		{label: {vn: 'Đặt giá mới trong 1 khoảng thời gian'}, formula: 5},
		// 		{label: {vn: 'Đặt tổng tiền tối thiểu trong 1 khoảng thời gian'}, formula: 6},
		// 	],
		// 	usage: [
		// 		{label: {vn: 'Miễn phí giờ sử dụng'}, formula: 1},
		// 		{label: {vn: 'Đặt thời gian sử dụng mới'}},			
		// 	],
		// 	price: [
		// 		{label: {vn: 'Giảm phần trăm'}, formula: 1},
		// 		{label: {vn: 'Đặt giá mới'}},
		// 	],
		// 	quantity: [
		// 	]
		// };

		defaultValues.excluded = [
			{'value':true, 'label':'True'},
			{'value':false, 'label':'False'}
		];

		defaultValues.priority = [
			{'value':1, 'label':'Base priority'},
			{'value':2, 'label':'Priority 2'},
			{'value':3, 'label':'Priority 3'},
		];

		defaultValues.services = [
			{'value':'group common', 'label':'Nhóm chung'},
			{'value':'individual common', 'label':'Cá nhân'},
			{'value':'small group private', 'label':'Nhóm riêng 15'},
			{'value':'medium group private', 'label':'Nhóm riêng 30'},
			{'value':'large group private', 'label':'Nhóm riêng 40'}
		];

		res.json ({data: defaultValues});
	}

	this.readAllCodes = function (req, res, next){
		PromoCodes.find ({}, function (err, foundCodes){
			if (err){
				next (err);
				return
			}
			res.json ({data: foundCodes});
		});
	}

}