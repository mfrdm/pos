describe ('Controller: NewOrdersCtrl', function (){
	var CustomerService,OrderService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;

	beforeEach (module('posApp'));
	beforeEach (inject (
		function ($injector) {

			$httpBackend = $injector.get ('$httpBackend');
			$rootScope = $injector.get ('$rootScope');
			$scope = $rootScope.$new ();

			$window = $injector.get ('$window');
			$location = $injector.get ('$location');
			$route = $injector.get ('$route');

			CustomerService = $injector.get ('CustomerService');
			OrderService = $injector.get ('OrderService');
			DataPassingService = $injector.get ('DataPassingService');
			authentication = $injector.get ('authentication')

			var $controller = $injector.get ('$controller');

			// checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

			createController = function () {
				return 	$controller ('NewOrdersCtrl', {
					DataPassingService: DataPassingService, 
					OrderService: OrderService,
					CustomerService: CustomerService,
					$scope: $scope, 
					$window: $window, 
					$route: $route,
				});
			};
			createLayout = function(){
				return $controller('LayoutCtrl',{
					$rootScope : $rootScope, 
					$scope : $scope,
					$window : $window,
					$location : $location,
					authentication : authentication,
					DataPassingService : DataPassingService
				})
			}
		}
	));

	afterEach (inject (function ($httpBackend){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	describe ('Toggle make order form', function(){

		it ('should hide order form by default', function(){
			var layout = createLayout();
			var vm = createController();
			expect(vm.model.dom.orderDiv).toBeFalsy()
		})

		it ('should open order form if hidden', function(){
			var layout = createLayout();
			var vm = createController();
			vm.model.dom.orderDiv = false;
			vm.ctrl.toggleOrderDiv();
			expect(vm.model.dom.orderDiv).toBeTruthy()
		})

		it ('should close order form if shown', function(){
			var layout = createLayout();
			var vm = createController();
			vm.model.dom.orderDiv = true;
			vm.ctrl.toggleOrderDiv();
			expect(vm.model.dom.orderDiv).toBeFalsy()
		})
	})

})