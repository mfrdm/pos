describe('Controller: NewCheckinCtrl', function() {
    var CheckinService, OrderService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication, getInvoiceCtrl;

    // Note: anything end with 'List' means an array contains many conditions the test should cover
    // anything start with 'mock' means 1 single example for a single case

    // Occupancy list: with common service[0], private service without parent[1], private service with parent[2], private service with parent, checked out [3];common service with promocodes[4]; [2][3] is child of [1]; will get when getCheckinList
    var occupancyList = [
        { "_id": "593750696548c57de15054c0", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "createdAt": "2017-06-07T01:01:29.925Z", "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "ĐỒNG THỊ THÙY DƯƠNG", "_id": "5924168b164cb9030cee94d9", "phone": "0969094332", "email": "dongthuyduong1210@gmail.com", "isStudent": true }, "orders": [], "promocodes": [], "service": { "name": "individual common", "price": 15000 }, "checkinTime": "2017-06-07T01:01:28.459Z", "paymentMethod": [], "__v": 0 },
        { "_id": "593750776548c57de15054c1", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "createdAt": "2017-06-07T01:01:43.975Z", "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "ĐÀO THỊ THU HÀ", "_id": "5924168b164cb9030cee9305", "phone": "0989669896", "email": "ancol245@gmail.com", "isStudent": false }, "orders": [], "promocodes": [], "service": { "name": "small group private", "price": 150000 }, "checkinTime": "2017-06-07T01:01:42.751Z", "paymentMethod": [], "__v": 0 },
        { "_id": "593750866548c57de15054c2", "staffId": "591ab5b1a77c813f4afd644a", "parent": "593750776548c57de15054c1", "updateAt": [], "createdAt": "2017-06-07T01:01:58.496Z", "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "LÊ QUANG ĐẠT", "_id": "5924168b164cb9030cee942b", "phone": "0945679595", "email": "lequangdat8195@gmail.com", "isStudent": false }, "orders": [], "promocodes": [], "service": { "name": "small group private", "price": 150000 }, "checkinTime": "2017-06-07T01:01:56.707Z", "paymentMethod": [], "__v": 0 },
        { "_id": "5937bd3dc098114b9c27b9f3", "staffId": "591ab5b1a77c813f4afd644a", "parent": "593750776548c57de15054c1", "updateAt": [], "createdAt": "2017-06-07T08:45:49.753Z", "status": 2, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "TRẦN THẢO PHƯƠNG", "_id": "5924168b164cb9030cee9353", "phone": "0981600096", "email": "Tranthaophuong175@gmail.com", "isStudent": true }, "orders": [], "promocodes": [{ "_id": "592e3e0b4eb93492334f27dc", "name": "vfsc", "codeType": 1, "priority": 2 }], "service": { "name": "small group private", "price": 150000 }, "checkinTime": "2017-06-07T08:45:46.819Z", "paymentMethod": [], "__v": 0 },
        { "_id": "59362a0b5bc64a3aef58c202", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "createdAt": "2017-06-06T04:05:31.886Z", "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "VÕ LINH CHI", "_id": "5924168b164cb9030cee937d", "phone": "01644492857", "email": "volinhchi.96@gmail.com", "isStudent": true }, "orders": [], "promocodes": [{ "_id": "592e3e0b4eb93492334f27db", "name": "v02h06", "codeType": 1, "priority": 2 }], "service": { "name": "individual common", "price": 15000 }, "checkinTime": "2017-06-06T04:05:30.396Z", "paymentMethod": [], "__v": 0 }
    ]

    // products list include both services and items; will get when vm.ctrl.checkin.getItems()
    var productsList = [
        { "_id": "59195b5603476b069405e57e", "name": "group common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:06.355Z", "__v": 0 },
        { "_id": "59195b6103476b069405e57f", "name": "individual common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:17.132Z", "__v": 0 },
        { "_id": "59195b8903476b069405e580", "name": "medium group private", "price": 250000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:57.716Z", "__v": 0 },
        { "_id": "59195b9a03476b069405e581", "name": "small group private", "price": 150000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:41:14.400Z", "__v": 0 },
        { "_id": "59195bd8c3737906af8d083b", "name": "7up", "price": 8000, "category": 2, "updatedAt": [], "createdAt": "2017-05-15T07:42:16.611Z", "__v": 0 },
        { "_id": "59195beac3737906af8d083c", "name": "Oishi", "price": 5000, "category": 4, "updatedAt": [], "createdAt": "2017-05-15T07:42:34.366Z", "__v": 0 },
    ]

    // Promocodes from db: [0] promocode for common service; [1] for private; [2] for all
    var promocodesList = [
        { "_id": "592e3e0b4eb93492334f27da", "name": "v01h06", "start": "2017-05-06T17:00:00Z", "end": "2017-06-30T17:00:00Z", "desc": "1 free hour for group or individual common", "codeType": 1, "createdAt": "2017-05-31T03:52:43.392Z", "conflict": [], "override": [], "label": { "vn": "Common - Free 1 giờ" }, "priority": 2, services: ["group common", "individual common"] },
        { "_id": "592e3e0b4eb93492334f27dc", "name": "vfsc", "start": "2017-05-06T17:00:00Z", "end": "2017-12-30T17:00:00Z", "desc": "10 free hours for private rooms. Only for FSC of FTU", "codeType": 1, "createdAt": "2017-05-31T03:52:43.392Z", "conflict": [], "override": [], "label": { "vn": "VIP: FSC FTU - Private - Free 10 giờ" }, "priority": 2, services: ["medium group private", "small group private"] },
        { "_id": "592e3e0b4eb93492334f27dd", "name": "vymcs", "start": "2017-05-06T17:00:00Z", "end": "2017-12-30T17:00:00Z", "desc": "5 free hours for small rooms. Only for FSC of FTU", "codeType": 1, "createdAt": "2017-05-31T03:52:43.392Z", "conflict": [], "override": [], "label": { "vn": "VIP: YMC FTU - Private 15 - Free 5 giờ" }, "priority": 2, services: ['all'] },
    ]

    // OrderlineList: an array contain all kind of orderline: [0]: 1 product, [1]: more than 1 product
    var OrderlineList = [
        [
            { "_id": "59195bd8c3737906af8d083b", "productName": "7up", "price": 8000, "quantity": "1" }
        ],
        [
            { "_id": "59195bd8c3737906af8d083b", "productName": "7up", "price": 8000, "quantity": "2" },
            { "_id": "59195beac3737906af8d083c", "productName": "Oishi", "price": 5000, "quantity": "2" }
        ]
    ]

    // Select one Service; take from productList above
    var mockService = { "_id": "59195b5603476b069405e57e", "name": "group common", "price": 15000, "category": 1, "updatedAt": [], "createdAt": "2017-05-15T07:40:06.355Z", "__v": 0 }

    // Select one Item; take from productList above
    var mockItem = { "_id": "59195bd8c3737906af8d083b", "name": "7up", "price": 8000, "category": 2, "updatedAt": [], "createdAt": "2017-05-15T07:42:16.611Z", "__v": 0 }

    // Select one customer
    var mockCustomer = { "_id": "5924168b164cb9030cee94d9", "__v": 0, "fullname": "ĐỒNG THỊ THÙY DƯƠNG", "firstname": "DƯƠNG", "lastname": "ĐỒNG", "middlename": "THỊ THÙY", "gender": 2, "birthday": "1998-10-12T00:00:00Z", "checkinStatus": true, "bookings": [], "occupancy": ["593750696548c57de15054c0"], "updatedAt": [], "createdAt": "2017-05-23T11:01:31.577Z", "isStudent": true, "edu": [{ "title": "Sinh viên", "_id": "5924168b164cb9030cee94db" }, { "school": "15", "_id": "5924168b164cb9030cee94da" }], "email": ["dongthuyduong1210@gmail.com"], "phone": ["0969094332"] }

    // Return if checkin successfully: vm.model.temporary.justCheckedin after add occupancyId
    var mockSuccessfulCheckin = {
        occupancy: { "_id": "592f88ec475f381f8c34713a", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "createdAt": "2017-06-01T03:24:28.356Z", "status": 1, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "NGUYỄN ĐỨC DUY ", "_id": "5924168b164cb9030cee957b", "phone": "01652404058", "email": "nducduy.vet@gmail.com", "isStudent": true }, "orders": [], "promocodes": [], "service": { "name": "individual common", "price": 15000 }, "checkinTime": "2017-06-01T03:24:27.128Z", "total": 0, "__v": 0 },
        order: { "_id": "592f88ec475f381f8c34713b", "staffId": "591ab5b1a77c813f4afd644a", "occupancyId": "592f88ec475f381f8c34713a", "updateAt": [], "createdAt": "2017-06-01T03:24:28.364Z", "status": 2, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "NGUYỄN ĐỨC DUY ", "_id": "5924168b164cb9030cee957b", "phone": "01652404058", "email": "nducduy.vet@gmail.com" }, "orderline": [{ "_id": "59195beac3737906af8d083c", "productName": "Oishi", "price": 5000, "subTotal": 5000, "promocodes": [], "quantity": "1" }], "total": 5000, "__v": 0 }
    }

    // vm.model.checkingout.occupancy
    var mockInvoice = { "_id": "593750776548c57de15054c1", "staffId": "591ab5b1a77c813f4afd644a", "updateAt": [], "createdAt": "2017-06-07T01:01:43.975Z", "status": 2, "location": { "_id": "59203df203b00119ac8d77ff", "name": "Green Space Chùa Láng" }, "customer": { "fullname": "ĐÀO THỊ THU HÀ", "_id": "5924168b164cb9030cee9305", "phone": "0989669896", "email": "ancol245@gmail.com", "isStudent": false }, "orders": [], "promocodes": [{ "priority": 1, "codeType": 4, "name": "privatediscountprice" }], "service": { "name": "small group private", "price": 150000 }, "checkinTime": "2017-06-07T01:01:42.751Z", "paymentMethod": [], "__v": 0, "note": "", "checkoutTime": "2017-06-07T11:06:53.623Z", "usage": 10.1, "total": 1242000 }


    ////////////////////////////////////////////////////////////////////////////////////
    // vm.model.checkingin.occupancy.service: [0] before select service, [1] final service after add label, price
    var mockSelectedService = [{

    }, {
        "_id": "59195b6103476b069405e57f",
        "name": "individual common",
        "price": 15000,
        "category": 1,
        "__v": 0,
        "updatedAt": [],
        "createdAt": "2017-05-15T07:40:17.132Z",
        "label": "Cá nhân"
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

            ////////////////////////////////////////////////////////////////////////////////////
            // FUNCTIONS

            // Get checkin list
            getCheckinListCtrl = function(vm, occ) { // pass occupancy list want to display
                $httpBackend.when('GET', /\/checkin.*/).respond({
                    data: occ
                });
                vm.ctrl.getCheckedinList();
                $httpBackend.flush();
            }

            // Get invoice when checkout
            getInvoiceCtrl = function(vm, occ) {
                $httpBackend.when('GET', '/checkout/invoice/' + occ._id).respond({
                    data: mockInvoice
                });
                vm.ctrl.checkout.getInvoice(occ);
                $httpBackend.flush();
            }

            // Get products
            getProductsCtrl = function(vm, products){
                $httpBackend.when('GET', '/api/products').respond({
                    data: products
                });
                vm.ctrl.checkin.getItems();
                $httpBackend.flush();
            }

            // Get promocodes
            getPromocodesCtrl = function(vm, codes){
                $httpBackend.when('GET', '/promocodes/').respond({
                    data: codes
                });
                vm.ctrl.checkin.getPromocodes();
                $httpBackend.flush();
            }

            openCheckinDivCtrl = function(vm, codes, products){
                vm.model.dom.checkin.checkinDiv = false;
                $httpBackend.when('GET', '/api/products').respond({
                    data: products
                });
                $httpBackend.when('GET', '/promocodes/').respond({
                    data: codes
                });
                vm.ctrl.openCheckinDiv();
                $httpBackend.flush();
            }

            // Search customer
            searchCustomerCtrl = function(vm, customerArr){
                vm.model.search.checkin.username = 'ĐỒNG THỊ THÙY DƯƠNG'
                
                $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
                    data: customerArr
                });
                vm.ctrl.checkin.searchCustomer()
                $httpBackend.flush();
            }

            // Add code and validate
            addCodeCtrl = function(vm, correctCode){
                $httpBackend.when('GET', /\/checkin\/validate-promotion-code.*/).respond({
                    data: correctCode
                });
                vm.ctrl.checkin.addCode()
                $httpBackend.flush();
            }

            // Open edit form and fetch data
            openEditForm = function(vm, occ, products, codes){
                $httpBackend.when('GET', '/api/products').respond({
                    data: products
                });
                $httpBackend.when('GET', '/promocodes/').respond({
                    data: codes
                });
                vm.ctrl.edit.edit(occ);
                $httpBackend.flush();
            }
        }
    ));

    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    xdescribe('Get checked-in list', function() {
        it('should success fetch check-in list', function() {
            var layout = createLayout();
            var vm = createController();

            // Before get checked in List
            expect(vm.model.checkedinList.data.length).toEqual(0)
            // Get checkin list
            getCheckinListCtrl(vm, occupancyList)
            //After get checked in List
            expect(vm.model.checkedinList.data.length).toEqual(5);
        })
        it('should display message when not found check-in', function() {
            // Get checkin list
            var layout = createLayout();
            var vm = createController();

            // Before get checked in List
            expect(vm.model.checkinListEachPage.data.length).toEqual(0)
            expect(vm.model.temporary.displayedList.data.length).toEqual(0)

            getCheckinListCtrl(vm, [])

            // After get checked in List
            expect(vm.model.checkinListEachPage.data.length).toEqual(0)
            expect(vm.model.temporary.displayedList.data.length).toEqual(0)
        });
    });

    xdescribe('Check-in', function() {

        xdescribe('Open check-in form', function() {
            it('should show check-in form when click check-in button 1st time', function() {
                var layout = createLayout();
                var vm = createController();
                
                // Before click, form should be hidden
                expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
                openCheckinDivCtrl(vm, promocodesList, productsList)
                expect(vm.model.dom.checkin.checkinDiv).toBeTruthy();
            });
            it('should fetch items and services', function() {
                var layout = createLayout();
                var vm = createController();
                
                // Before click, there is no items and services has been loaded yet
                expect(vm.model.dom.checkin.products.length).toEqual(0)
                expect(vm.model.dom.data.selected.services).toBeUndefined()
                expect(vm.model.dom.data.selected.items).toBeUndefined()
                // Click
                vm.ctrl.openCheckinDiv();
                getProductsCtrl(vm, productsList)
                // After click, should add products
                expect(vm.model.dom.data.selected.services.length).toBeGreaterThan(0)
                expect(vm.model.dom.data.selected.items.length).toBeGreaterThan(0)
            });
            it('should not fetch items and services if already got', function() {
                var layout = createLayout();
                var vm = createController();
                // Assume existing services and items
                vm.model.dom.data.selected.services = productsList.slice(0,4);
                vm.model.dom.data.selected.items = productsList.slice(4);
                // Click
                vm.ctrl.openCheckinDiv();
                getProductsCtrl(vm, productsList);
                // services and items should remain as mock
                expect(vm.model.dom.data.selected.services.length).toEqual(4)
                expect(vm.model.dom.data.selected.items.length).toEqual(2)
            });
        });

        xdescribe('Close check-in form', function() {

            it('should hide check-in form when click check-in button 2nd time', function() {
                var layout = createLayout();
                var vm = createController();
                // Before click, form should be showed
                vm.model.dom.checkin.checkinDiv = true;
                // Click
                vm.ctrl.openCheckinDiv();
                // After click, should close form
                expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
            });

            it('should reset order when toogle checkin div', function() {
                var layout = createLayout();
                var vm = createController();
                vm.model.checkingin.order.orderline = OrderlineList;
                vm.model.dom.checkin.checkinDiv = true;
                vm.ctrl.openCheckinDiv();
                // After click, orderline should be empty, temporary selected items too
                expect(vm.model.checkingin.order.orderline.length).toEqual(0)
                expect(vm.model.temporary.checkin.selectedItems.length).toEqual(0)
            });

            it('should reset promocodes when toogle checkin div close', function() {
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.checkin.checkinDiv = true;
                vm.model.temporary.checkin.codeName = promocodesList[0].name
                vm.model.checkingin.occupancy.promocodes = [{ name: promocodesList[0].name, status: 1 }];
                vm.ctrl.openCheckinDiv();
                expect(vm.model.checkingin.occupancy.promocodes).toEqual([]);
                expect(vm.model.temporary.checkin.codeName).toEqual('')
            })

        });

        describe('Select service', function() {

            it('should not select service without selecting customer first', function(){
                var layout = createLayout();
                var vm = createController();

                openCheckinDivCtrl(vm, promocodesList, productsList)

                // Select service
                expect(vm.model.checkingin.occupancy.service).toEqual({})
                vm.ctrl.checkin.serviceChangeHandler();
                expect(vm.model.checkingin.occupancy.service).toEqual({})
            })

            it('should display services list after selecting customer', function(){
                var layout = createLayout();
                var vm = createController();

                openCheckinDivCtrl(vm, promocodesList, productsList)

                // openCheckinDivCtrl(vm, promocodesList, productsList);
                $httpBackend.when('GET', '/api/products').respond({
                    data: productsList
                });
                
                searchCustomerCtrl(vm, [mockCustomer])
                vm.ctrl.checkin.selectCustomer(0);

                $httpBackend.flush();

                expect(vm.model.services.length).toEqual(4)

            })

            it('should fetch list of checked-in leader of a group when customer using group private service', function() {
                var layout = createLayout();
                var vm = createController();

                getCheckinListCtrl(vm, occupancyList)
                openCheckinDivCtrl(vm, promocodesList, productsList)

                vm.model.checkingin.occupancy.service.name = 'small group private'
                vm.ctrl.checkin.getGroupPrivateLeader()

                expect(vm.model.temporary.groupPrivateLeaders.length).toEqual(2)
                expect(vm.model.temporary.groupPrivateLeaders[1].groupName).toEqual('Nhóm riêng 15 / ĐÀO THỊ THU HÀ / ancol245@gmail.com / 0989669896')
            })
            xit('should display group list when customer uses group private', function() {
                var layout = createLayout();
                var vm = createController();

                getCheckinListCtrl(vm, occupancyList)
                openCheckinDivCtrl(vm, promocodesList, productsList)

                vm.model.checkingin.occupancy.service.name = 'small group private'
                vm.ctrl.checkin.serviceChangeHandler()

                expect(vm.model.dom.checkin.privateGroupLeaderDiv).toBeTruthy();
            });
        });

        xdescribe('Search a checking-in customer', function() {

            it('should show customer search result div when having customer data after searching', function() {
                var layout = createLayout();
                var vm = createController();
                searchCustomerCtrl(vm, [mockCustomer])
                expect(vm.model.search.checkin.customers.length).toEqual(1)
                expect(vm.model.search.checkin.customers[0].fullname).toEqual('ĐỒNG THỊ THÙY DƯƠNG')
            })

            it('should show customer search result div and not found message when having no customer data after searching', function() {
                var layout = createLayout();
                var vm = createController();
                searchCustomerCtrl(vm, [])
                expect(vm.model.search.checkin.customers.length).toEqual(0)
                expect(vm.model.dom.checkin.search.message.notFound).toBeTruthy();
            })

            it('should hide customer checked-in message when start search a new term', function() {
                var layout = createLayout();
                var vm = createController();
                searchCustomerCtrl(vm, [mockCustomer])
                vm.model.search.checkin.username = '';
                vm.ctrl.checkin.validateSearchInput();
                expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();

                searchCustomerCtrl(vm, [])
                vm.model.search.checkin.username = '';
                vm.ctrl.checkin.validateSearchInput();
                expect(vm.model.dom.checkin.search.message.notFound).toBeFalsy();
            })

            it('should hide customer search result div when select a customer', function() {
                var layout = createLayout();
                var vm = createController();
                searchCustomerCtrl(vm, [mockCustomer])

                // Select customer after search
                vm.ctrl.checkin.selectCustomer(0);
                expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
            })

            it('should keep customer data in occupancy and order objects when select a customer and reset search result', function() {
                var layout = createLayout();
                var vm = createController();
                searchCustomerCtrl(vm, [mockCustomer])

                // Select customer after search
                vm.ctrl.checkin.selectCustomer(0);

                //Check if customer data in occupancy
                expect(vm.model.checkingin.occupancy.customer.fullname).toEqual('ĐỒNG THỊ THÙY DƯƠNG')
                expect(vm.model.checkingin.order.customer.fullname).toEqual('ĐỒNG THỊ THÙY DƯƠNG')
                expect(vm.model.search.checkin.customers.length).toEqual(0)
            })

            it('should hide customer search result div when remove all search input', function() {
                var layout = createLayout();
                var vm = createController();
                searchCustomerCtrl(vm, [mockCustomer])

                //Empty the search input
                vm.model.search.checkin.username = '';
                vm.ctrl.checkin.validateSearchInput();
                expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
            })
        });

    });

    xdescribe('Order', function() {
        xit('should add a item when click "add item"', function() {
            // Get list items
            var layout = createLayout();
            var vm = createController();
            getProductsCtrl(vm, productsList)

            // Select customer
            searchCustomerCtrl(vm, [mockCustomer])
            vm.ctrl.checkin.selectCustomer(0);

            // Add item
            vm.model.temporary.checkin.item.name = '7up';
            vm.model.temporary.checkin.item.quantity = 1;
            vm.ctrl.checkin.addItem();
            expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up');
            expect(vm.model.checkingin.order.orderline[0].quantity).toEqual(1);
            expect(vm.model.checkingin.order.orderline[0].price).toEqual(8000);
        })

        xit('should reset item data in temporary object after click "add item"', function() {
            // Get list items
            var layout = createLayout();
            var vm = createController();
            getProductsCtrl(vm, productsList)

            // Select customer
            searchCustomerCtrl(vm, [mockCustomer])
            vm.ctrl.checkin.selectCustomer(0);

            // Add item
            vm.model.temporary.checkin.item.name = '7up';
            vm.model.temporary.checkin.item.quantity = 1;
            vm.ctrl.checkin.addItem();

            //should remove temporary
            expect(vm.model.temporary.checkin.item).toEqual({})
        })

        xit('should not allow to add duplicate items', function() {
            // Get list items
            var layout = createLayout();
            var vm = createController();
            getProductsCtrl(vm, productsList)

            // Select customer
            searchCustomerCtrl(vm, [mockCustomer])
            vm.ctrl.checkin.selectCustomer(0);

            // Assume have already item in orderline
            vm.model.temporary.checkin.selectedItems = ['7up']
            vm.model.checkingin.order.orderline = OrderlineList[0];

            // Add item
            vm.model.temporary.checkin.item.name = '7up';
            vm.model.temporary.checkin.item.quantity = 1;
            vm.ctrl.checkin.addItem();

            // should not add
            expect(vm.model.checkingin.order.orderline.length).toEqual(1);
            expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up')
        })
    });

    xdescribe('Promocodes', function() {

        it ('should get codes only choose customer and services', function(){
            var layout = createLayout();
            var vm = createController();
            expect(vm.model.dom.data.selected.checkin.promoteCode.original).toBeUndefined()
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes.length).toEqual(0)
            // Open checkin form
            openCheckinDivCtrl(vm, promocodesList, productsList);
            expect(vm.model.dom.data.selected.checkin.promoteCode.original.length).toEqual(3)
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes.length).toEqual(0)
            // not select customer to checkin yet
            expect(vm.model.dom.data.selected.checkin.promoteCode.original.length).toEqual(3)
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes.length).toEqual(0)
            
        })

        it('should show correct type of code for each type of service', function(){
            var layout = createLayout();
            var vm = createController();
            openCheckinDivCtrl(vm, promocodesList, productsList);
            searchCustomerCtrl(vm, [mockCustomer])
            vm.ctrl.checkin.selectCustomer(0);
            // Select service
            vm.model.checkingin.occupancy.service.name = 'individual common'
            
            vm.ctrl.checkin.serviceChangeHandler()
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes.length).toEqual(2)
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].name).toEqual('v01h06')
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].name).toEqual('vymcs')

            // Select service
            vm.model.checkingin.occupancy.service.name = 'medium group private'
            
            vm.ctrl.checkin.serviceChangeHandler()
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes.length).toEqual(2)
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].name).toEqual('vfsc')
            expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].name).toEqual('vymcs')
        })

        it('should add code and display it in added code section when select code. No longer use plus button to add code.', function() {
            var layout = createLayout();
            var vm = createController();
            openCheckinDivCtrl(vm, promocodesList, productsList);
            searchCustomerCtrl(vm, [mockCustomer])
            vm.ctrl.checkin.selectCustomer(0);
            // Select service
            vm.model.checkingin.occupancy.service.name = 'individual common'
            
            vm.ctrl.checkin.serviceChangeHandler()

            // Before select
            expect(vm.model.checkingin.occupancy.promocodes).toEqual([])
            expect(vm.model.temporary.checkin.codeNames).toEqual([])

            vm.model.temporary.checkin.codeName = 'v01h06'
            addCodeCtrl(vm, [vm.model.dom.data.selected.checkin.promoteCode.codes[0]]);
            // Code should be add right after select
            expect(vm.model.checkingin.occupancy.promocodes[0].name).toEqual('v01h06')
            expect(vm.model.temporary.checkin.codeNames).toEqual([vm.model.temporary.checkin.codeName])
        });

        it('should validate and show invalid status when codes are invalid', function() {
            var layout = createLayout();
            var vm = createController();
            openCheckinDivCtrl(vm, promocodesList, productsList);
            searchCustomerCtrl(vm, [mockCustomer])
            vm.ctrl.checkin.selectCustomer(0);
            // Select service
            vm.model.checkingin.occupancy.service.name = 'individual common'
            
            vm.ctrl.checkin.serviceChangeHandler();

            vm.model.temporary.checkin.codeName = 'v01h06'
            addCodeCtrl(vm, [vm.model.dom.data.selected.checkin.promoteCode.codes[0]]);

            expect(vm.model.checkingin.occupancy.promocodes[0].status).toEqual(3)
        })

        it('should delete code when click delete button', function() {
            var layout = createLayout();
            var vm = createController();
            openCheckinDivCtrl(vm, promocodesList, productsList);
            searchCustomerCtrl(vm, [mockCustomer])
            vm.ctrl.checkin.selectCustomer(0);
            // Select service
            vm.model.checkingin.occupancy.service.name = 'individual common'
            
            vm.ctrl.checkin.serviceChangeHandler();

            vm.model.temporary.checkin.codeName = 'v01h06'
            addCodeCtrl(vm, [vm.model.dom.data.selected.checkin.promoteCode.codes[0]]);

            vm.ctrl.checkin.removeCode();
            expect(vm.model.checkingin.occupancy.promocodes).toEqual([])
            expect(vm.model.temporary.checkin.codeName).toEqual('')
        })
    });

    xdescribe('Edit', function() {

        xit('should fetch data occupancy to editing occupancy', function() {
            var layout = createLayout();
            var vm = createController();
            openEditForm(vm, occupancyList[0], productsList, promocodesList)
            expect(vm.model.dom.checkInEditDiv).toBeTruthy();
            expect(vm.model.edit.occupancy.customer.fullname).toEqual('ĐỒNG THỊ THÙY DƯƠNG')
            expect(vm.model.edit.occupancy.customer.phone).toEqual('0969094332')
            expect(vm.model.edit.occupancy.customer.email).toEqual('dongthuyduong1210@gmail.com')
            expect(vm.model.edit.occupancy.service.name).toEqual('individual common')

            openEditForm(vm, occupancyList[4], productsList, promocodesList)
            expect(vm.model.dom.checkInEditDiv).toBeTruthy();
            expect(vm.model.edit.occupancy.customer.fullname).toEqual('VÕ LINH CHI')
            expect(vm.model.edit.occupancy.customer.phone).toEqual('01644492857')
            expect(vm.model.edit.occupancy.customer.email).toEqual('volinhchi.96@gmail.com')
            expect(vm.model.edit.occupancy.service.name).toEqual('individual common')
            expect(vm.model.edit.occupancy.promocodes[0].name).toEqual('v02h06')
        })

        xit('should close form and reset editing data when click cancel', function(){
            var layout = createLayout();
            var vm = createController();
            openEditForm(vm, occupancyList[0], productsList, promocodesList)
            vm.ctrl.edit.close();
            expect(vm.model.dom.checkInEditDiv).toBeFalsy();
            expect(vm.model.edit.occupancy).toEqual({})
        })

        xit('should fetch correct service to editing data', function(){
            var layout = createLayout();
            var vm = createController();
            
            openEditForm(vm, occupancyList[0], productsList, promocodesList)
            expect(vm.model.edit.occupancy.service.name).toEqual('individual common')
            expect(vm.model.dom.data.selected.edit.services.length).toEqual(4)
            vm.ctrl.edit.close();
            openEditForm(vm, occupancyList[2], productsList, promocodesList)
            expect(vm.model.edit.occupancy.service.name).toEqual('small group private')
            expect(vm.model.dom.data.selected.edit.services.length).toEqual(4)
        })

        xit('should fetch correct group leader if any', function(){
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm, occupancyList)
            openEditForm(vm, occupancyList[1], productsList, promocodesList)
            expect(vm.model.temporary.groupPrivateLeaders.length).toEqual(2)
            expect(vm.model.temporary.groupPrivateLeaders[0].leader).toEqual('')
            expect(vm.model.temporary.groupPrivateLeaders[1].leader).toEqual('ĐÀO THỊ THU HÀ')
            expect(vm.model.dom.edit.privateGroupLeaderDiv).toBeTruthy();
            expect(vm.model.temporary.edit.selectedGroupPrivate).toEqual({})

            vm.ctrl.edit.close();
            openEditForm(vm, occupancyList[2], productsList, promocodesList)
            expect(vm.model.temporary.groupPrivateLeaders.length).toEqual(2)
            expect(vm.model.temporary.groupPrivateLeaders[0].leader).toEqual('')
            expect(vm.model.temporary.groupPrivateLeaders[1].leader).toEqual('ĐÀO THỊ THU HÀ')
            expect(vm.model.dom.edit.privateGroupLeaderDiv).toBeTruthy();
            expect(vm.model.temporary.edit.selectedGroupPrivate.service.name).toEqual('small group private')

            vm.ctrl.edit.close();
            openEditForm(vm, occupancyList[2], productsList, promocodesList)
            expect(vm.model.temporary.edit.selectedGroupPrivate.service.name).toEqual('small group private')

        })

        xit('should fetch correct codes if any', function(){
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm, occupancyList)
            openEditForm(vm, occupancyList[4], productsList, promocodesList)
            expect(vm.model.temporary.edit.codeName).toEqual('v02h06')
            expect(vm.model.dom.data.selected.edit.promoteCode.codes.length).toEqual(2)
        })

        it('should validate code when select code', function(){
            var layout = createLayout();
            var vm = createController();
            $httpBackend.when('GET', /\/checkin\/validate-promotion-code.*/).respond({
                data: [promocodesList[2]]
            });
            getCheckinListCtrl(vm, occupancyList)
            openEditForm(vm, occupancyList[4], productsList, promocodesList)
            vm.model.temporary.edit.codeName = 'vymcs';
            
            vm.ctrl.edit.addCode();
            $httpBackend.flush();
            expect(vm.model.edit.occupancy.promocodes[0].status).toEqual(3)
        })
    
    })

    // Test add member to checkout with leader
    describe('Show list of checkbox', function() {

        it('should display checkboxes div if occ has private services and no parent', function() {
            var layout = createLayout();
            var vm = createController();
            getInvoiceCtrl(vm, occupancyList[0]); // get invoice from occupancy; no parent, no group
            expect(vm.model.dom.checkboxDiv).toBeFalsy();
            getInvoiceCtrl(vm, occupancyList[1]); // get invoice from occupancy; without parent, with group
            expect(vm.model.dom.checkboxDiv).toBeTruthy();
            getInvoiceCtrl(vm, occupancyList[2]); // get invoice from occupancy; with parent, with group
            expect(vm.model.dom.checkboxDiv).toBeFalsy();
        })

        it('should contain all children occ ids which have the same parent id as checkout occ id', function() {
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm, occupancyList) // get checkin
            getInvoiceCtrl(vm, occupancyList[1]) // get invoice
            expect(vm.model.temporary.availableChildren.length).toEqual(1);
            expect(vm.model.temporary.availableChildren[0]._id).toEqual('593750866548c57de15054c2')
            expect(vm.model.temporary.disableChildren[0]._id).toEqual('5937bd3dc098114b9c27b9f3')
        })

    });

    describe('Add member to the list', function() {

        it('should collect all selected children occ ids and save in an array', function() {
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm, occupancyList) // get checkin
            getInvoiceCtrl(vm, occupancyList[1]) // get invoice
            expect(vm.model.temporary.availableChildren.length).toEqual(1);
            expect(vm.model.temporary.availableChildren[0]._id).toEqual('593750866548c57de15054c2')
        })

    })

    describe('Disable checkboxes represent a checkout customer', function() {

        it('should disable children occ which have been checked out', function() {
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm, occupancyList) // get checkin
            getInvoiceCtrl(vm, occupancyList[1]) // get invoice
            expect(vm.model.temporary.disableChildren.length).toEqual(1);
            expect(vm.model.temporary.disableChildren[0]._id).toEqual('5937bd3dc098114b9c27b9f3')
        })

    })

    describe('Send request includes selected children to server', function() {
        it('should include childrenIdArr in data sent to checkout', function() {
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm, occupancyList) // get checkin
            getInvoiceCtrl(vm, occupancyList[1]) // get invoice
            vm.model.checkingout.occupancy.childrenIdList.push(vm.model.temporary.availableChildren[0]._id); // Assume select all available members
            expect(vm.model.checkingout.occupancy.childrenIdList[0]).toEqual('593750866548c57de15054c2')
        })
    })

});
