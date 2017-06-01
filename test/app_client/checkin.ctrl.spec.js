describe ('Controller: NewCheckinCtrl', function (){
	var CheckinService, OrderService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;

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

	var mockPromoteCodes = [
		{ "_id" : "5919e00d8942202eb15aefec", "name" : "free2hourscommon", "start" : "2017-01-01T00:00:00Z", "end" : "2017-12-31T00:00:00Z", "codeType" : 1 },
		{ "_id" : "5919e00d8942202eb15aefed", "name" : "studentprice", "start" : "2017-01-01T00:00:00Z", "end" : "2017-12-31T00:00:00Z", "codeType" : 2 },
		{ "_id" : "5919e00d8942202eb15aefee", "name" : "yeugreenspace", "start" : "2017-01-01T00:00:00Z", "end" : "2017-12-31T00:00:00Z", "codeType" : 3 }
	]

	var mockSuccessfulCheckin = {
		occupancy:{ "_id" : "592f88ec475f381f8c34713a", "staffId" : "591ab5b1a77c813f4afd644a", "updateAt" : [ ], "createdAt" : "2017-06-01T03:24:28.356Z", "status" : 1, "location" : { "_id" : "59203df203b00119ac8d77ff", "name" : "Green Space Chùa Láng" }, "customer" : { "fullname" : "NGUYỄN ĐỨC DUY ", "_id" : "5924168b164cb9030cee957b", "phone" : "01652404058", "email" : "nducduy.vet@gmail.com", "isStudent" : true }, "orders" : [ ], "promocodes" : [ ], "service" : { "name" : "individual common", "price" : 15000 }, "checkinTime" : "2017-06-01T03:24:27.128Z", "total" : 0, "__v" : 0 },
		order:{ "_id" : "592f88ec475f381f8c34713b", "staffId" : "591ab5b1a77c813f4afd644a", "occupancyId" : "592f88ec475f381f8c34713a", "updateAt" : [ ], "createdAt" : "2017-06-01T03:24:28.364Z", "status" : 1, "location" : { "_id" : "59203df203b00119ac8d77ff", "name" : "Green Space Chùa Láng" }, "customer" : { "fullname" : "NGUYỄN ĐỨC DUY ", "_id" : "5924168b164cb9030cee957b", "phone" : "01652404058", "email" : "nducduy.vet@gmail.com" }, "orderline" : [ { "_id" : "59195beac3737906af8d083c", "productName" : "Oishi", "price" : 5000, "subTotal" : 5000, "promocodes" : [ ], "quantity" : "1" } ], "total" : 5000, "__v" : 0 }
	}

	var mockInvoice = {
		"usage": 1,
		"checkoutTime": "2017-06-01T03:47:56.425Z",
		"_id": "592f88ec475f381f8c34713a",
		"__v": 0,
		"createdAt": "2017-06-01T03:24:28.356Z",
		"status": 1,
		"customer": {
		    "fullname": "NGUYỄN ĐỨC DUY ",
		    "_id": "5924168b164cb9030cee957b",
		    "phone": "01652404058",
		    "email": "nducduy.vet@gmail.com",
		    "isStudent": true
		},
		"orders": [],
		"promocodes": [{
		    "name": "studentprice",
		    "codeType": 2
		}],
		"service": {
		    "name": "individual common",
		    "price": 10000,
		    "label": "Cá nhân"
		},
		"checkinTime": "2017-06-01T03:24:27.128Z",
		"total": 10000,
		"note": ""
		}

	beforeEach (module('posApp'));
	beforeEach (inject (
		function ($injector) {

			$httpBackend = $injector.get ('$httpBackend');
			$rootScope = $injector.get ('$rootScope');
			$scope = $rootScope.$new ();

			$window = $injector.get ('$window');
			$location = $injector.get ('$location');
			$route = $injector.get ('$route');

			CheckinService = $injector.get ('CheckinService');
			DataPassingService = $injector.get ('DataPassingService');
			OrderService = $injector.get ('OrderService');
			authentication = $injector.get ('authentication')

			var $controller = $injector.get ('$controller');

			// checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

			createController = function () {
				return 	$controller ('NewCheckinCtrl', {
					DataPassingService: DataPassingService, 
					CheckinService: CheckinService,
					OrderService: OrderService,					
					$scope: $scope, 
					$window: $window, 
					$route: $route
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

	// xdescribe ('testing', function (){
	// 	it ('should reset change after reload', function (){
	// 		var layout = createLayout();
	// 		var vm = createController ();

	// 		expect(vm.model.testChange).toEqual ('1234');
	// 		vm.ctrl.reset ();
	// 		expect(vm.model.testChange).toEqual ('xxxx');			
	// 	})

	// })

	xdescribe ('Get checked-in list', function (){
		it ('should success fetch check-in list', function(){
			// Get checkin list
			$httpBackend.when ('GET', /\/checkin.*/).respond ({
				data: occupancyList
			});
			var layout = createLayout();
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
			var layout = createLayout();
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

	xdescribe ('Check-in', function (){

		describe ('Open check-in form', function (){
			it ('should show check-in form when click check-in button 1st time', function(){
				var layout = createLayout();
				var vm = createController();
				// Before click, form should be hidden
				expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
				// Click
				vm.ctrl.toggleCheckInDiv();
				// After click, should open form
				expect(vm.model.dom.checkin.checkinDiv).toBeTruthy();
			});
			it ('should fetch items and services', function(){
				var layout = createLayout();
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
				var layout = createLayout();
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
				var layout = createLayout();
				var vm = createController();
				// Before click, form should be showed
				vm.model.dom.checkin.checkinDiv = true;
				// Click
				vm.ctrl.toggleCheckInDiv();
				// After click, should close form
				expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
			});
			it ('should reset order when toogle checkin div', function(){
				var layout = createLayout();
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
				var layout = createLayout();
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
				var layout = createLayout();
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
				var layout = createLayout();
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
				var layout = createLayout();
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
				var layout = createLayout();
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
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = true;
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.toggleCheckInDiv();
				expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
				expect(vm.model.search.checkin.customers.length).toEqual(0);

			});
			it ('should hide customer search result div when select a customer', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = true;
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();

				// Select customer after search
				vm.ctrl.checkin.selectCustomer(0);
				expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
			})
			it ('should keep customer data in occupancy and order objects when select a customer', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = true;
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();

				// Select customer after search
				vm.ctrl.checkin.selectCustomer(0);

				//Check if customer data in occupancy
				expect(vm.model.checkingin.occupancy.customer.fullname).toEqual('NGUYỄN LAN HƯƠNG')
				expect(vm.model.checkingin.order.customer.fullname).toEqual('NGUYỄN LAN HƯƠNG')
			});
			it ('should reset search result after select a customer to check-in', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = true;
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();

				// Select customer after search
				vm.ctrl.checkin.selectCustomer(0);

				// customers search array should be empty
				expect(vm.model.search.checkin.customers.length).toEqual(0)
			})
			it ('should hide customer search result div when remove all search input', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = true;
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();

				//Empty the search input
				vm.model.search.checkin.username = '';
				vm.ctrl.checkin.validateSearchInput();
				expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
			})
			
			it ('should reset occupancy, order when toogle checkin div', function(){
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = true;
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();

				// Select customer after search
				vm.ctrl.checkin.selectCustomer(0);

				//reset when toggle
				vm.model.dom.checkin.checkinDiv = true;
				vm.ctrl.toggleCheckInDiv();
				console.info(vm.model.checkingin.occupancy.customer)
				expect(vm.model.checkingin.occupancy.customer).toEqual({})
				expect(vm.model.checkingin.order.orderline.length).toEqual(0)
			})
		})

		describe ('Order', function (){
			it ('should add a item when click "add item"', function(){
				// Get list items
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				$httpBackend.flush();

				// Select customer
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Add item
				vm.model.temporary.checkin.item.name = '7up';
				vm.model.temporary.checkin.item.quantity = 1;
				vm.ctrl.checkin.addItem ();
				expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up');
				expect(vm.model.checkingin.order.orderline[0].quantity).toEqual(1);
				expect(vm.model.checkingin.order.orderline[0].price).toEqual(8000);
			})
			it ('should reset item data in temporary object after click "add item"', function(){
				// Get list items
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				$httpBackend.flush();

				// Select customer
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Add item
				vm.model.temporary.checkin.item.name = '7up';
				vm.model.temporary.checkin.item.quantity = 1;
				vm.ctrl.checkin.addItem ();

				//should remove temporary
				expect(vm.model.temporary.checkin.item).toEqual({})
			})
			it ('should not allow to add duplicate items', function(){
				// Get list items
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				$httpBackend.flush();

				// Select customer
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Assume have already item in orderline
				vm.model.temporary.checkin.selectedItems = ['7up']
				vm.model.checkingin.order.orderline = mockOrderline;

				// Add item
				vm.model.temporary.checkin.item.name = '7up';
				vm.model.temporary.checkin.item.quantity = 1;
				vm.ctrl.checkin.addItem ();

				// should not add
				expect(vm.model.checkingin.order.orderline.length).toEqual(1);
				expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up')
			})

			// xit ('should remove item in check-in form when click delete', function(){
			// 	// Get list items
			// 	$httpBackend.when ('GET', '/api/products').respond ({
			// 		data: productsList
			// 	});
			// 	var layout = createLayout();
			// 	var vm = createController();
			// 	vm.model.dom.checkin.checkinDiv = false;
			// 	vm.ctrl.toggleCheckInDiv()
			// 	$httpBackend.flush();

			// 	// Select customer
			// 	$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
			// 		data: mockCustomer
			// 	});
				
			// 	vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
			// 	vm.ctrl.checkin.searchCustomer();
			// 	$httpBackend.flush();
			// 	vm.ctrl.checkin.selectCustomer(0);

			// 	// Assume have already item in orderline
			// 	vm.model.temporary.checkin.selectedItems = ['7up']
			// 	vm.model.checkingin.order.orderline = mockOrderline;

			// 	// Delete item
			// 	vm.ctrl.checkin.removeItem(0)

			// 	expect(vm.model.checkingin.order.orderline.length).toEqual(0);

			// })
			it ('should remove item names in temporary object and items in orderline', function(){
				// Get list items
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				$httpBackend.flush();

				// Select customer
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Assume have already item in orderline
				vm.model.temporary.checkin.selectedItems = ['7up']
				vm.model.checkingin.order.orderline = mockOrderline;

				// Delete item
				vm.ctrl.checkin.removeItem(0)

				// This tests both remove orderline, and temporary items
				expect(vm.model.checkingin.order.orderline.length).toEqual(0);
				expect(vm.model.temporary.checkin.selectedItems.length).toEqual(0);
				expect(vm.model.temporary.checkin.item).toEqual({})
			})			
		})

		xdescribe ('Promocodes', function (){
			it ('should add code and display it in added code section when select code. No longer use plus button to add code.', function(){
				// Load page
				$httpBackend.when ('GET', /\/checkin.*/).respond ({
					data: occupancyList
				});
				$httpBackend.when ('GET', '/promocodes/').respond ({
					data: mockPromoteCodes
				});
				var layout = createLayout();
				var vm = createController();
				vm.ctrl.getCheckedinList();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				// Select customer
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);
				// Get promotecodes from server
				console.info(vm.model.dom.data.selected.checkin.promoteCode.codes)

				// vm.model.temporary.checkin.codeName = 'testCode';
				// vm.ctrl.checkin.addCode();
			})
			it ('should remove code when cick "remove code"', function(){

			})
			it ('should validate and show invalid status when codes are invalid')
			it ('should go to confirm check-in when the code is valid')
			it ('should allow to add only one code at a check-in time')			
		})

		describe ('Confirm checkin', function (){
			it ('should display confirm modal when user click submit in check-in form and code, if exist, is valid', function(){
				// Load page
				// $httpBackend.when ('GET', /\/checkin.*/).respond ({
				// 	data: occupancyList
				// });
				// $httpBackend.when ('GET', '/promocodes/').respond ({
				// 	data: mockPromoteCodes
				// });
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.ctrl.getCheckedinList();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				// Select customer
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Select service
				vm.model.checkingin.occupancy.service.name = 'individual common'
				vm.ctrl.checkin.serviceChangeHandler()
				vm.ctrl.checkin.confirm();
				expect(vm.model.dom.checkin.confirmDiv).toBeTruthy();

				// TODO: Need to deal with code later

			})
			it ('should update new data in confirm modal when user cancel confirm and then update check-in info', function(){
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.ctrl.getCheckedinList();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				// Select customer
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Select service
				vm.model.checkingin.occupancy.service.name = 'individual common'
				vm.ctrl.checkin.serviceChangeHandler()
				vm.ctrl.checkin.confirm();

				vm.ctrl.checkin.cancel();
				// Reselect
				vm.model.checkingin.occupancy.service.name = 'group common'
				vm.ctrl.checkin.serviceChangeHandler()
				vm.ctrl.checkin.confirm();

				expect(vm.model.checkingin.occupancy.service.name).toEqual('group common')
			})
		});

		describe ('Submit checkin', function (){
			it ('should checkin success', function(){
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.ctrl.getCheckedinList();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				// Select customer
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Select service
				vm.model.checkingin.occupancy.service.name = 'individual common'
				vm.ctrl.checkin.serviceChangeHandler()
				vm.ctrl.checkin.confirm();

				// Check in
				$httpBackend.when ('POST', '/checkin/customer/5924168b164cb9030cee9308').respond ({
					data: mockSuccessfulCheckin
				});
				vm.ctrl.checkin.checkin()
				$httpBackend.flush();
				expect(vm.model.temporary.justCheckedin).toBeDefined()
			})
			xit ('should be invalid and cannot be submitted when customer being checking in are not selected', function(){
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.ctrl.getCheckedinList();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				// Select customer
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();

				// Select service
				vm.model.checkingin.occupancy.service.name = 'individual common'
				vm.ctrl.checkin.serviceChangeHandler()
				vm.ctrl.checkin.confirm();

				// Check in
				$httpBackend.when ('POST', '/checkin/customer/5924168b164cb9030cee9308').respond ({
					data: mockSuccessfulCheckin
				});
				vm.ctrl.checkin.checkin()
				$httpBackend.flush();
				expect(vm.model.temporary.justCheckedin).toBeUndefined()
			})
		});

		describe ('Order invoice', function (){
			it ('should display order invoice when checked in and customer makes an order', function(){
				$httpBackend.when ('GET', '/api/products').respond ({
					data: productsList
				});
				$httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
					data: mockCustomer
				});
				var layout = createLayout();
				var vm = createController();
				vm.ctrl.getCheckedinList();
				vm.model.dom.checkin.checkinDiv = false;
				vm.ctrl.toggleCheckInDiv()
				// Select customer
				vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
				vm.ctrl.checkin.searchCustomer();
				$httpBackend.flush();
				vm.ctrl.checkin.selectCustomer(0);

				// Select service
				vm.model.checkingin.occupancy.service.name = 'individual common'
				vm.ctrl.checkin.serviceChangeHandler()
				vm.ctrl.checkin.confirm();

				// Add item
				vm.model.temporary.checkin.item.name = '7up';
				vm.model.temporary.checkin.item.quantity = 1;
				vm.ctrl.checkin.addItem ();

				// Check in
				$httpBackend.when ('POST', '/checkin/customer/5924168b164cb9030cee9308').respond ({
					data: mockSuccessfulCheckin
				});
				vm.ctrl.checkin.checkin()
				$httpBackend.flush();
				expect(vm.model.temporary.justCheckedin.order.occupancyId).toBeDefined()
			})
		});

	});


	xdescribe ('Edit checked-in', function (){
		it ('should get checked-in of selected customer')
		it ('should display confirm when submit edit')
		it ('should update ')
	})

	xdescribe ('Check-out', function (){
		it ('should select correctly checking out customer', function(){
			// Get checkin list
			var layout = createLayout();
			var vm = createController();
			$httpBackend.when ('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond ({
				data: mockInvoice
			});
			//Select occupancy
			vm.ctrl.checkout.getInvoice(occupancyList[0])
			$httpBackend.flush();
			expect(vm.model.checkingout.occupancy).toBeDefined();

		})
		it ('should display confirm when click checkout button', function(){
			// Get checkin list
			var layout = createLayout();
			var vm = createController();
			$httpBackend.when ('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond ({
				data: mockInvoice
			});
			//Select occupancy
			vm.ctrl.checkout.getInvoice(occupancyList[0])
			$httpBackend.flush();
			expect(vm.model.dom.checkOutDiv).toBeTruthy()
		})
		xit ('should return success message', function(){
			// Get checkin list
			var layout = createLayout();
			var vm = createController();
			$httpBackend.when ('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond ({
				data: mockInvoice
			});
			//Select occupancy
			vm.ctrl.checkout.getInvoice(occupancyList[0])
			$httpBackend.flush();
			$httpBackend.when ('POST', '/checkout').respond ({
				data: 'sucess'
			});
			vm.ctrl.checkout.checkout()
			$httpBackend.flush();
			
		})
		xit ('should update checked-in list', function(){

		})
	})

});