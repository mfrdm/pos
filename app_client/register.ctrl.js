(function () {
	angular
		.module ('posApp')
		.controller ('RegisterCtrl', ['$scope', '$location', 'authentication', RegisterCtrl])


	function RegisterCtrl ($scope, $location, authentication) {
		var vm = this;
		var LayoutCtrl = $scope.$parent.layout;
		vm.model = {};
		vm.ctrl = {};
		vm.model.user = {
			firstname: '',
			lastname: '',
			middlename: '',
			email: '',
			birthday: '',
			gender: '',
			phone: '',
			password: '',
			username: '', // phone or email			
		}

		vm.model.dom = {
			returnPage: LayoutCtrl.model.dom.returnPage || '/checkin',
		}

		vm.ctrl.registerFailAction = function (err){
			// display message
		};

		vm.ctrl.registerSuccessAction = function (data) {
			vm.model.user = {};
			LayoutCtrl.ctrl.addUser (authentication.getCurUser());
			LayoutCtrl.ctrl.updateAfterLogin ();
			$location.path (vm.model.dom.returnPage);			
		};

		vm.ctrl.loginFailAction = function (data) {
			// display warning message
		};

		vm.ctrl.submitRegister = function (){
			authentication.register (vm.model.user, vm.ctrl.registerSuccessAction, vm.ctrl.registerFailAction);
		};

	}

})();