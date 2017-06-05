describe('Controller: NewCheckinCtrl', function() {
    var CheckinService, OrderService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;

    var occupancyList = [
        { "_id": "59253a1d466e685c1733834d", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "BÙI QUANG SƠN", "_id": "5924168b164cb9030cee9386", "phone": "0968099369", "email": "quangson98.fsc@gmail.com", "isStudent": true }, "orders": [], "promocodes": [], "service": { "name": "individual common", "price": 15000 }, "checkinTime": "2017-05-24T07:45:29.971Z", "total": 0, "__v": 0 },
        { "_id": "59263d72a74493116b6fe1ab", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "LÊ DUY KHÁNH", "_id": "5924168b164cb9030cee9368", "phone": "0968180934", "email": "khanh.leduy.bav@gmail.com", "isStudent": false }, "orders": [], "promocodes": [], "service": { "name": "small group private", "price": 150000 }, "checkinTime": "2017-05-25T02:12:01.420Z", "total": 0, "__v": 0 }
    ]

    var productsList = [
        { "_id": "59195b5603476b069405e57e", "name": "group common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:06.355Z", "__v": 0 },
        { "_id": "59195b6103476b069405e57f", "name": "individual common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:17.132Z", "__v": 0 },
        { "_id": "59195b8903476b069405e580", "name": "medium group private", "price": 250000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:57.716Z", "__v": 0 },
        { "_id": "59195b9a03476b069405e581", "name": "small group private", "price": 150000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:41:14.400Z", "__v": 0 },
        { "_id": "59195bd8c3737906af8d083b", "name": "7up", "price": 8000, "category": 2, "updatedAt": [], "createdAt": "2017-05-15T07:42:16.611Z", "__v": 0 },
        { "_id": "59195beac3737906af8d083c", "name": "Oishi", "price": 5000, "category": 4, "updatedAt": [], "createdAt": "2017-05-15T07:42:34.366Z", "__v": 0 },
    ]

    var mockServices = [
        { "_id": "59195b5603476b069405e57e", "name": "group common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:06.355Z", "__v": 0 },
    ]

    var mockxitems = [
        { "_id": "59195bd8c3737906af8d083b", "name": "7up", "price": 8000, "category": 2, "updatedAt": [], "createdAt": "2017-05-15T07:42:16.611Z", "__v": 0 },
    ]

    var mockOrderline = [{ "_id": "59195bd8c3737906af8d083b", "productName": "7up", "price": 8000, "subTotal": 8000, "promocodes": [], "quantxity": "1" }]

    var mockCustomer = [{ "_id": "5924168b164cb9030cee9308", "__v": 0, "fullname": "NGUYỄN LAN HƯƠNG", "firstname": "HƯƠNG", "lastname": "NGUYỄN", "middlename": "LAN", "gender": 2, "birthday": "1996-11-28T00:00:00Z", "checkinStatus": false, "bookings": [], "occupancy": [], "updatedAt": [], "createdAt": "2017-05-23T11:01:31.411Z", "isStudent": true, "edu": [{ "txitle": "Sinh viên", "_id": "5924168b164cb9030cee930a" }, { "school": "-1", "_id": "5924168b164cb9030cee9309" }], "email": ["Huong.ftuk53gmail.com"], "phone": ["0915645396"] }]

    var mockPromoteCodes = [
        { "_id": "592e3e0b4eb93492334f27d5", "services": ["all"], "name": "studentprice", "start": "2017-05-06T17:00:00Z", "end": "2018-05-06T17:00:00Z", "desc": "10,000 VND for common service. Only for student", "codeType": 2, "createdAt": "2017-05-31T03:52:43.392Z", "conflict": [], "override": [], "excluded": true, "label": { "vn": "Common - Giá sinh viên" }, "priorxity": 1 },
        { "_id": "592e3e0b4eb93492334f27d6", "services": ["medium group private", "small group private"], "name": "privatediscountprice", "start": "2017-05-06T17:00:00Z", "end": "2018-05-06T17:00:00Z", "desc": "discount after first hour for private service. Small=120,000. Medium=200,000. Large=450,000.", "codeType": 2, "createdAt": "2017-05-23T15:06:47.822Z", "conflict": [], "override": [], "excluded": true, "label": { "vn": "Private - Giảm giá sau 1 giờ" }, "priorxity": 1 },
		{ "_id": "592e3e0b4eb93492334f27d7", "services": ["group common", "individual common"], "name": "mar05", "start": "2017-05-06T17:00:00Z", "end": "2017-05-31T17:00:00Z", "desc": "1 free hour for group or individual common. Applied to everyone", "codeType": 1, "createdAt": "2017-05-31T03:52:43.392Z", "conflict": [], "override": [], "excluded": false, "label": { "vn": "Common - MAR05" }, "priorxity": 2 },
		{ "_id" : "592e3e0b4eb93492334f27d8", "services" : [ "group common", "individual common" ], "name" : "gs05", "start" : "2017-05-06T17:00:00Z", "end" : "2017-05-31T17:00:00Z", "desc" : "1 free hour for group or individual common. Applied to customers visxit GS in the first week", "codeType" : 1, "createdAt" : "2017-05-31T03:52:43.392Z", "conflict" : [ ], "override" : [ ], "excluded" : false, "label" : { "vn" : "Common - GS05" }, "priorxity" : 2 }
    ]

    var mockSuccessfulCheckin = {
        occupancy: { "_id": "592f88ec475f381f8c34713a", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "createdAt": "2017-06-01T03:24:28.356Z", "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "NGUYỄN ĐỨC DUY ", "_id": "5924168b164cb9030cee957b", "phone": "01652404058", "email": "nducduy.vet@gmail.com", "isStudent": true }, "orders": [], "promocodes": [], "service": { "name": "individual common", "price": 15000 }, "checkinTime": "2017-06-01T03:24:27.128Z", "total": 0, "__v": 0 },
        order: { "_id": "592f88ec475f381f8c34713b", "staffId": "591ab5b1a77c813f4afd644a", "occupancyId": "592f88ec475f381f8c34713a", "updateAt": [], "createdAt": "2017-06-01T03:24:28.364Z", "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "NGUYỄN ĐỨC DUY ", "_id": "5924168b164cb9030cee957b", "phone": "01652404058", "email": "nducduy.vet@gmail.com" }, "orderline": [{ "_id": "59195beac3737906af8d083c", "productName": "Oishi", "price": 5000, "subTotal": 5000, "promocodes": [], "quantxity": "1" }], "total": 5000, "__v": 0 }
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

    var mockSelectedService = {
        "_id": "59195b6103476b069405e57f",
        "name": "individual common",
        "price": 15000,
        "category": 1,
        "__v": 0,
        "updatedAt": [],
        "createdAt": "2017-05-15T07:40:17.132Z",
        "label": "Cá nhân"
    }

    beforeEach(module('posApp'));
    beforeEach(inject(
        function($injector) {

            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            $window = $injector.get('$window');
            $location = $injector.get('$location');
            $route = $injector.get('$route');

            CheckinService = $injector.get('CheckinService');
            DataPassingService = $injector.get('DataPassingService');
            OrderService = $injector.get('OrderService');
            authentication = $injector.get('authentication')

            var $controller = $injector.get('$controller');

            // checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

            createController = function() {
                return $controller('NewCheckinCtrl', {
                    DataPassingService: DataPassingService,
                    CheckinService: CheckinService,
                    OrderService: OrderService,
                    $scope: $scope,
                    $window: $window,
                    $route: $route
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

    // describe ('testing', function (){
    // 	xit ('should reset change after reload', function (){
    // 		var layout = createLayout();
    // 		var vm = createController ();

    // 		expect(vm.model.testChange).toEqual ('1234');
    // 		vm.ctrl.reset ();
    // 		expect(vm.model.testChange).toEqual ('xxxx');			
    // 	})

    // })

    describe('Get checked-in list', function() {
        xit('should success fetch check-in list', function() {
            // Get checkin list
            $httpBackend.when('GET', /\/checkin.*/).respond({
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
        xit('should display message when not found check-in', function() {
            // Get checkin list
            $httpBackend.when('GET', /\/checkin.*/).respond({
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

    describe('Check-in', function() {

        describe('Open check-in form', function() {
            xit('should show check-in form when click check-in button 1st time', function() {
                var layout = createLayout();
                var vm = createController();
                // Before click, form should be hidden
                expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
                // Click
                vm.ctrl.toggleCheckInDiv();
                // After click, should open form
                expect(vm.model.dom.checkin.checkinDiv).toBeTruthy();
            });
            xit('should fetch xitems and services', function() {
                var layout = createLayout();
                var vm = createController();
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                // Before click, there is no xitems and services has been loaded yet
                expect(vm.model.dom.checkin.products.length).toEqual(0)
                expect(vm.model.dom.data.selected.services).toBeUndefined()
                expect(vm.model.dom.data.selected.xitems).toBeUndefined()
                    // Click
                vm.ctrl.toggleCheckInDiv();
                $httpBackend.flush();
                // After click, should add products
                expect(vm.model.dom.data.selected.services.length).toBeGreaterThan(0)
                expect(vm.model.dom.data.selected.xitems.length).toBeGreaterThan(0)
            });
            xit('should not fetch xitems and services if already got', function() {
                var layout = createLayout();
                var vm = createController();
                // Assume existing services and xitems
                vm.model.dom.data.selected.services = mockServices;
                vm.model.dom.data.selected.xitems = mockxitems;
                // Click
                vm.ctrl.toggleCheckInDiv();
                // services and xitems should remain as mock
                expect(vm.model.dom.data.selected.services.length).toEqual(1)
                expect(vm.model.dom.data.selected.xitems.length).toEqual(1)
            });
        });

        describe('Close check-in form', function() {

            xit('should hide check-in form when click check-in button 2nd time', function() {
                var layout = createLayout();
                var vm = createController();
                // Before click, form should be showed
                vm.model.dom.checkin.checkinDiv = true;
                // Click
                vm.ctrl.toggleCheckInDiv();
                // After click, should close form
                expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
            });

            xit('should reset order when toogle checkin div', function() {
                var layout = createLayout();
                var vm = createController();
                vm.model.checkingin.order.orderline = mockOrderline;
                vm.model.dom.checkin.checkinDiv = true;
                vm.ctrl.toggleCheckInDiv();
                // After click, orderline should be empty, temporary selected xitems too
                expect(vm.model.checkingin.order.orderline.length).toEqual(0)
                expect(vm.model.temporary.checkin.selectedxitems.length).toEqual(0)
            });

            xit('should reset promocodes when toogle checkin div close', function() {
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = true;
                vm.model.temporary.checkin.codeName = mockPromoteCodes[0].name
                vm.model.checkingin.occupancy.promocodes = [{ name: mockPromoteCodes[0].name, status: 1 }];
                vm.ctrl.toggleCheckInDiv();
                expect(vm.model.checkingin.occupancy.promocodes).toEqual([]);
                expect(vm.model.temporary.checkin.codeName).toEqual('')
            })
        });

        describe('Select service', function() {
            xit('should fetch list of checked-in leader of a group when customer using group private service', function() {

                $httpBackend.when('GET', /\/checkin.*/).respond({
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
            xit('should display group list when customer uses group private', function() {
                var layout = createLayout();
                var vm = createController();
                $httpBackend.when('GET', '/api/products').respond({
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

        describe('Search a checking-in customer', function() {
            xit('should show customer search result div when having customer data after searching', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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
            xit('should show customer search result div and not found message when having no customer data after searching', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: []
                });
                var layout = createLayout();
                var vm = createController();
                vm.ctrl.checkin.searchCustomer();
                $httpBackend.flush();
                expect(vm.model.search.checkin.customers.length).toEqual(0)
                expect(vm.model.dom.checkin.search.message.notFound).toBeTruthy();
            });
            xit('should hide customer checked-in message when start search a new term', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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

                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: []
                });
                vm.model.search.checkin.username = 'jfjfhgfhfuyuygj';
                vm.ctrl.checkin.searchCustomer();
                $httpBackend.flush();
                vm.model.search.checkin.username = '';
                vm.ctrl.checkin.validateSearchInput();
                expect(vm.model.dom.checkin.search.message.notFound).toBeFalsy();
            });
            xit('should hide customer search result when click check-in button 2nd time', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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
            xit('should hide customer search result div when select a customer', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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
            xit('should keep customer data in occupancy and order objects when select a customer', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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
            xit('should reset search result after select a customer to check-in', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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
            xit('should hide customer search result div when remove all search input', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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

            xit('should reset occupancy, order when toogle checkin div', function() {
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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

        describe('Order', function() {
            xit('should add a xitem when click "add xitem"', function() {
                // Get list xitems
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = false;
                vm.ctrl.toggleCheckInDiv()
                $httpBackend.flush();

                // Select customer
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: mockCustomer
                });

                vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                vm.ctrl.checkin.searchCustomer();
                $httpBackend.flush();
                vm.ctrl.checkin.selectCustomer(0);

                // Add xitem
                vm.model.temporary.checkin.xitem.name = '7up';
                vm.model.temporary.checkin.xitem.quantxity = 1;
                vm.ctrl.checkin.addxitem();
                expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up');
                expect(vm.model.checkingin.order.orderline[0].quantxity).toEqual(1);
                expect(vm.model.checkingin.order.orderline[0].price).toEqual(8000);
            })
            xit('should reset xitem data in temporary object after click "add xitem"', function() {
                // Get list xitems
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = false;
                vm.ctrl.toggleCheckInDiv()
                $httpBackend.flush();

                // Select customer
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: mockCustomer
                });

                vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                vm.ctrl.checkin.searchCustomer();
                $httpBackend.flush();
                vm.ctrl.checkin.selectCustomer(0);

                // Add xitem
                vm.model.temporary.checkin.xitem.name = '7up';
                vm.model.temporary.checkin.xitem.quantxity = 1;
                vm.ctrl.checkin.addxitem();

                //should remove temporary
                expect(vm.model.temporary.checkin.xitem).toEqual({})
            })
            xit('should not allow to add duplicate xitems', function() {
                // Get list xitems
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = false;
                vm.ctrl.toggleCheckInDiv()
                $httpBackend.flush();

                // Select customer
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: mockCustomer
                });

                vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                vm.ctrl.checkin.searchCustomer();
                $httpBackend.flush();
                vm.ctrl.checkin.selectCustomer(0);

                // Assume have already xitem in orderline
                vm.model.temporary.checkin.selectedxitems = ['7up']
                vm.model.checkingin.order.orderline = mockOrderline;

                // Add xitem
                vm.model.temporary.checkin.xitem.name = '7up';
                vm.model.temporary.checkin.xitem.quantxity = 1;
                vm.ctrl.checkin.addxitem();

                // should not add
                expect(vm.model.checkingin.order.orderline.length).toEqual(1);
                expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up')
            })

            // xit ('should remove xitem in check-in form when click delete', function(){
            // 	// Get list xitems
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

            // 	// Assume have already xitem in orderline
            // 	vm.model.temporary.checkin.selectedxitems = ['7up']
            // 	vm.model.checkingin.order.orderline = mockOrderline;

            // 	// Delete xitem
            // 	vm.ctrl.checkin.removexitem(0)

            // 	expect(vm.model.checkingin.order.orderline.length).toEqual(0);

            // })
            xit('should remove xitem names in temporary object and xitems in orderline', function() {
                // Get list xitems
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = false;
                vm.ctrl.toggleCheckInDiv()
                $httpBackend.flush();

                // Select customer
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: mockCustomer
                });

                vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                vm.ctrl.checkin.searchCustomer();
                $httpBackend.flush();
                vm.ctrl.checkin.selectCustomer(0);

                // Assume have already xitem in orderline
                vm.model.temporary.checkin.selectedxitems = ['7up']
                vm.model.checkingin.order.orderline = mockOrderline;

                // Delete xitem
                vm.ctrl.checkin.removexitem(0)

                // This tests both remove orderline, and temporary xitems
                expect(vm.model.checkingin.order.orderline.length).toEqual(0);
                expect(vm.model.temporary.checkin.selectedxitems.length).toEqual(0);
                expect(vm.model.temporary.checkin.xitem).toEqual({})
            })
        })

        describe('Promocodes', function() {

            xit('should add code and display xit in added code section when select code. No longer use plus button to add code.', function() {
                $httpBackend.when('GET', '/promocodes/').respond({
                    data: mockPromoteCodes
                });
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = false;
                vm.ctrl.toggleCheckInDiv()
                $httpBackend.flush();
                // Select customer
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: mockCustomer
                });
                vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                vm.ctrl.checkin.searchCustomer();

                $httpBackend.flush();
                vm.ctrl.checkin.selectCustomer(0);

                // Get promotecodes from server
                console.info(vm.model.dom.data.selected.checkin.promoteCode.codes)

                // should show all codes in selections
                expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].selectedLabel).toEqual('Common - GS05')
                expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].selectedLabel).toEqual('Common - Giá sinh viên')

                // Before select
                expect(vm.model.checkingin.occupancy.promocodes).toEqual([])
                expect(vm.model.temporary.checkin.codeNames).toEqual([])

                vm.model.temporary.checkin.codeName = vm.model.dom.data.selected.checkin.promoteCode.codes[0].name
                vm.ctrl.checkin.addCode();
                // Code should be add right after select
                expect(vm.model.checkingin.occupancy.promocodes).toEqual([{ name: vm.model.temporary.checkin.codeName, status: 1 }])
                expect(vm.model.temporary.checkin.codeNames).toEqual([vm.model.temporary.checkin.codeName])
            });

            xit('should validate and show invalid status when codes are invalid', function() {
                $httpBackend.when('GET', '/promocodes/').respond({
                    data: mockPromoteCodes
                });
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = false;
                vm.ctrl.toggleCheckInDiv()
                $httpBackend.flush();
                // Select customer
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: mockCustomer
                });
                vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                vm.ctrl.checkin.searchCustomer();

                $httpBackend.flush();
                vm.ctrl.checkin.selectCustomer(0);

                // Get promotecodes from server
                console.info(vm.model.dom.data.selected.checkin.promoteCode.codes)

                // should show all codes in selections
                expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].selectedLabel).toEqual('Common - GS05')
                expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].selectedLabel).toEqual('Common - Giá sinh viên')
                expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].selectedLabel).toEqual('Common - MAR05')

                vm.model.temporary.checkin.codeName = vm.model.dom.data.selected.checkin.promoteCode.codes[0].name
                vm.ctrl.checkin.addCode();
            })

            it('should delete code when click delete button', function(){
            	$httpBackend.when('GET', '/promocodes/').respond({
                    data: mockPromoteCodes
                });
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = false;
                vm.ctrl.toggleCheckInDiv()
                $httpBackend.flush();
                // Select customer
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: mockCustomer
                });
                vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                vm.ctrl.checkin.searchCustomer();

                $httpBackend.flush();
                vm.ctrl.checkin.selectCustomer(0);

                // Select a promocodes
                vm.model.temporary.checkin.codeName = vm.model.dom.data.selected.checkin.promoteCode.codes[0].name;
                vm.ctrl.checkin.addCode();

                
                vm.ctrl.checkin.removeCode ();
                console.log(vm.model.checkingin.occupancy.promocodes)
                expect(vm.model.checkingin.occupancy.promocodes).toEqual([])
                expect(vm.model.temporary.checkin.codeName).toEqual('')
            })

            describe('should disable select if customer and service is not selected', function() {
                var layout, vm;
                beforeEach(function() {
                    $httpBackend.when('GET', '/promocodes/').respond({
                        data: mockPromoteCodes
                    });
                    layout = createLayout();
                    vm = createController();
                    vm.model.dom.checkin.checkinDiv = false;
                    vm.ctrl.toggleCheckInDiv()
                    $httpBackend.flush();
                    // Select customer
                    $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                        data: mockCustomer
                    });
                    vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
                    vm.ctrl.checkin.searchCustomer();

                    $httpBackend.flush();
                })

                xit('should disable if no customer select', function() {
                    // Wxithout select customer disable all options
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].disabled).toBeTruthy();
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].disabled).toBeTruthy();
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].disabled).toBeTruthy();
                })

                xit('should disabled if customer selected but no service select', function() {
                    vm.ctrl.checkin.selectCustomer(0); // Select Customer
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].disabled).toBeTruthy();
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].disabled).toBeTruthy();
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].disabled).toBeTruthy();
                })

                xit('should not disable if customer select and service select', function() {
                    vm.ctrl.checkin.selectCustomer(0); // Select Customer
                    vm.model.checkingin.occupancy.service.name = mockSelectedService.name;
                    vm.ctrl.checkin.serviceChangeHandler(); // Select service
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].disabled).toBeFalsy();
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].disabled).toBeFalsy();
                    expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].disabled).toBeFalsy();
                })
            })
        })

        describe('Confirm checkin', function() {
            xit('should display confirm modal when user click submxit in check-in form and code, if exist, is valid', function() {
                // Load page
                // $httpBackend.when ('GET', /\/checkin.*/).respond ({
                // 	data: occupancyList
                // });
                // $httpBackend.when ('GET', '/promocodes/').respond ({
                // 	data: mockPromoteCodes
                // });
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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

                // TODO: Need to deal wxith code later

            })
            xit('should update new data in confirm modal when user cancel confirm and then update check-in info', function() {
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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

        describe('Submxit checkin', function() {
            xit('should checkin success', function() {
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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
                $httpBackend.when('POST', '/checkin/customer/5924168b164cb9030cee9308').respond({
                    data: mockSuccessfulCheckin
                });
                vm.ctrl.checkin.checkin()
                $httpBackend.flush();
                expect(vm.model.temporary.justCheckedin).toBeDefined()
            })
            xit('should be invalid and cannot be submxitted when customer being checking in are not selected', function() {
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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
                $httpBackend.when('POST', '/checkin/customer/5924168b164cb9030cee9308').respond({
                    data: mockSuccessfulCheckin
                });
                vm.ctrl.checkin.checkin()
                $httpBackend.flush();
                expect(vm.model.temporary.justCheckedin).toBeUndefined()
            })
        });

        describe('Order invoice', function() {
            xit('should display order invoice when checked in and customer makes an order', function() {
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
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

                // Add xitem
                vm.model.temporary.checkin.xitem.name = '7up';
                vm.model.temporary.checkin.xitem.quantxity = 1;
                vm.ctrl.checkin.addxitem();

                // Check in
                $httpBackend.when('POST', '/checkin/customer/5924168b164cb9030cee9308').respond({
                    data: mockSuccessfulCheckin
                });
                vm.ctrl.checkin.checkin()
                $httpBackend.flush();
                expect(vm.model.temporary.justCheckedin.order.occupancyId).toBeDefined()
            })
        });

    });


    describe('Edxit checked-in', function() {
        xit('should get checked-in of selected customer')
        xit('should display confirm when submxit edxit')
        xit('should update ')
    })

    describe('Check-out', function() {
        xit('should select correctly checking out customer', function() {
            // Get checkin list
            var layout = createLayout();
            var vm = createController();
            $httpBackend.when('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond({
                data: mockInvoice
            });
            //Select occupancy
            vm.ctrl.checkout.getInvoice(occupancyList[0])
            $httpBackend.flush();
            expect(vm.model.checkingout.occupancy).toBeDefined();

        })
        xit('should display confirm when click checkout button', function() {
            // Get checkin list
            var layout = createLayout();
            var vm = createController();
            $httpBackend.when('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond({
                data: mockInvoice
            });
            //Select occupancy
            vm.ctrl.checkout.getInvoice(occupancyList[0])
            $httpBackend.flush();
            expect(vm.model.dom.checkOutDiv).toBeTruthy()
        })
        xit('should return success message', function() {
            // Get checkin list
            var layout = createLayout();
            var vm = createController();
            $httpBackend.when('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond({
                data: mockInvoice
            });
            //Select occupancy
            vm.ctrl.checkout.getInvoice(occupancyList[0])
            $httpBackend.flush();
            $httpBackend.when('POST', '/checkout').respond({
                data: 'sucess'
            });
            vm.ctrl.checkout.checkout()
            $httpBackend.flush();

        })
        xit('should update checked-in list', function() {

        })
    })

});
