var customerService = function($http){
	this.createOne = function(data){
		return $http({
			method:'POST',
			url:'/api/customers/create',
			data:JSON.stringify(data)
		})
	}
	this.updateOne = function(id, data){
		return $http({
			method:'POST',
			url:'/api/customers/customer/'+id+'/edit',
			data:JSON.stringify(data)
		})
	}
	this.search = function(input){
		var array = [{"email" : { $regex: input, $options: 'i' }},
		{"phone" : { $regex: input, $options: 'i' }},
		{"lastname" : { $regex: input, $options: 'i' }},
		{"firstname" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/customers',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}
	this.readOne = function(id){
		return $http({
		method:'GET',
			url:'api/customers/customer/'+id
		})
	}
}

app.service('customerService', ['$http',customerService])