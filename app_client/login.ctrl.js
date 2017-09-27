(function () {
	angular
		.module ('posApp')
		.controller ('LoginCtrl', ['$route', '$scope', '$location', 'authentication', LoginCtrl])

	function LoginCtrl ($route, $scope, $location, authentication) {
		var LayoutCtrl = $scope.$parent.layout;
		var vm = this;
		vm.model = {};
		vm.ctrl = {};

		vm.model.dom = {
			returnPage: LayoutCtrl.model.dom.returnPage || '/checkin',
		}

		vm.model.user = {
			password: '',
			username: '', // phone or email			
		}

		vm.ctrl.loginSuccessAction = function (data) {
			LayoutCtrl.ctrl.addUser (authentication.getCurUser());
			$location.search ('page', null);
			LayoutCtrl.ctrl.updateAfterLogin ();
			$location.path (vm.model.dom.returnPage);			
		};

		vm.ctrl.loginFailAction = function (data) {
			// display message
		};

		vm.ctrl.submitLogin = function (){
			// var query = $location.search();
			// var allowed = query ['allowed']
			authentication.login (vm.model.user, vm.ctrl.loginSuccessAction, vm.ctrl.loginFailAction, allowed);
		};
	}

})();