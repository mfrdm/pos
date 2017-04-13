angular.module ('posApp', ['ngRoute']);

function config ($routeProvider){
	$routeProvider
		.when ('/', {
			templateUrl: '/readHome',
			controller: 'homeCtrl',
			controllerAs: 'vm',
		})
		.when ('/assets', {
			templateUrl: '/assets',
			controller: 'assetCtrl',
			controllerAs: 'vm',
		})
		.otherwise ({redirectTo: '/'});
};

angular
	.module ('posApp')
	.config (['$routeProvider', config])
