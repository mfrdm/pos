app.service('CustomerService', ['$http', CustomerService])

function CustomerService ($http){
	this.createOne = function(data){
		return $http({
			method:'POST',
			url:'/customers/create',
			data:JSON.stringify({data:data})
		})
	}
	this.updateOne = function(id, data){
		return $http({
			method:'POST',
			url:'/api/customers/customer/'+id+'/edit',
			data:JSON.stringify(data)
		})
	}

	// FIX: user /customers
	this.readCustomers = function(input){
		return $http({
			method:'GET',
			url:'/customers',
			params: {input: input}
		});
	}	
	this.readOne = function(id){
		return $http({
		method:'GET',
			url:'api/customers/customer/'+id
		})
	}
}

