angular.module ('posApp')
	.service ('StorageService', ['$http', StorageService])

function StorageService ($http){
	// get storage list
	this.readStorageList = function(){
		return $http.get('/storages')
	}
	
}