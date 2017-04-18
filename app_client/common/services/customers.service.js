var customerService = function(){
	this.createCustomer = function(data){
		return $http({
			method:'POST',
			url:'/api/customers/create',
			data:JSON.stringify(data)
		})
	}
}



app.service('customerService', ['$http',customerService])