describe('Controller: NewOrdersCtrl', function() {
    var CustomerService, OrderService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;

    var mockSearchCustomers = [
        { "_id": "5924168b164cb9030cee9305", "__v": 0, "fullname": "ĐÀO THỊ THU HÀ", "firstname": "HÀ", "lastname": "ĐÀO", "middlename": "THỊ THU", "gender": 2, "birthday": "1997-02-04T00:00:00Z", "checkinStatus": false, "bookings": [], "occupancy": [], "updatedAt": [], "createdAt": "2017-05-23T11:01:31.410Z", "isStudent": false, "edu": [{ "title": "Khác", "_id": "5924168b164cb9030cee9307" }, { "school": "-1", "_id": "5924168b164cb9030cee9306" }], "email": ["ancol245@gmail.com"], "phone": ["0989669896"] },
        { "_id": "5924168b164cb9030cee9308", "__v": 0, "fullname": "NGUYỄN LAN HƯƠNG", "firstname": "HƯƠNG", "lastname": "NGUYỄN", "middlename": "LAN", "gender": 2, "birthday": "1996-11-28T00:00:00Z", "checkinStatus": false, "bookings": [], "occupancy": [], "updatedAt": [], "createdAt": "2017-05-23T11:01:31.411Z", "isStudent": true, "edu": [{ "title": "Sinh viên", "_id": "5924168b164cb9030cee930a" }, { "school": "-1", "_id": "5924168b164cb9030cee9309" }], "email": ["Huong.ftuk53gmail.com"], "phone": ["0915645396"] }
    ]

    var mockProducts = [
        { "_id": "59195b5603476b069405e57e", "name": "group common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:06.355Z", "__v": 0 },
        { "_id": "59195b6103476b069405e57f", "name": "individual common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:17.132Z", "__v": 0 },
        { "_id": "59195b8903476b069405e580", "name": "medium group private", "price": 250000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:57.716Z", "__v": 0 },
        { "_id": "59195b9a03476b069405e581", "name": "small group private", "price": 150000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:41:14.400Z", "__v": 0 },
        { "_id": "59195bd8c3737906af8d083b", "name": "7up", "price": 8000, "category": 2, "updatedAt": [], "createdAt": "2017-05-15T07:42:16.611Z", "__v": 0 },
        { "_id": "59195beac3737906af8d083c", "name": "Oishi", "price": 5000, "category": 4, "updatedAt": [], "createdAt": "2017-05-15T07:42:34.366Z", "__v": 0 },
    ]

    var mockInvoice = {
        "staffId": "591ab5b1a77c813f4afd644a",
        "note": "",
        "occupancyId": "5925003f9b1c8d2a76269733",
        "_id": "5930a32d4853311125b0868d",
        "updateAt": [],
        "createdAt": "2017-06-01T23:28:45.472Z",
        "status": 2,
        "location": {
            "_id": "59203df203b00119ac8d77ff",
            "name": "Green Space Chùa Láng"
        },
        "customer": {
            "fullname": "LÊ NGUYỄN THÁI HÀ",
            "_id": "5924168b164cb9030cee92ea",
            "phone": "01659922233",
            "email": "lenguyenthaiha.1998@gmail.com"
        },
        "orderline": [{
            "_id": "59195bd8c3737906af8d083b",
            "productName": "7up",
            "price": 8000,
            "subTotal": 8000,
            "promocodes": [],
            "quantity": "1",
        }, {
            "_id": "59195beac3737906af8d083c",
            "productName": "Oishi",
            "price": 5000,
            "subTotal": 5000,
            "promocodes": [],
            "quantity": "1",
        }],
        "total": 13000
    }

    var mockConfirm = {
        "__v": 0,
        "staffId": "591ab5b1a77c813f4afd644a",
        "note": "",
        "_id": "5930aa7d90e40215f1309c75",
        "updateAt": [],
        "createdAt": "2017-06-01T23:59:57.507Z",
        "status": 1,
        "location": {
            "_id": "59203df203b00119ac8d77ff",
            "name": "Green Space Chùa Láng"
        },
        "customer": {
            "fullname": "NGUYỄN LINH CHI",
            "_id": "5924168b164cb9030cee92fc",
            "phone": "01653846666",
            "email": "mcc.f5.chinl@gmail.com"
        },
        "orderline": [{
            "_id": "59195bd8c3737906af8d083b",
            "productName": "7up",
            "price": 8000,
            "subTotal": 8000,
            "promocodes": [],
            "quantity": "1"
        }],
        "total": 8000
    }

    var mockOrderList = [{
        "_id": "5930a32d4853311125b0868d",
        "staffId": "591ab5b1a77c813f4afd644a",
        "note": "",
        "occupancyId": "5925003f9b1c8d2a76269733",
        "__v": 0,
        "updateAt": [],
        "createdAt": "2017-06-01T23:28:45.472Z",
        "status": 1,
        "location": {
            "_id": "59203df203b00119ac8d77ff",
            "name": "Green Space Chùa Láng"
        },
        "customer": {
            "fullname": "LÊ NGUYỄN THÁI HÀ",
            "_id": "5924168b164cb9030cee92ea",
            "phone": "01659922233",
            "email": "lenguyenthaiha.1998@gmail.com"
        },
        "orderline": [{
            "_id": "59195bd8c3737906af8d083b",
            "productName": "7up",
            "price": 8000,
            "subTotal": 8000,
            "promocodes": [],
            "quantity": "1",
            "customer": {
                "fullname": "LÊ NGUYỄN THÁI HÀ",
                "phone": "01659922233"
            },
            "createdAt": "2017-06-01T23:28:45.472Z",
            "orderIndex": 0,
            "note": "",
            "$$hashKey": "object:24"
        }, {
            "_id": "59195beac3737906af8d083c",
            "productName": "Oishi",
            "price": 5000,
            "subTotal": 5000,
            "promocodes": [],
            "quantity": "1",
            "customer": {
                "fullname": "LÊ NGUYỄN THÁI HÀ",
                "phone": "01659922233"
            },
            "createdAt": "2017-06-01T23:28:45.472Z",
            "orderIndex": 0,
            "note": "",
            "$$hashKey": "object:25"
        }],
        "total": 13000
    }, {
        "_id": "5930a474def5f51260e59fcd",
        "staffId": "591ab5b1a77c813f4afd644a",
        "occupancyId": "5930a474def5f51260e59fcc",
        "__v": 0,
        "updateAt": [],
        "createdAt": "2017-06-01T23:34:12.631Z",
        "status": 1,
        "location": {
            "_id": "59203df203b00119ac8d77ff",
            "name": "Green Space Chùa Láng"
        },
        "customer": {
            "fullname": "LƯƠNG BẢO PHƯƠNG",
            "_id": "5924168b164cb9030cee9395",
            "phone": "0979544598",
            "email": "phuongbao.fsc@gmail.com"
        },
        "orderline": [{
            "_id": "59195bd8c3737906af8d083b",
            "productName": "7up",
            "price": 8000,
            "subTotal": 8000,
            "promocodes": [],
            "quantity": "1",
            "customer": {
                "fullname": "LƯƠNG BẢO PHƯƠNG",
                "phone": "0979544598"
            },
            "createdAt": "2017-06-01T23:34:12.631Z",
            "orderIndex": 1,
            "$$hashKey": "object:26"
        }],
        "total": 8000
    }]

    beforeEach(module('posApp'));
    beforeEach(inject(
        function($injector) {

            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            $window = $injector.get('$window');
            $location = $injector.get('$location');
            $route = $injector.get('$route');

            CustomerService = $injector.get('CustomerService');
            OrderService = $injector.get('OrderService');
            DataPassingService = $injector.get('DataPassingService');
            authentication = $injector.get('authentication')

            var $controller = $injector.get('$controller');

            // checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

            createController = function() {
                return $controller('NewOrdersCtrl', {
                    DataPassingService: DataPassingService,
                    OrderService: OrderService,
                    CustomerService: CustomerService,
                    $scope: $scope,
                    $window: $window,
                    $route: $route,
                });
            };
            createLayout = function() {
                return $controller('LayoutCtrl', {
                    $rootScope: $rootScope,
                    $scope: $scope,
                    $window: $window,
                    $location: $location,
                    authentication: authentication,
                    DataPassingService: DataPassingService
                })
            }
        }
    ));

    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    xdescribe('Toggle make order form', function() {

        it('should hide order form by default', function() {
            var layout = createLayout();
            var vm = createController();
            expect(vm.model.dom.orderDiv).toBeFalsy()
        })

        it('should open order form if hidden', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.dom.orderDiv = false;
            vm.ctrl.toggleOrderDiv();
            expect(vm.model.dom.orderDiv).toBeTruthy()
        })

        it('should close order form if shown and reset all field, model', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.dom.orderDiv = true;
            vm.ctrl.toggleOrderDiv();
            expect(vm.model.dom.orderDiv).toBeFalsy()
        })

    })

    xdescribe('Search customer', function() {

        it('should show all customer found', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();
            expect(vm.model.dom.order.search.message.notFound).toBeFalsy();
            expect(vm.model.dom.order.customerSearchResult).toBeTruthy()
        })

        it('should show message not found if not found', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: []
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();
            expect(vm.model.dom.order.search.message.notFound).toBeTruthy();
            expect(vm.model.dom.order.customerSearchResult).toBeFalsy()
        })

        it('should remove result div if no input', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();
            vm.model.search.order.username = ''
            vm.ctrl.order.clearSearchInput();
            expect(vm.model.search.order.customers.length).toEqual(0)
            expect(vm.model.dom.order.search.message.notFound).toBeFalsy();
            expect(vm.model.dom.order.customerSearchResult).toBeFalsy()

            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: []
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();
            vm.model.search.order.username = ''
            vm.ctrl.order.clearSearchInput();
            expect(vm.model.search.order.customers.length).toEqual(0)
            expect(vm.model.dom.order.search.message.notFound).toBeFalsy();
            expect(vm.model.dom.order.customerSearchResult).toBeFalsy()
        })

    })

    xdescribe('Select Item to make order', function() {

        it('should not add item without customer selected', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();

            // Select customers
            // vm.ctrl.order.selectCustomer(1);

            // Get products from server => vm.model.dom.data.selected.items = mockProducts
            $httpBackend.when('GET', '/api/products').respond({
                data: mockProducts
            });
            vm.ctrl.order.getItems()
            $httpBackend.flush();

            // Select item
            vm.model.temporary.ordering.item.name = '7up';
            vm.model.temporary.ordering.item.quantity = 1;

            // Add item
            vm.ctrl.order.addItem();
            expect(vm.model.temporary.ordering.addedItem.length).toEqual(0)
            expect(vm.model.ordering.orderline.length).toEqual(0)
        })

        it('should not add item without all fields all filled', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();

            // Select customers
            vm.ctrl.order.selectCustomer(1);

            // Get products from server => vm.model.dom.data.selected.items = mockProducts
            $httpBackend.when('GET', '/api/products').respond({
                data: mockProducts
            });
            vm.ctrl.order.getItems()
            $httpBackend.flush();

            // Select item without quantity
            vm.model.temporary.ordering.item.name = '7up';
            // vm.model.temporary.ordering.item.quantity = 1;

            // Add item
            vm.ctrl.order.addItem();
            expect(vm.model.temporary.ordering.addedItem.length).toEqual(0)
            expect(vm.model.ordering.orderline.length).toEqual(0)
        })

        it('should not add item without all fields all filled', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();

            // Select customers
            vm.ctrl.order.selectCustomer(1);

            // Get products from server => vm.model.dom.data.selected.items = mockProducts
            $httpBackend.when('GET', '/api/products').respond({
                data: mockProducts
            });
            vm.ctrl.order.getItems()
            $httpBackend.flush();

            vm.model.temporary.ordering.addedItem.push('7up')
            vm.model.ordering.orderline.push(vm.model.dom.data.selected.items[0])

            // Select item
            vm.model.temporary.ordering.item.name = '7up';
            vm.model.temporary.ordering.item.quantity = 1;

            // Add item - Fail because 7up already added
            vm.ctrl.order.addItem();
            expect(vm.model.temporary.ordering.addedItem.length).toEqual(1)
            expect(vm.model.ordering.orderline.length).toEqual(1)
        })

        it('should remove items if click delete', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();

            // Select customers
            vm.ctrl.order.selectCustomer(1);

            // Get products from server => vm.model.dom.data.selected.items = mockProducts
            $httpBackend.when('GET', '/api/products').respond({
                data: mockProducts
            });
            vm.ctrl.order.getItems()
            $httpBackend.flush();

            // Select item 1
            vm.model.temporary.ordering.item.name = '7up';
            vm.model.temporary.ordering.item.quantity = 1;

            // Add item 1
            vm.ctrl.order.addItem();
            expect(vm.model.temporary.ordering.addedItem.length).toEqual(1)
            expect(vm.model.ordering.orderline.length).toEqual(1)

            // Select item 2
            vm.model.temporary.ordering.item.name = 'Oishi';
            vm.model.temporary.ordering.item.quantity = 1;

            // Add item 2
            vm.ctrl.order.addItem();
            expect(vm.model.temporary.ordering.addedItem.length).toEqual(2)
            expect(vm.model.ordering.orderline.length).toEqual(2)

            // Delete item 1
            vm.ctrl.order.removeItem(0)
            expect(vm.model.temporary.ordering.addedItem.length).toEqual(1)
            expect(vm.model.ordering.orderline.length).toEqual(1)
            expect(vm.model.temporary.ordering.addedItem[0]).toEqual('Oishi')
            expect(vm.model.ordering.orderline[0].productName).toEqual('Oishi')
        })
    })

    xdescribe('Submit form', function() {

        it('should not submit if not filled all fields', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();

            // Select customers
            vm.ctrl.order.selectCustomer(1);

            // Get products from server => vm.model.dom.data.selected.items = mockProducts
            $httpBackend.when('GET', '/api/products').respond({
                data: mockProducts
            });
            vm.ctrl.order.getItems()
            $httpBackend.flush();

            // Select item 1
            vm.model.temporary.ordering.item.name = '7up';
            // vm.model.temporary.ordering.item.quantity = 1;

            // Add item 1
            vm.ctrl.order.addItem();
            expect(vm.model.temporary.ordering.addedItem.length).toEqual(0)
            expect(vm.model.ordering.orderline.length).toEqual(0)

            // Get invoice
            // $httpBackend.when('POST', '/orders/checkout').respond({
            //     data: mockInvoice
            // });
            vm.ctrl.order.getInvoice()
                // $httpBackend.flush();
            expect(vm.model.dom.order.confirm).toBeFalsy()
                // TODO: improve this test
        })

        it('should submit and display confirm div if success', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();

            // Select customers
            vm.ctrl.order.selectCustomer(1);

            // Get products from server => vm.model.dom.data.selected.items = mockProducts
            $httpBackend.when('GET', '/api/products').respond({
                data: mockProducts
            });
            vm.ctrl.order.getItems()
            $httpBackend.flush();

            // Select item 1
            vm.model.temporary.ordering.item.name = '7up';
            vm.model.temporary.ordering.item.quantity = 1;

            // Add item 1
            vm.ctrl.order.addItem();
            // Get invoice
            $httpBackend.when('POST', '/orders/checkout').respond({
                data: mockInvoice
            });
            vm.ctrl.order.getInvoice()
            $httpBackend.flush();
            expect(vm.model.dom.order.confirm).toBeTruthy()
        })

        it('should enough info in invoice', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.order.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.order.searchCustomer();
            $httpBackend.flush();

            // Select customers
            vm.ctrl.order.selectCustomer(1);

            // Get products from server => vm.model.dom.data.selected.items = mockProducts
            $httpBackend.when('GET', '/api/products').respond({
                data: mockProducts
            });
            vm.ctrl.order.getItems()
            $httpBackend.flush();

            // Select item 1
            vm.model.temporary.ordering.item.name = '7up';
            vm.model.temporary.ordering.item.quantity = 1;

            // Add item 1
            vm.ctrl.order.addItem();
            // Get invoice
            $httpBackend.when('POST', '/orders/checkout').respond({
                data: mockInvoice
            });
            vm.ctrl.order.getInvoice()
            $httpBackend.flush();
            expect(vm.model.ordering.customer.fullname).toEqual('LÊ NGUYỄN THÁI HÀ')
            expect(vm.model.ordering.orderline.length).toEqual(2)
        })
    })

    xdescribe('Order List', function() {

    	it ('should display all orders', function(){
    		var layout = createLayout();
	        var vm = createController();

	        $httpBackend.when('GET', /\/orders.*/).respond({
	            data: mockOrderList
	        });
	        vm.ctrl.getOrderedList()
	        $httpBackend.flush();

	        expect(vm.model.originalOrderedList.length).toEqual(2)// Original list
	        expect(vm.model.orderedList.length).toEqual(3)// After seperate products from same person
    	})

    	it ('should display no result message div if no orders found', function(){
    		var layout = createLayout();
	        var vm = createController();

	        $httpBackend.when('GET', /\/orders.*/).respond({
	            data: []
	        });
	        vm.ctrl.getOrderedList()
	        $httpBackend.flush();

	        expect(vm.model.dom.data.selected.orderList.body.message.notFound).toBeTruthy()
    	})
        
    })

})
