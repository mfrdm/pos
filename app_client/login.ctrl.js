(function () {
	angular
		.module ('posApp')
		.controller ('loginCtrl', ['$location', 'authentication', loginCtrl])


	function loginCtrl ($location, authentication) {
		console.log ('in login ctrl')
		var vm = this;

		vm.other.localLoginBoxName = 'loginBox';
		vm.other.localSignupBoxName = 'signupBox';
		vm.other.switch1 = vm.other.localLoginBoxName;

		vm.credentials = {
			firstname: '',
			lastname: '',
			password: '',
			username: '', // phone or email
		}

		vm.returnPage = $location.search ().page || '/';

		vm.successAction = function (data){
			vm.credentials = {};
			$location.search ('page', null);
			$location.path (vm.returnPage);
		};

		vm.failAction = function (err){
			// display message
		};

		vm.submitRegister = function (){
			// authentication.register (vm.credentials, vm.successAction, vm.failAction);
			vm.successAction ();
		};

		vm.submitLogin = function (){

		};

		vm.changeSwitch = function (which) {
			if ( which == 1){
				vm.other.switch1 = vm.other.localSignupBoxName;
			}
		};

	}

})();