var deptService = function($http){
	//Search Service
	this.searchDepts = function(input){
		var array = [{"name" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/companies/depts/',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}
	this.postCreateDept = function(data){
		return $http({
			method:'POST',
			url:'/api/depts/create',
			data:JSON.stringify(data)
		})
	}
	this.postSaveEdit = function(id, data){
		return $http({
			method:'POST',
			url:'/api/depts/dept/'+id+'/edit',
			data:JSON.stringify(data)
		})
	}
}

app.service('deptService', ['$http',deptService])