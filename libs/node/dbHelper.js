// interact with database: mongodb
var mongoose = require('mongoose');
var request = require('request');
var requestHelper = require('./requestHelper');

module.exports = new function (){
	//insert new User
	this.insertOne = function (req, res, Model) {
		try{
			var query = new Model (req.body);
			query.save (function (err, data){
				if (err){
					console.log(err)
					requestHelper.sendJsonRes(res, 404, err);
					return
				}
				requestHelper.sendJsonRes (res, 201, {data: data});			
			});	
		}
		catch(ex){
			console.log(ex)
			requestHelper.sendJsonRes (res, 500, {message: ex});
		}
	};

	this.insertSome = function (req, res, Model) {	
		try {
			Model.collection.insert(req.body, {}, function (err, data){
				if (err){
					console.log(err)
					requestHelper.sendJsonRes(res, 404, err);
					return
				}

				requestHelper.sendJsonRes (res, 201, {data: data.insertedCount + ' documents being inserted'});			
			});
		}
		catch (ex){
			console.log(ex)
			requestHelper.sendJsonRes (res, 500, {message: ex});		
		}
	};

	this.updateOneById = function (req, res, Model, idName){
		try {
			if (req.params && req.params[idName]){
				var idValue = req.params[idName];
				var update = req.body;	
				var query = Model
					.findByIdAndUpdate (mongoose.Types.ObjectId(idValue), update, {runValidators: true});
				requestHelper.stdExec (res, query);
			}
			else{
				requestHelper.sendJsonRes(res, 404, {
					message: 'no passed params'			
				});
			}
		} 
		catch (ex){
			console.log(ex)
			requestHelper.sendJsonRes(res, 500, {
				message: 'internal error'		
			});		
		}
	};

	this.findOneById = function(req, res, Model, idName) {
		if (req.params && req.params[idName]){
			var idValue = req.params[idName];
			var attrs = req.query.attrs;		
			var query = Model
				.findById(idValue)
				.select(attrs);
			requestHelper.stdExec (res, query);
		}
		else{
			requestHelper.sendJsonRes(res, 404, {
				message: 'no passed params'			
			});
		}	 	 
	};

	this.findSome = function(req, res, Model) {
		try{
			console.log(req.query)
			var query = Model.find(req.query, req.query.projection, req.query.opts);
			requestHelper.stdExec (res, query);
		}
		catch(ex){
			console.log(ex)
			requestHelper.sendJsonRes (res, 500, {message: ex});
		}
	};
}();
