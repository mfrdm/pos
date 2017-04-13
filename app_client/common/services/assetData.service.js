angular
	.module ('posApp')
	.service ('assetData', assetData);


function assetData ($http){
	var url = '/api/assets';
	return $http.get (url);
};