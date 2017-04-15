angular
	.module ('posApp')
	.service ('assetsData', assetsData);


function assetsData ($http){
	var url = '/api/assets';
	return $http.get (url);
};
