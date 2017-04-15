angular
	.module ('posApp')
	.service ('costsData', costsData);


function costsData ($http){
	var url = '/api/costs';
	return $http.get (url);
};
