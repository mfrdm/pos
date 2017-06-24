angular.module ('posApp')
	.service ('PromocodesService', ['$http', PromocodesService])

function PromocodesService ($http){

	this.readAllCodes = function(){
		return $http.get('/promocodes/code/all')
	}

	this.readCodeInfo = function(){
		return $http.get('/promocodes/code/info')
	}

	this.createCode = function(data){
		return $http.post('/promo-codes/create', {data:data})
	}

	this.editCode = function(id,data){
		return $http.post('/promo-codes/code/'+id, {data:data})
	}
}