var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Others();

function Others() {

	this.angularApp = function (req, res){
		var listFile = ['checkin', 'checkout', 'customers', 'assets', 'costs', 'home']
		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:[],
				js:['app.js'],
			}
		};
		for (var i=0; i<listFile.length; i++){
			data.look.js.push(listFile[i]+'.ctrl.js')
			data.look.js.push('common/services/'+listFile[i]+'.service.js')
		}			

		res.render ('layout', {data: data});
	}

};