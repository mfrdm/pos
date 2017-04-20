(function () {
	angular
		.module ('posApp')
		.controller ('loginCtrl', ['$location', 'authentication', loginCtrl])


	function loginCtrl ($location, authentication) {
		var vm = this;
		vm.other = {};
		vm.other.localLoginBoxName = 'login-box';
		vm.other.localSignupBoxName = 'signup-box';
		vm.other.displayLoginBox = vm.other.localLoginBoxName;

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

		vm.other.returnPage = $location.search ().page || '/';

		vm.registerSuccessAction = function (data){
			vm.credentials = {};
			$location.search ('page', null);
			$location.path (vm.other.returnPage);
		};

		vm.registerFailAction = function (err){
			// display message
		};

		vm.loginSuccessAction = function (data) {
			vm.credentials = {};
			$location.search ('page', null);
			$location.path (vm.other.returnPage);			
		};

		vm.loginFailAction = function (data) {

		};

		vm.submitRegister = function (){
			authentication.register (vm.credentials, vm.registerSuccessAction, vm.registerFailAction);
		};

		vm.submitLogin = function (){
			authentication.login (vm.credentials, vm.loginSuccessAction, vm.loginFailAction);
		};


		vm.logout = function (){
			authentication.logout (null, function (){
				$location.path ('/login');					
			});
		};

		vm.changeSwitch = function (which, ele) {
			if ( which == 1){
				vm.other.displayLoginBox = ele;

			}
		};

	}

})();