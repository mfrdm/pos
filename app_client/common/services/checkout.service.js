var checkoutService = function($http){
	//Search Service
	this.searchCustomers = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
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

	//Get all checked in customer
	this.getDataOrderCheckout = function(){
		return $http({
			method:'GET',
			url:'/api/orders',
			params: {
				queryInput: JSON.stringify({
					conditions: {status:2},
					projection: null,
					opts: null
				})
			}
		})
	}

	this.withdrawOneAccount = function (occ, accId){
		var query = {
			occ: JSON.stringify (occ),
			accId: accId,
		}
		
		return $http({
			method:'GET',
			url:'/checkout/account/withdraw',
			params: query,
		});	
	}

}

app.service('checkoutService', ['$http',checkoutService])