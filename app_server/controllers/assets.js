var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Assets();

function Assets() {

	this.readSomeAsset = function(req, res) {
		var apiUrl = apiOptions.server + "/api/assets";
		var view = 'assets';
		var qs = {
			userId: 'xxx',
			status: 1,
		};

		var dataFilter = function (data){
			return {
				data: {
					user:{

					},
					data: data,
					look:{
						title:"Assets",
						css:[],
						js:[]
					}						
				}
			}
		};

		var send = function (req, res, view, data, cb){
			res.render (view, data, cb);
		}

		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};

	this.readOneAssetById = function(req, res) {
		var apiUrl = apiOptions.server + "/api/assets/asset/"+req.params.assetid;
		var view = null;
		var qs = {};
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};

	this.createOneAsset = function(req, res) {
		var apiUrl = apiOptions.server + "/api/assets/create";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	this.updateOneAsset = function(req, res) {
		var apiUrl = apiOptions.server + "/api/assets/asset/"+req.params.assetid+"/edit";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

};