angular
	.module ('posApp')
	.service ('comboService', ['$http', comboService]);

function comboService ($http){
	//Search Service
	this.searchCustomers = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/customers',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: {firstname: 1, lastname: 1, phone: 1, email: 1},
					opts: null
				})
			}
		})
	}
};
