var customerService = function($http){
	this.postCreateCustomer = function(data){
		return $http({
			method:'POST',
			url:'/api/customers/create',
			data:JSON.stringify(data)
		})
	}
	this.postSaveEdit = function(id, data){
		return $http({
			method:'POST',
			url:'/api/customers/customer/'+id+'/edit',
			data:JSON.stringify(data)
		})
	}

	this.readCustomers = function (username){
		var cond = [{"firstname" : { $regex: username, $options: 'i' }}, {"lastname" : { $regex: username, $options: 'i' }}, {"email" : { $regex: username, $options: 'i' }}, {"phone" : { $regex: username, $options: 'i' }}];
		return $http({
			method:'GET',
			url:'/api/customers',
			params:{
				queryInput: JSON.stringify({
					conditions: { $or: condition },
					projection: null,
					opts: null
				})
			}
		})
	}
}

app.service('customerService', ['$http',customerService])