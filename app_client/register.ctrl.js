(function () {
	angular
		.module ('posApp')
		.controller ('RegisterCtrl', ['$location', 'authentication', RegisterCtrl])


	function RegisterCtrl ($location, authentication) {
		var vm = this;
		vm.other = {};

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

		vm.submitRegister = function (){
			authentication.register (vm.credentials, vm.registerSuccessAction, vm.registerFailAction);
		};

	}

})();