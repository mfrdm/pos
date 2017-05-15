(function (){
	app.controller ('LayoutCtrl', ['$rootScope','$scope', '$location','authentication', LayoutCtrl]);

	function LayoutCtrl ($rootScope, $scope, $location, authentication) {
		$scope.layout = {
			model: {
				dom: {},
				user: {},
				customers: {},
				dept:{},
			},
			ctrl: {},
		};

		$scope.layout.model.user = {

		};

		$scope.layout.model.customers = {

		};		

		$scope.layout.model.company = {
			contact: {
				address: 'Số 70, ngách 82/83, Chùa Láng, Láng Thượng, Đống Đa, Hà Nội',
				fb: 'www.facebook.com/greenspace.cw',
				phone: '(+84) 977 855 594',
				email: 'greenspace.cw@gmail.com'
			},
			name: 'Green Space',
			description: '',
		};

		$scope.layout.model.dept = {
			name: 'Green Space Chùa Láng',
			wifi: {
				name: 'Green Space Chua Lang',
				password: 'greenspace'
			}
		};

		$scope.layout.model.summary = {
			customerNumber: 100, // TESTING
			bookingNumber: 20, // TESTING
			staffNumber: 2, // TESTING
		};		

		$scope.layout.model.dom  = {

		};				

		$scope.layout.loginBtn = true;

		$scope.layout.today = new Date ();
		$scope.layout.notifications = [];
		$scope.layout.style = {};

		$scope.layout.updateAfterLogin = function (storeName) {
			if (!storeName)
				storeName = 'Green Space Chua Lang 82/70';
			$scope.layout.storeName = storeName;
			$scope.layout.accountBtn = true;
			$scope.layout.notiBtn = true;
			$scope.layout.sideBarMenu = true;
			$scope.layout.sideBarMenu = true;
			$scope.layout.commonStatisticBar = true;
			$scope.layout.loginBtn = false;
		};

		$scope.layout.updateMessage = function (message, mode) {
			$scope.layout.message = message;
			$scope.layout.messageMode = mode;
			$scope.layout.messageDiv = true;
		};

		$scope.layout.closeMessageDiv = function (){
			$scope.layout.messageDiv = false;
		}

		$scope.layout.logout = function(){
			var beforeAction = function(){};
			var afterAction = function(){};
			authentication.logout(beforeAction, afterAction)
		}

		// $scope.layout.notiAlert = function(msg){
		// 	console.log(msg)
		// 	$scope.layout.notifications.push(msg)
		// 	$scope.layout.style={color:'red'}
		// 	$rootScope.$digest();
		// 	console.log($scope.layout.notifications)
		// }
		// Socket io=========================================================
		// Get user info for socket io
		// var user = authentication.getCurUser()
		// //Socket function
		// if(user){
		// 	socket.emit('login', {firstname:user.firstname, lastname:user.lastname, email:user.email, phone:user.phone});
		// 	socket.on('handleNoti', function(msg){
		// 		$scope.layout.notiAlert(msg)
		// 	})
		// }
		
		//=========================================================

		angular.element(document).ready(function () {
			$("body").foundation();
			$scope.$apply();
		});		
	}

})();
