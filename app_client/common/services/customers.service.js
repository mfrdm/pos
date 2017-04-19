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
}

app.service('customerService', ['$http',customerService])