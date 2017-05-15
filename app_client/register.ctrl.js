(function () {
	angular
		.module ('posApp')
		.controller ('RegisterCtrl', ['$location', 'authentication', RegisterCtrl])


	function RegisterCtrl ($location, authentication) {
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

		vm.registerFailAction = function (err){
			// display message
		};

		vm.registerSuccessAction = function (data) {
			// var storeName = 'Green Space Chua Lang 82/70'; // TESTING
			vm.credentials = {};
			$location.search ('page', null);
			LayoutCtrl.ctrl.updateAfterLogin ();
			$location.path (vm.other.returnPage);			
		};

		vm.loginFailAction = function (data) {

		};

		vm.submitRegister = function (){
			authentication.register (vm.credentials, vm.registerSuccessAction, vm.registerFailAction);
		};

	}

})();