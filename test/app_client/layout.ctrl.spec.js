xdescribe ('Layout controller', function (){
	describe ('Manage authentication', function (){
		var $rootScope, $scope, $location, authentication, createCtrl, $controller;

		beforeEach (module('posApp'));
		beforeEach (inject(function ($injector){
			$rootScope = $injector.get ('$rootScope');	

			$location = $injector.get ('$location');
			$controller = $injector.get ('$controller');
			authentication = $injector.get ('authentication');
			$scope = $rootScope.$new();

			createCtrl = function (){
				return $controller ('LayoutCtrl', {
					'$rootScope': $rootScope, 
					'$scope': $scope, 
					'$location': $location, 
					'authentication': authentication 
				});
			};
		}));


		it ('should redirect to login page when user does not log in', function (){

		});

		it ('should allow to pages if user logged in');

	});

});
