angular.module ('posApp')
	.service ('TransactionService', ['$http', TransactionService])

function TransactionService ($http){
	this.readTrans = function(startTime, endTime){
		return $http.get('/transactions', {params:{start:JSON.stringify(startTime), end:JSON.stringify(endTime)}})
	}

	this.createTrans = function(data){
		return $http.post('/transactions/create', {data:data})
	}

	this.editTrans = function(id,data){
		return $http.post('/transactions/edit/'+id, {data:data})
	}
}