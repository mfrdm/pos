angular.module ('posApp')
	.service ('otherService', ['$http', otherService])

function otherService ($http){
	//Read all documents of a collection
	this.readSome = function(collection){
		var url = '/api/'+collection;
		return $http.get(url)
	}
}
