var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Others();

function Others() {

	this.readHome = function(req, res) {

		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:[],
				js:[],
			}
		};

		res.render('index', {data:data});
	};

	this.angularApp = function (req, res){
		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:[],
				js:[],
			}
		};			

		res.render ('layout', {data: data});
	}

};