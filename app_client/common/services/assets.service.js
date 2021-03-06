angular
	.module ('posApp')
	.service ('assetsService', ['$http', '$q', assetsService]);

function assetsService ($http, $q){

	this.search = function(input){
		var array = [{"name" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/assets',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}

	this.readSome = function (){
		var url = '/api/assets';
		return $http.get (url);				
	};
	this.readOne = function(id){
		return $http({
		method:'GET',
			url:'api/assets/asset/'+id
		})
	}

	this.updateOne = function (id, data){
		var url = '/api/assets/asset/' + id + '/edit';
		return $http.post (url, data);	
	}

	// this.deleteOne = function (id){
	// 	// var url = '/api/assets/asset/' + id + '/delete';
	// 	// return $http.post (url, {});
	// 	var deferObj = $q.defer ();
	// 	deferObj.resolve ()
	// 	return deferObj.promise
	// }

	this.createOne = function (data){
		var url = '/api/assets/create/';
		return $http.post (url, data);

		// // TESTING
		// var deferObj = $q.defer ();
		// // var data = {
		// // 	name: 'Long table',
		// // 	category: 2,
		// // 	quantity: 10,
		// // 	status: 2,
		// // }
		
		// deferObj.resolve ({data: data})
		// return deferObj.promise
	}

};
