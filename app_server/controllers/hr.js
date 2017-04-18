var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Hr();

function Hr() {

	this.readOverview = function(req, res) {
		var data = {
			user: {
				data:dataList
			},
			look:{
				title:"Booking",
				css:['']
			}
		};
		res.render('createstaff', {data:data})
	};

	this.readOneUser = function(req, res) {
		var apiUrl = apiOptions.server + "/api/users/user/" + req.params.uid;
		var view = 'checkin';
		var qs = {};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Return 1 specific User by ID",
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

	this.editOneUser = function(req, res){
		var apiUrl = apiOptions.server + "/api/users/user/" + req.params.uid + "/edit";
		var view = 'checkin';
		var body = req.body;
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Return 1 specific User by ID",
					css:['']
				}
			};
			return data;
		};
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	//Angular
	this.readSearchEmployee = function(req, res){
		helper.angularRender(req, res, 'staff/searchStaff')
	}

	this.readCreateEmployee = function(req, res){
		helper.angularRender(req, res, 'staff/createStaff')
	}

	this.readEditEmployee = function(req, res){
		helper.angularRender(req, res, 'staff/editStaff')
	}

	this.readProfileEmployee = function(req, res){
		helper.angularRender(req, res, 'staff/profileStaff')
	}

};