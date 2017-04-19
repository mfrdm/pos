var employeeService = function($http){
	//Search Service
	this.searchEmployees = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/users/',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}
	this.postCreateEmployee = function(data){
		return $http({
			method:'POST',
			url:'/api/users/create',
			data:JSON.stringify(data)
		})
	}
	this.postSaveEdit = function(id, data){
		return $http({
			method:'POST',
			url:'/api/users/user/'+id+'/edit',
			data:JSON.stringify(data)
		})
	}
}

app.service('employeeService', ['$http',employeeService])