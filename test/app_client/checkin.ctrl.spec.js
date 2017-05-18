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
		xit ('should show customer search result div and not found message when having no customer data after searching');
		it ('should show customer search result div and checked-in message when having customer data after searching but already checked-in');
		it ('should hide customer checked-in message when start search a new term');
		it ('should hide customer search result when click check-in button 2nd time');

		xit ('should hide customer search result div when select a customer')
		xit ('should keep customer data in occupancy and order objects when select a customer');
		xit ('should reset search result after select a customer to check-in')

		it ('should hide customer search result div when click out of the div')
		it ('should hide customer search result div when remove all search input')
		it ('should hide it when click check-in button second time');
		
		xit ('should fetch items and services');
		xit ('should not fetch items and services if already got');

		xit ('should add a item when click "add item"')
		xit ('should reset item data in temporary object after click "add item"')
		xit ('should not allow to add duplicate items')

		xit ('should remove item in check-in form when click delete')
		xit ('should remove item names in temporary object')

		xit ('should reset order when toogle checkin div')
		xit ('should reset occupancy when toogle checkin div')
		it ('should reset only checkin-div when it is close, not the page (or route)')

		xit ('should add code when cick "add code"')
		xit ('should be invalid when add duplicate code')
		xit ('should remove code when cick "remove code"')
		it ('should validate code before adding code into checking-in form and keep the code in the code input')
		it ('should display warning message when promocode are invalid')
		xit ('should update codes after validate')

		xit ('should display confirm modal when user click submit in check-in form')
		xit ('should update new data in confirm modal when user cancel confirm and update check-in')

		xit ('should return code and add student code when a customer is student')
		xit ('should return code and does not add student code when a customer is not student')


		xit ('should checkin success')
		it ('should be invalid and cannot be submitted when customer being checking in are not selected')

		it ('should route to order page after checkin success if the customer makes an order')

		it ('should fetch list of checked-in leader of a group when customer using group private service')
		xit ('should display group list when customer uses group private')


	});


	describe ('Edit checked-in', function (){
		it ('should get checked-in of selected customer')
		it ('should display confirm when submit edit')
		it ('should update ')
	})

	describe ('Check-out', function (){
		xit ('should select correctly checking out customer')
		xit ('should display confirm when click checkout button')
		it ('should return success message')
		it ('should update checked-in list')
	})

});