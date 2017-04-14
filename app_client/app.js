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
			controller: 'assetsCtrl',
			controllerAs: 'vm',
		})
		.when ('/fin/costs', {
			templateUrl: '/fin/costs',
			controller: 'costsCtrl',
			controllerAs: 'vm',
		})		
		.otherwise ({redirectTo: '/'});
};

angular
	.module ('posApp')
	.config (['$routeProvider', config])
	.run(function($rootScope) {
	    $rootScope.$on('$viewContentLoaded', function () {
	        $(document).foundation();
	    });
	});