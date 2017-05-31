describe ('Controller: NewCheckinCtrl', function (){
	var CheckinService, OrderService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route;

	var occupancyList = [
	{ "_id" : "59253a1d466e685c1733834d", "staffId" : "591ab5b1a77c813f4afd644a", "updateAt" : [ ], "status" : 1, "location" : { "_id" : "59203df203b00119ac8d77ff", "name" : "Green Space Chùa Láng" }, "customer" : { "fullname" : "BÙI QUANG SƠN", "_id" : "5924168b164cb9030cee9386", "phone" : "0968099369", "email" : "quangson98.fsc@gmail.com", "isStudent" : true }, "orders" : [ ], "promocodes" : [ ], "service" : { "name" : "individual common", "price" : 15000 }, "checkinTime" : "2017-05-24T07:45:29.971Z", "total" : 0, "__v" : 0 },
	{ "_id" : "59263d72a74493116b6fe1ab", "staffId" : "591ab5b1a77c813f4afd644a", "updateAt" : [ ], "status" : 1, "location" : { "_id" : "59203df203b00119ac8d77ff", "name" : "Green Space Chùa Láng" }, "customer" : { "fullname" : "LÊ DUY KHÁNH", "_id" : "5924168b164cb9030cee9368", "phone" : "0968180934", "email" : "khanh.leduy.bav@gmail.com", "isStudent" : false }, "orders" : [ ], "promocodes" : [ ], "service" : { "name" : "small group private", "price" : 150000 }, "checkinTime" : "2017-05-25T02:12:01.420Z", "total" : 0, "__v" : 0 }
	]

	var productsList = [
	{ "_id" : "59195b5603476b069405e57e", "name" : "group common", "price" : 15000, "category" : 1, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:40:06.355Z", "__v" : 0 },
	{ "_id" : "59195b6103476b069405e57f", "name" : "individual common", "price" : 15000, "category" : 1, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:40:17.132Z", "__v" : 0 },
	{ "_id" : "59195b8903476b069405e580", "name" : "medium group private", "price" : 250000, "category" : 1, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:40:57.716Z", "__v" : 0 },
	{ "_id" : "59195b9a03476b069405e581", "name" : "small group private", "price" : 150000, "category" : 1, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:41:14.400Z", "__v" : 0 },
	{ "_id" : "59195bd8c3737906af8d083b", "name" : "7up", "price" : 8000, "category" : 2, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:42:16.611Z", "__v" : 0 },
	{ "_id" : "59195beac3737906af8d083c", "name" : "Oishi", "price" : 5000, "category" : 4, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:42:34.366Z", "__v" : 0 },
	]

	var mockServices = [
	{ "_id" : "59195b5603476b069405e57e", "name" : "group common", "price" : 15000, "category" : 1, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:40:06.355Z", "__v" : 0 },
	]

	var mockItems = [
	{ "_id" : "59195bd8c3737906af8d083b", "name" : "7up", "price" : 8000, "category" : 2, "updatedAt" : [ ], "createdAt" : "2017-05-15T07:42:16.611Z", "__v" : 0 },
	]

	var mockOrderline = [ { "_id" : "59195bd8c3737906af8d083b", "productName" : "7up", "price" : 8000, "subTotal" : 8000, "promocodes" : [ ], "quantity" : "1" } ]

	var mockCustomer = [{ "_id" : "5924168b164cb9030cee9308", "__v" : 0, "fullname" : "NGUYỄN LAN HƯƠNG", "firstname" : "HƯƠNG", "lastname" : "NGUYỄN", "middlename" : "LAN", "gender" : 2, "birthday" : "1996-11-28T00:00:00Z", "checkinStatus" : false, "bookings" : [ ], "occupancy" : [ ], "updatedAt" : [ ], "createdAt" : "2017-05-23T11:01:31.411Z", "isStudent" : true, "edu" : [ { "title" : "Sinh viên", "_id" : "5924168b164cb9030cee930a" }, { "school" : "-1", "_id" : "5924168b164cb9030cee9309" } ], "email" : [ "Huong.ftuk53gmail.com" ], "phone" : [ "0915645396" ] }]


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

	xdescribe ('testing', function (){
		it ('should reset change after reload', function (){
			var vm = createController ();
			expect(vm.model.testChange).toEqual ('1234');
			vm.ctrl.reset ();
			expect(vm.model.testChange).toEqual ('xxxx');			
		})

	})

	describe ('Get checked-in list', function (){
		it ('should success fetch check-in list', function(){
			// Get checkin list
			$httpBackend.when ('GET', /\/checkin.*/).respond ({
				data: occupancyList
			});
			var vm = createController();

			// Before get checked in List
			expect(vm.model.checkedinList.data).toEqual([])
			vm.ctrl.getCheckedinList();
			$httpBackend.flush();

			//After get checked in List
			expect(vm.model.checkedinList.data.length).not.toEqual(0);
		})
		it ('should display message when not found check-in', function(){
			// Get checkin list
			$httpBackend.when ('GET', /\/checkin.*/).respond ({
				data: []
			});
			var vm = createController();

			// Before get checked in List
			expect(vm.model.checkinListEachPage.data.length).toEqual(0)
			expect(vm.model.temporary.displayedList.data.length).toEqual(0)
			vm.ctrl.getCheckedinList();
			$httpBackend.flush();

			// After get checked in List
			expect(vm.model.checkinListEachPage.data.length).toEqual(0)
			expect(vm.model.temporary.displayedList.data.length).toEqual(0)
		});

	});

	describe ('Check-in', function (){

		describe ('Open check-in form', function (){
			it ('should show check-in form when click check-in button 1st time', function(){
				var vm = createController();
				// Before click, form should be hidden
				expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
				// Click
				vm.ctrl.toggleCheckInDiv();
				// After click, should open form
				expect(vm.model.dom.checkin.checkinDiv).toBeTruthy();
			});
			it ('should fetch items and services', function(){
				var vm = createController();
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				// Before click, there is no items and services has been loaded yet
				expect(vm.model.dom.checkin.products.length).toEqual(0)
				expect(vm.model.dom.data.selected.services).toBeUndefined()
				expect(vm.model.dom.data.selected.items).toBeUndefined()
				// Click
				vm.ctrl.toggleCheckInDiv();
				$httpBackend.flush();
				// After click, should add products
				expect(vm.model.dom.data.selected.services.length).toBeGreaterThan(0)
				expect(vm.model.dom.data.selected.items.length).toBeGreaterThan(0)
			});
			it ('should not fetch items and services if already got', function(){
				var vm = createController();
				// Assume existing services and items
				vm.model.dom.data.selected.services = mockServices;
				vm.model.dom.data.selected.items = mockItems;
				// Click
				vm.ctrl.toggleCheckInDiv();
				// services and items should remain as mock
				expect(vm.model.dom.data.selected.services.length).toEqual(1)
				expect(vm.model.dom.data.selected.items.length).toEqual(1)
			});			
		});

		describe ('Close check-in form', function (){
			it ('should hide check-in form when click check-in button 2nd time', function(){
				var vm = createController();
				// Before click, form should be showed
				vm.model.dom.checkin.checkinDiv = true;
				// Click
				vm.ctrl.toggleCheckInDiv();
				// After click, should close form
				expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
			});
			it ('should reset order when toogle checkin div', function(){
				var vm = createController();
				vm.model.checkingin.order.orderline  = mockOrderline;
				vm.model.dom.checkin.checkinDiv = true;
				vm.ctrl.toggleCheckInDiv();
				// After click, orderline should be empty, temporary selected items too
				expect(vm.model.checkingin.order.orderline.length).toEqual(0)
				expect(vm.model.temporary.checkin.selectedItems.length).toEqual(0)
			})
		});

		describe ('Select service', function (){
			it ('should fetch list of checked-in leader of a group when customer using group private service', function(){
				
				$httpBackend.when ('GET', /\/checkin.*/).respond ({
					data: occupancyList
				});
				var vm = createController();
				
				vm.ctrl.getCheckedinList();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				$httpBackend.flush();
				vm.model.checkingin.occupancy.service.name = 'small group private'
				vm.ctrl.checkin.getGroupPrivateLeader()

				expect(vm.model.temporary.groupPrivateLeaders.length).toEqual(2)
				expect(vm.model.temporary.groupPrivateLeaders[1].groupName).toEqual('Nhóm riêng 15 / LÊ DUY KHÁNH / khanh.leduy.bav@gmail.com / 0968180934')
			})
			it ('should display group list when customer uses group private', function(){
				var vm = createController();
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				$httpBackend.flush();
				vm.model.checkingin.occupancy.service.name = 'small group private'
				vm.ctrl.checkin.serviceChangeHandler()

				expect(vm.model.dom.checkin.privateGroupLeaderDiv).toBeTruthy();
			});		
		})

		describe ('Search a checking-in customer', function (){
			it ('should show customer search result div when having customer data after searching', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var vm = createController();
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				expect(vm.model.search.checkin.customers.length).toEqual(1)
				expect(vm.model.search.checkin.customers[0].fullname).toEqual('NGUYỄN LAN HƯƠNG')
			});
			it ('should show customer search result div and not found message when having no customer data after searching', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: []
				});
				var vm = createController();
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				expect(vm.model.search.checkin.customers.length).toEqual(0)
				expect(vm.model.dom.checkin.search.message.notFound).toBeTruthy();
			});
			it ('should hide customer checked-in message when start search a new term', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var vm = createController();
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.model.search.checkin.username = '';
				vm.ctrl.checkin.validateSearchInput();
				expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();

				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: []
				});
				vm.model.search.checkin.username = 'jfjfhgfhfuyuygj';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.model.search.checkin.username = '';
				vm.ctrl.checkin.validateSearchInput();
				expect(vm.model.dom.checkin.search.message.notFound).toBeFalsy();
			});
			it ('should hide customer search result when click check-in button 2nd time', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = true;
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.toggleCheckInDiv();
				expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
				expect(vm.model.search.checkin.customers.length).toEqual(0);

			});
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


	xdescribe ('Edit checked-in', function (){
		it ('should get checked-in of selected customer')
		it ('should display confirm when submit edit')
		it ('should update ')
	})

	xdescribe ('Check-out', function (){
		xit ('should select correctly checking out customer')
		xit ('should display confirm when click checkout button')
		it ('should return success message')
		it ('should update checked-in list')
	})

});