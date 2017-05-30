angular.module ('posApp')
	.service ('CheckinService', ['$http','$q', CheckinService])

function CheckinService ($http, $q){
	this.searchCustomers = function(input){
		return $http({
			method:'GET',
			url:'/checkin/search-customers',
			params: {input: input}
		});
	}	

	//Validate Promote Code
	this.validatePromoteCode = function(data){
		return $http({
			method: 'GET',
			url: '/checkin/validate-promotion-code',
			params: {data:JSON.stringify(data)}
		})
	}

	this.getPromocodes = function (){
		return $http({
			method: 'GET',
			url: '/promocodes/'
		});
	}

	this.getCheckedinList = function(query){
		query.status = query.status ? query.status : 4; // get all by default

		return $http({
			method:'GET',
			url:'/checkin',
			params: query,
		})
	}

	this.readSomeProducts = function(){
		return $http({
			method:'GET',
			url:'/api/products'
		})
	}

	this.createOne = function (customerId, data) {
		return $http({
			method:'POST',
			url:'/checkin/customer/' + customerId,
			data: JSON.stringify({data: data}),
		});
	};

	this.readOneParent = function(id){
		return $http({
			method:'GET',
			url:'/occupancies/occupancy/'+id
		})
	}
	//Update new Order
	this.updateOne = function(id, service, parent){
		return $http({
			method: 'POST',
			url: '/checkin/customer/edit/'+id,
			data: JSON.stringify({
				$set: { service: service, parent:parent }
			})
		})
	};


	//Checkout for customer
	this.checkout = function(occupancy){
		return $http({
			url:'/checkout',
			method:'POST',
			data:JSON.stringify({data: occupancy})
		})
	};

	this.readInvoice = function(id){
		return $http({
			url: '/checkout/invoice/'+id,
			method:'GET'
		})
	}
}
