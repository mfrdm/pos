describe ('Controller: NewCheckinCtrl', function (){
	var CheckinService, OrderService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route;

	var occupancyList = [
	{ "_id" : "59253a1d466e685c1733834d", "staffId" : "591ab5b1a77c813f4afd644a", "updateAt" : [ ], "status" : 1, "location" : { "_id" : "59203df203b00119ac8d77ff", "name" : "Green Space Chùa Láng" }, "customer" : { "fullname" : "BÙI QUANG SƠN", "_id" : "5924168b164cb9030cee9386", "phone" : "0968099369", "email" : "quangson98.fsc@gmail.com", "isStudent" : true }, "orders" : [ ], "promocodes" : [ ], "service" : { "name" : "individual common", "price" : 15000 }, "checkinTime" : "2017-05-24T07:45:29.971Z", "total" : 0, "__v" : 0 },
	{ "_id" : "59263d72a74493116b6fe1ab", "staffId" : "591ab5b1a77c813f4afd644a", "updateAt" : [ ], "status" : 1, "location" : { "_id" : "59203df203b00119ac8d77ff", "name" : "Green Space Chùa Láng" }, "customer" : { "fullname" : "LÊ DUY KHÁNH", "_id" : "5924168b164cb9030cee9368", "phone" : "0968180934", "email" : "khanh.leduy.bav@gmail.com", "isStudent" : false }, "orders" : [ ], "promocodes" : [ ], "service" : { "name" : "individual common", "price" : 15000 }, "checkinTime" : "2017-05-25T02:12:01.420Z", "total" : 0, "__v" : 0 }
	]

	beforeEach (module('posApp'));
	beforeEach (inject (
		function ($injector) {

			$httpBackend = $injector.get ('$httpBackend');
			$rootScope = $injector.get ('$rootScope');
			$scope = $rootScope.$new ();

			$window = $injector.get ('$window');
			$route = $injector.get ('$route');

			CheckinService = $injector.get ('CheckinService');
			DataPassingService = $injector.get ('DataPassingService');
			OrderService = $injector.get ('OrderService');

			var $controller = $injector.get ('$controller');

			// checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

			// console.info (DataPassingService)

			createController = function () {
				return 	$controller ('NewCheckinCtrl', {
					DataPassingService: DataPassingService, 
					CheckinService: CheckinService,
					OrderService: OrderService,					
					$scope: $scope, 
					$window: $window, 
					$route: $route
				});
			}
		}
	));

	afterEach (inject (function ($httpBackend){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	describe ('Get checked-in list', function (){
		it ('should success fetch check-in list', function(){
			//Get checkin list
			$httpBackend.when ('GET', /\/checkin.*/).respond ({
				data: occupancyList
			});
			var vm = createController();

			// Before get checked in List
			expect(vm.model.checkedinList.data).toEqual([])
			vm.ctrl.getCheckedinList();
			$httpBackend.flush();

			//After get checked in List
			expect(vm.model.checkedinList.data).toBeArray();
		})
		it ('should display message when not found check-in');
	});

	describe ('Check-in', function (){

		describe ('Open check-in form', function (){
			xit ('should show check-in form when click check-in button 1st time');
			xit ('should fetch items and services');
			xit ('should not fetch items and services if already got');			
		});

		describe ('Close check-in form', function (){
			xit ('should hide check-in form when click check-in button 2nd time');
			xit ('should reset order when toogle checkin div')
		});

		describe ('Select service', function (){
			it ('should fetch list of checked-in leader of a group when customer using group private service')
			xit ('should display group list when customer uses group private');		
		})

		describe ('Search a checking-in customer', function (){
			xit ('should show customer search result div when having customer data after searching');
			xit ('should show customer search result div and not found message when having no customer data after searching');
			it ('should hide customer checked-in message when start search a new term');
			it ('should hide customer search result when click check-in button 2nd time');
			xit ('should hide customer search result div when select a customer')
			xit ('should keep customer data in occupancy and order objects when select a customer');
			xit ('should reset search result after select a customer to check-in')
			it ('should hide customer search result div when click out of the div')
			it ('should hide customer search result div when remove all search input')
			it ('should hide it when click check-in button second time');
			xit ('should reset occupancy when toogle checkin div')
			it ('should reset only checkin-div when it is close, not the page (or route)')		
		})

		describe ('Order', function (){
			xit ('should add a item when click "add item"')
			xit ('should reset item data in temporary object after click "add item"')
			xit ('should not allow to add duplicate items')

			xit ('should remove item in check-in form when click delete')
			xit ('should remove item names in temporary object')			
		})

		describe ('Promocodes', function (){
			xit ('should add code when cick "add code"')
			xit ('should not allow to add duplicate codes')
			xit ('should remove code when cick "remove code"')
			it ('should validate and show invalid status when codes are invalid')
			it ('should go to confirm check-in when the code is valid')
			it ('should allow to add only one code at a check-in time')			
		})

		describe ('Confirm checkin', function (){
			xit ('should display confirm modal when user click submit in check-in form and code, if exist, is valid')
			xit ('should update new data in confirm modal when user cancel confirm and then update check-in info')
		});

		describe ('Submit checkin', function (){
			xit ('should checkin success')
			it ('should be invalid and cannot be submitted when customer being checking in are not selected')
		});

		describe ('Order invoice', function (){
			it ('should display order invoice when checked in and customer makes an order')
		});

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