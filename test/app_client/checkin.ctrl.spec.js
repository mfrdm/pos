xdescribe ('Controller: CheckinCtrl', function (){
	var CheckinService, $scope, createController, $rootScope, $httpBackend, dataPassingService, $window, $route;

	beforeEach (module('posApp'));
	beforeEach (inject (
		function ($injector) {
			$httpBackend = $injector.get ('$httpBackend');
			$rootScope = $injector.get ('$rootScope');
			$scope = $rootScope.$new ();
			$window = $injector.get ('$window');
			$route = $injector.get ($route)
			CheckinService = $injector.get ('CheckinService');

			var $controller = $injector.get ('$controller');

			// checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

			createController = function () {
				return 	$controller ('CheckinCtrl', {
					dataPassingService: dataPassingService, 
					$scope: $scope, 
					$window: $window, 
					$route: $route, 
					CheckinService: CheckinService
				});
			}

		}
	));

	afterEach (inject (function ($httpBackend){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	xdescribe ('Get checked-in list', function (){
		it ('should success fetch check-in list')
		it ('should display message when not found check-in');
	});

	describe ('Check-in', function (){
		xit ('should show check-in form when click check-in button 1st time');
		xit ('should hide check-in form when click check-in button 2nd time');
		xit ('should show customer search result div when having customer data after searching');
		it ('should show customer search result div and not found message when having no customer data after searching');
		it ('should show customer search result div and checked-in message when having customer data after searching but already checked-in');
		it ('should hide customer search result when click check-in button 2nd time');
		it ('should hide customer search result div when select a customer')
		it ('should hide customer search result div when click out of the div')
		it ('should hide customer search result div when remove all search input')
		it ('should hide it when click check-in button second time');
		


	});

	xdescribe ('Check-in', function (){
		it ('should display check-in form when "check-in" btn being clicked', function (){
			expect(true).toEqual (false);
		});

		it ('should submit check-in successfully', function (){

		});
	})

	xdescribe ('Select a user to check-in', function (){
		it ('should hide user table')

		it ('should update checking-in User');

	});

	describe ('Submit check-in', function (){

		it ('should add other data before submit')

		it ('should calculate total correctly', function (){
			var ctrl = createController ();
			var orderline = [
				{
					productName: 'Common',
					quantity: 1,
				},
				{
					productName: 'Coca Cola',
					quantity: 1,
				},				
			];

			var total = ctrl.getTotal (orderline);
			
			expect (total).toEqual (ctrl.data.services['Common'].price * 1 + ctrl.data.otherItems['Coca Cola'].price * 1)
		})
	});

});