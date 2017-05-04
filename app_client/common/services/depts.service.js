var deptService = function($http){
	//Search Service
	this.search = function(input){
		var array = [{"name" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/companies/depts',
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
		var url = '/api/companies/depts';
		return $http.get (url);				
	};
	this.readOne = function(id){
		return $http({
		method:'GET',
			url:'api/depts/dept/'+id
		})
	}

	this.updateOne = function (id, data){
		var url = '/api/depts/dept/' + id + '/edit';
		return $http.post (url, data);	
	}

	// this.deleteOne = function (id){
	// 	// var url = '/api/depts/dept/' + id + '/delete';
	// 	// return $http.post (url, {});
	// 	var deferObj = $q.defer ();
	// 	deferObj.resolve ()
	// 	return deferObj.promise
	// }

	this.createOne = function (data){
		var url = '/api/depts/create/';
		return $http.post (url, data);
	}
}

app.service('deptService', ['$http',deptService])