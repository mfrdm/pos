var checkinService = function($http){
	this.readCheckinService = function(){
		return $http({
			method:'GET',
			url:'/angular/readSomeCusCheckin'
		})
		// console.log('test')
	}

	this.readOneCusService = function(){
		return $http({
		method:'GET',
			url:'/customers/customer/58eb474538671b4224745192'
		})
	}

	this.readOneOrder = function(){
		return $http({
			method:'GET',
			url:'/checkout/invoice/58eee6800de4f5161f50afdf'
		})
	}

	this.checkInCustomerService = function(user, vm){
		return $http({
				method:'POST',
				url:'/checkin/'+user._id,
				data: JSON.stringify({
					total: 1,
					orderline: [
						{
							productName: vm.ordername
						}
					],
					customers:{
						customerId: user._id,
						firstname: user.firstname,
						lastname: user.lastname
					},
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",	
					updateAt: {
						time: new Date('09/15/2017')
					}
				})
			})
	}

	this.searchService = function(input){
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
}

app.service('checkinService', ['$http',  checkinService])