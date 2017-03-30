var request = require ('request');

// Purpose: interact with api
module.exports = new function () {
	// send a request to a server, receive data and send back to client
	this.callApi = function (req, res, apiUrl, method, returnJson, view, qs, body, dataFilter, send, otherAction, cb) {
		var reqOptions = {
			url: apiUrl,
			method: method,
			json: returnJson,
		};

		if (Object.keys(body).length) {
			reqOptions.body = body;
		};

		if (Object.keys(qs).length) {
			reqOptions.qs = qs;
		};

		try{
			request (reqOptions, function(err, response, body){
				var data = dataFilter ? dataFilter(body.data) : body.data;

				// for other actions like logging
				// pass many params, but author of otherAction can choose some to use
				if (otherAction){
					otherAction (body, err, response, req, res, reqOptions);
				}

				send (req, res, view, data, cb);
			});
		}
		catch (err){
			this.sendJsonRes (res, 500, {message: err})
		}
	}

	this.readApi = function (req, res, apiUrl, view, qs, dataFilter, send, otherAction, cb) {
		var method = 'GET';
		var returnJson = true;
		var body = {};
		send = send ? send : this.render;
		this.callApi (req, res, apiUrl, method, returnJson, view, qs, body, dataFilter, send, otherAction, cb);
	}

	this.postApi = function (req, res, apiUrl, view, body, dataFilter, send, otherAction, cb) {
		var method = 'POST';
		var returnJson = true;
		var qs = {};
		this.callApi (req, res, apiUrl, method, returnJson, view, qs, body, dataFilter, send, otherAction, cb);
	}

	this.render = function (req, res, view, data, status, cb) {
		res.status (status ? status : 200);
		res.render(view, data, cb);
	};

	this.sendJsonRes = function (res, status, content){
		res.status(status);
		res.json(content);
	};

	this.stdExec = function (res, query) {
		try {
			query.exec(function (err, data){	
				if (err){
					this.sendJsonRes(res, 404, {message: err});
					return
				}

				if (!data) {
					this.sendJsonRes(res, 404, {
						message: 'empty results'
					});

					return
				}
				
				this.sendJsonRes (res, 200, {message: 'success', data: data});
			});
		}
		catch (err) {
			this.sendJsonRes(res, 404, {
				message: err,
			});
		}				
	};

}();
