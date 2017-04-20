(function () {
	angular
		.module ('posApp')
		.controller ('loginCtrl', ['$location', 'authentication', loginCtrl])


	function loginCtrl ($location, authentication) {
		var vm = this;
		vm.credentials = {
			firstname: '',
			lastname: '',
			password: '',
			username: '', // phone or email
		}

		vm.returnPage = $location.search ().page || '/';

		vm.successAction = function (data){
			console.log (data)
		};

		vm.failAction = function (err){

		};

		vm.submitRegister = function (){
			console.log ('about to submit')
			authentication.register (vm.credentials, vm.successAction, vm.failAction);
		};

		vm.submitLogin = function (){

		}
	}

})();