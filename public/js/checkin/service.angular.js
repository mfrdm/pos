var readCheckinService = function($http){
	return $http({
		method:'GET',
		url:'/angular/readSomeCusCheckin'
	})
}

var readOneCusService = function($http){
	return $http({
		method:'GET',
		url:'/customers/customer/58eb474538671b4224745192'
	})
}

var readOneOrder = function($http){
	return $http({
		method:'GET',
		url:'/checkout/invoice/58eee6800de4f5161f50afdf'
	})
}

var checkInService = function(user, vm, $http){
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

app.service('readCheckinService', readCheckinService)
	.service('readOneCusService', readOneCusService)
	.service('checkInService', checkInService)
	.service('readOneOrder', readOneOrder)