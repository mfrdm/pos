angular
	.module ('posApp')
	.service ('BookingService', ['$http', BookingService]);

function BookingService ($http){

	this.readAll = function (query){
		var url = '/bookings/all';
		return $http ({
			method: 'GET',
			url: url,
			params: query
		});
	}

	this.readSome = function (){
		var url = '/bookings';
		return $http.get (url);				
	};

	this.readOne = function(id){
		return $http({
		method:'GET',
			url:'api/bookings/booking/'+id
		})
	}
	this.readOneCustomer = function(id){
		return $http({
		method:'GET',
			url:'api/customers/customer/'+id
		})
	}

	this.updateOne = function (id, data){
		var url = '/bookings/'+ id + '/edit';
		return $http.post (url, data);	
	}

	this.book = function (data){
		var url = '/bookings/create/';
		return $http.post (url, {data: data});
	}

};
