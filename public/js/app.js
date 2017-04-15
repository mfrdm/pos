// TESTING

function assetData ($http){
	var url = '/api/assets';
	return $http.get (url);
};

function costData ($http){
	var url = '/api/costs';
	return $http.get (url);
}

function assetCtrl ($scope, assetData){
	$scope.message = 'Searching for assets';
	assetData.then(
		function (data){
			$scope.message = data.data.length ? '' : 'No asset found';
			$scope.assets = data.data;
			$scope.assetSection = 'Asset Section';
		},
		function (e){
			$scope.message = 'Something went wrong';
			console.log (e);
		}
	);
}

function costManagementCtrl ($scope, costData){
	$scope.message = 'Searching for costs';
	costData.then(
		function (data){
			$scope.message = data.data.length ? '' : 'No cost found';
			$scope.costs = data.data;
		},
		function (e){
			$scope.message = 'Something went wrong';
			console.log (e);
		}
	);
}

// Filter
function toVND (){
	return function (c, unit){
		return c + " " + unit
	}
}

// Apply to ng-repeat. NOT WORK.
function modifyAssets (){
	return function (c){
		if (c.name == 'table') return true
		return false
	}
}

// Directive. NOT WORKING YET
function assetSection (){
	return {
		scope: {
			thisSection: '=sectionName',
		},
		template: "{{ thisSection }}"
	}
}

function assetSectionA (){
	return {
		scope: {
			thisSection: '=sectionName',
		},
		templateUrl: '/bi'
	}
}

function assetPage (){
	return {
		templateUrl: '/assets'
	}	
}


angular.module('posApp', [])
	.controller ('assetCtrl', assetCtrl)
	.controller ('costManagementCtrl', costManagementCtrl)
	.filter ('toVND', toVND)
	.filter ('modifyAssets', modifyAssets)
	.directive ('assetSection', assetSection)
	.directive ('assetSectionA', assetSectionA)
	.directive ('assetPage', assetPage)
	.service ('assetData', assetData)
	.service ('costData', costData)

// END

// angular.module('posApp', ['checkinApp'])