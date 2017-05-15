describe ('Layout controller', function (){
	describe ('Manage authentication', function (){
		var $rootScope, Scope, $location, authentication, createCtrl, $controller;

		beforeEach (module('posApp'));
		beforeEach (inject (function ($injector){
			$rootScope = $injector.get ('$rootScope');
			Scope = new $rootScope ();
			$location = $injector.get ('location');
			$controller = $injector.get ('controller');
			authentication = $injector.get ('authentication');

			createCtrl = function (){
				return controller ('LayoutCtrl', {
					'$rootScope': $rootScope, 
					'$scope': Scope, 
					'$location': $location, 
					'authentication': authentication 
				});
			}
		}));


		it ('should redirect to login page when user does not log in', function (){
			var ctrl = createCtrl ();
			
			
		});

		it ('should allow to pages if user logged in');

	});

});
