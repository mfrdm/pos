var createCustomer = function(data, $http){
	return $http({
		method:'POST',
		url:'/api/customers/create',
		data:JSON.stringify(data)
	})
}

app.service('createCustomer', createCustomer)