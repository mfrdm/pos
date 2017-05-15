(function () {
	angular
		.module ('posApp')
		.controller ('LoginCtrl', ['$route', '$scope', '$location', 'authentication', LoginCtrl])


	function LoginCtrl ($route, $scope, $location, authentication) {
		var vm = this;
		var LayoutCtrl = $scope.$parent.layout;

		vm.other = {};
		
		vm.other.returnPage = LayoutCtrl.model.dom.returnPage || '/checkin';

		vm.credentials = {
			firstname: '',
			lastname: '',
			midname: '',
			email: '',
			birthday: '',
			gender: '',
			phone: '',
			password: '',
			username: '', // phone or email
		}

		vm.loginSuccessAction = function (data) {
			// var storeName = 'Green Space Chua Lang 82/70'; // TESTING
			vm.credentials = {};
			$location.search ('page', null);
			LayoutCtrl.ctrl.updateAfterLogin ();
			$location.path (vm.other.returnPage);			
		};

		vm.loginFailAction = function (data) {

		};

		vm.submitLogin = function (){
			authentication.login (vm.credentials, vm.loginSuccessAction, vm.loginFailAction);
		};


		vm.logout = function (){
			authentication.logout (null, function (){
				$location.path ('/login');					
			});
		};
	}

})();