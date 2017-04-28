// interact with database: mongodb
var mongoose = require('mongoose');
var request = require('request');
var requestHelper = require('./requestHelper');

module.exports = new function (){
	//insert new User
	this.insertOne = function (req, res, Model, beforeAction, afterAction) {
		try{
			var obj = new Model (req.body);
			if (beforeAction) beforeAction (obj, req.body);

			obj.save (function (err, data){
				if (err){
					console.log(err)
					requestHelper.sendJsonRes(res, 404, err);
					return
				}

				if (afterAction) afterAction (obj, res, data); // intend to call methods of the obj
				else requestHelper.sendJsonRes (res, 201, {data: data});			
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
				console.log(update)
				console.log(idValue)
				var query = Model
					.findByIdAndUpdate (mongoose.Types.ObjectId(idValue), update, {runValidators: true, safe: true, upsert: true, new : true});
				requestHelper.stdExec (res, query);
			}
			else{
				console.log ('Error: no passed params');
				requestHelper.sendJsonRes(res, 400, {
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
			console.log(idValue)		
			var query = Model
				.findById(idValue)
				.select(attrs);
			requestHelper.stdExec (res, query);
		}
		else{
			console.log ('Error: no passed params');
			requestHelper.sendJsonRes(res, 404, {
				message: 'no passed params'			
			});
		}	 	 
	};

	this.findSome = function(req, res, Model, next) {
		try{
			var queryInput = req.query.queryInput ? JSON.parse (req.query.queryInput) : {conditions: null, projection: null, opts: null}; // queyInput is a js object being stringified
			var query = Model.find(queryInput.conditions, queryInput.projection, queryInput.opts);
			requestHelper.stdExec (res, query, next);
		}
		catch(ex){
			console.log(ex)
			requestHelper.sendJsonRes (res, 500, {message: ex});
		}
	};

	this.findSomePopulate = function(req, res, Model, next) {
		try{
			var queryInput = req.query.queryInput ? JSON.parse (req.query.queryInput) : {conditions: null, projection: null, opts: null, populate: null}; // queyInput is a js object being stringified
			var query = Model
				.find(queryInput.conditions, queryInput.projection, queryInput.opts)
				.populate(queryInput.populate)
			requestHelper.stdExec (res, query, next);
		}
		catch(ex){
			console.log(ex)
			requestHelper.sendJsonRes (res, 500, {message: ex});
		}
	};
}();
