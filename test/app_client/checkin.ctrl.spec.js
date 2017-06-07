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
            { "_id": "59195bd8c3737906af8d083b", "productName": "7up", "price": 8000, "subTotal": 8000, "promocodes": [], "quantity": "1" }
        ],
        [
            { "_id": "59195bd8c3737906af8d083b", "productName": "7up", "price": 8000, "subTotal": 16000, "promocodes": [], "quantity": "2" },
            { "_id": "59195beac3737906af8d083c", "productName": "Oishi", "price": 5000, "subTotal": 10000, "promocodes": [], "quantity": "2" }
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

    // var mockEditDataReturn = {
    //     "customer": {
    //         "fullname": "LÊ THỊ DUYÊN",
    //         "_id": "5924168b164cb9030cee9509",
    //         "phone": "0904543572",
    //         "email": "duyenlt.nevents@gmail.com",
    //         "isStudent": true
    //     },
    //     "promocodes": [{
    //         "_id": "592e3e0b4eb93492334f27da",
    //         "name": "v01h06",
    //         "codeType": 1,
    //         "priority": 2,
    //         "override": [],
    //         "services": [
    //             "group common",
    //             "individual common"
    //         ],
    //         "status": 3
    //     }],
    //     "service": {
    //         "_id": "59195b6103476b069405e57f",
    //         "name": "individual common",
    //         "price": 15000,
    //         "category": 1,
    //         "__v": 0,
    //         "updatedAt": [],
    //         "createdAt": "2017-05-15T07:40:17.132Z",
    //         "label": "Cá nhân"
    //     },
    // }

    // var mockBeforeEditData = [{
    //     "customer": {
    //         "fullname": "LÊ THỊ DUYÊN",
    //         "_id": "5924168b164cb9030cee9509",
    //         "phone": "0904543572",
    //         "email": "duyenlt.nevents@gmail.com",
    //         "isStudent": true
    //     },
    //     "promocodes": [],
    //     "service": {
    //         "_id": "59195b6103476b069405e57f",
    //         "name": "group common",
    //         "price": 15000,
    //         "category": 1,
    //         "__v": 0,
    //         "updatedAt": [],
    //         "createdAt": "2017-05-15T07:40:17.132Z",
    //         "label": "Nhóm chung"
    //     },
    // }, {
    //     "customer": {
    //         "fullname": "LÊ THỊ DUYÊN",
    //         "_id": "5924168b164cb9030cee9509",
    //         "phone": "0904543572",
    //         "email": "duyenlt.nevents@gmail.com",
    //         "isStudent": true
    //     },
    //     "promocodes": [],
    //     "parent": "59263d72a74493116b6fe1ab",
    //     "service": {
    //         "_id": "59195b6103476b069405e57f",
    //         "name": "group common",
    //         "price": 15000,
    //         "category": 1,
    //         "__v": 0,
    //         "updatedAt": [],
    //         "createdAt": "2017-05-15T07:40:17.132Z",
    //         "label": "Nhóm chung"
    //     },
    // }]

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
            getCheckinListCtrl = function(vm) {
                $httpBackend.when('GET', /\/checkin.*/).respond({
                    data: occupancyList
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


        }
    ));

    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    // describe ('testing', function (){
    //  it ('should reset change after reload', function (){
    //      var layout = createLayout();
    //      var vm = createController ();

    //      expect(vm.model.testChange).toEqual ('1234');
    //      vm.ctrl.reset ();
    //      expect(vm.model.testChange).toEqual ('xxxx');           
    //  })

    // })

    // describe('Get checked-in list', function() {
    //     it('should success fetch check-in list', function() {
    //         // Get checkin list
    //         $httpBackend.when('GET', /\/checkin.*/).respond({
    //             data: occupancyList
    //         });
    //         var layout = createLayout();
    //         var vm = createController();

    //         // Before get checked in List
    //         expect(vm.model.checkedinList.data).toEqual([])
    //         vm.ctrl.getCheckedinList();
    //         $httpBackend.flush();

    //         //After get checked in List
    //         expect(vm.model.checkedinList.data.length).not.toEqual(0);
    //     })
    //     it('should display message when not found check-in', function() {
    //         // Get checkin list
    //         $httpBackend.when('GET', /\/checkin.*/).respond({
    //             data: []
    //         });
    //         var layout = createLayout();
    //         var vm = createController();

    //         // Before get checked in List
    //         expect(vm.model.checkinListEachPage.data.length).toEqual(0)
    //         expect(vm.model.temporary.displayedList.data.length).toEqual(0)
    //         vm.ctrl.getCheckedinList();
    //         $httpBackend.flush();

    //         // After get checked in List
    //         expect(vm.model.checkinListEachPage.data.length).toEqual(0)
    //         expect(vm.model.temporary.displayedList.data.length).toEqual(0)
    //     });

    // });

    // describe('Check-in', function() {

    //     describe('Open check-in form', function() {
    //         it('should show check-in form when click check-in button 1st time', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             // Before click, form should be hidden
    //             expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
    //             // Click
    //             vm.ctrl.toggleCheckInDiv();
    //             // After click, should open form
    //             expect(vm.model.dom.checkin.checkinDiv).toBeTruthy();
    //         });
    //         it('should fetch items and services', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             // Before click, there is no items and services has been loaded yet
    //             expect(vm.model.dom.checkin.products.length).toEqual(0)
    //             expect(vm.model.dom.data.selected.services).toBeUndefined()
    //             expect(vm.model.dom.data.selected.items).toBeUndefined()
    //                 // Click
    //             vm.ctrl.toggleCheckInDiv();
    //             $httpBackend.flush();
    //             // After click, should add products
    //             expect(vm.model.dom.data.selected.services.length).toBeGreaterThan(0)
    //             expect(vm.model.dom.data.selected.items.length).toBeGreaterThan(0)
    //         });
    //         it('should not fetch items and services if already got', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             // Assume existing services and items
    //             vm.model.dom.data.selected.services = mockServices;
    //             vm.model.dom.data.selected.items = mockitems;
    //             // Click
    //             vm.ctrl.toggleCheckInDiv();
    //             // services and items should remain as mock
    //             expect(vm.model.dom.data.selected.services.length).toEqual(1)
    //             expect(vm.model.dom.data.selected.items.length).toEqual(1)
    //         });
    //     });

    //     describe('Close check-in form', function() {

    //         it('should hide check-in form when click check-in button 2nd time', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             // Before click, form should be showed
    //             vm.model.dom.checkin.checkinDiv = true;
    //             // Click
    //             vm.ctrl.toggleCheckInDiv();
    //             // After click, should close form
    //             expect(vm.model.dom.checkin.checkinDiv).toBeFalsy();
    //         });

    //         it('should reset order when toogle checkin div', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.checkingin.order.orderline = mockOrderline;
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.ctrl.toggleCheckInDiv();
    //             // After click, orderline should be empty, temporary selected items too
    //             expect(vm.model.checkingin.order.orderline.length).toEqual(0)
    //             expect(vm.model.temporary.checkin.selecteditems.length).toEqual(0)
    //         });

    //         it('should reset promocodes when toogle checkin div close', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.model.temporary.checkin.codeName = mockPromoteCodes[0].name
    //             vm.model.checkingin.occupancy.promocodes = [{ name: mockPromoteCodes[0].name, status: 1 }];
    //             vm.ctrl.toggleCheckInDiv();
    //             expect(vm.model.checkingin.occupancy.promocodes).toEqual([]);
    //             expect(vm.model.temporary.checkin.codeName).toEqual('')
    //         })
    //     });

    //     describe('Select service', function() {
    //         it('should fetch list of checked-in leader of a group when customer using group private service', function() {

    //             $httpBackend.when('GET', /\/checkin.*/).respond({
    //                 data: occupancyList
    //             });
    //             var layout = createLayout();
    //             var vm = createController();

    //             vm.ctrl.getCheckedinList();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();
    //             vm.model.checkingin.occupancy.service.name = 'small group private'
    //             vm.ctrl.checkin.getGroupPrivateLeader()

    //             expect(vm.model.temporary.groupPrivateLeaders.length).toEqual(2)
    //             expect(vm.model.temporary.groupPrivateLeaders[1].groupName).toEqual('Nhóm riêng 15 / LÊ DUY KHÁNH / khanh.leduy.bav@gmail.com / 0968180934')
    //         })
    //         it('should display group list when customer uses group private', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();
    //             vm.model.checkingin.occupancy.service.name = 'small group private'
    //             vm.ctrl.checkin.serviceChangeHandler()

    //             expect(vm.model.dom.checkin.privateGroupLeaderDiv).toBeTruthy();
    //         });
    //     })

    //     describe('Search a checking-in customer', function() {
    //         it('should show customer search result div when having customer data after searching', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             expect(vm.model.search.checkin.customers.length).toEqual(1)
    //             expect(vm.model.search.checkin.customers[0].fullname).toEqual('NGUYỄN LAN HƯƠNG')
    //         });
    //         it('should show customer search result div and not found message when having no customer data after searching', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: []
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             expect(vm.model.search.checkin.customers.length).toEqual(0)
    //             expect(vm.model.dom.checkin.search.message.notFound).toBeTruthy();
    //         });
    //         it('should hide customer checked-in message when start search a new term', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.model.search.checkin.username = '';
    //             vm.ctrl.checkin.validateSearchInput();
    //             expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();

    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: []
    //             });
    //             vm.model.search.checkin.username = 'jfjfhgfhfuyuygj';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.model.search.checkin.username = '';
    //             vm.ctrl.checkin.validateSearchInput();
    //             expect(vm.model.dom.checkin.search.message.notFound).toBeFalsy();
    //         });
    //         it('should hide customer search result when click check-in button 2nd time', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.toggleCheckInDiv();
    //             expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
    //             expect(vm.model.search.checkin.customers.length).toEqual(0);

    //         });
    //         it('should hide customer search result div when select a customer', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();

    //             // Select customer after search
    //             vm.ctrl.checkin.selectCustomer(0);
    //             expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
    //         })
    //         it('should keep customer data in occupancy and order objects when select a customer', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();

    //             // Select customer after search
    //             vm.ctrl.checkin.selectCustomer(0);

    //             //Check if customer data in occupancy
    //             expect(vm.model.checkingin.occupancy.customer.fullname).toEqual('NGUYỄN LAN HƯƠNG')
    //             expect(vm.model.checkingin.order.customer.fullname).toEqual('NGUYỄN LAN HƯƠNG')
    //         });
    //         it('should reset search result after select a customer to check-in', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();

    //             // Select customer after search
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // customers search array should be empty
    //             expect(vm.model.search.checkin.customers.length).toEqual(0)
    //         })
    //         it('should hide customer search result div when remove all search input', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();

    //             //Empty the search input
    //             vm.model.search.checkin.username = '';
    //             vm.ctrl.checkin.validateSearchInput();
    //             expect(vm.model.dom.checkin.customerSearchResultDiv).toBeFalsy();
    //         })

    //         it('should reset occupancy, order when toogle checkin div', function() {
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();

    //             // Select customer after search
    //             vm.ctrl.checkin.selectCustomer(0);

    //             //reset when toggle
    //             vm.model.dom.checkin.checkinDiv = true;
    //             vm.ctrl.toggleCheckInDiv();
    //             console.info(vm.model.checkingin.occupancy.customer)
    //             expect(vm.model.checkingin.occupancy.customer).toEqual({})
    //             expect(vm.model.checkingin.order.orderline.length).toEqual(0)
    //         })
    //     })

    //     describe('Order', function() {
    //         it('should add a item when click "add item"', function() {
    //             // Get list items
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();

    //             // Select customer
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });

    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Add item
    //             vm.model.temporary.checkin.item.name = '7up';
    //             vm.model.temporary.checkin.item.quantity = 1;
    //             vm.ctrl.checkin.additem();
    //             expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up');
    //             expect(vm.model.checkingin.order.orderline[0].quantity).toEqual(1);
    //             expect(vm.model.checkingin.order.orderline[0].price).toEqual(8000);
    //         })
    //         it('should reset item data in temporary object after click "add item"', function() {
    //             // Get list items
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();

    //             // Select customer
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });

    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Add item
    //             vm.model.temporary.checkin.item.name = '7up';
    //             vm.model.temporary.checkin.item.quantity = 1;
    //             vm.ctrl.checkin.additem();

    //             //should remove temporary
    //             expect(vm.model.temporary.checkin.item).toEqual({})
    //         })
    //         it('should not allow to add duplicate items', function() {
    //             // Get list items
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();

    //             // Select customer
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });

    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Assume have already item in orderline
    //             vm.model.temporary.checkin.selecteditems = ['7up']
    //             vm.model.checkingin.order.orderline = mockOrderline;

    //             // Add item
    //             vm.model.temporary.checkin.item.name = '7up';
    //             vm.model.temporary.checkin.item.quantity = 1;
    //             vm.ctrl.checkin.additem();

    //             // should not add
    //             expect(vm.model.checkingin.order.orderline.length).toEqual(1);
    //             expect(vm.model.checkingin.order.orderline[0].productName).toEqual('7up')
    //         })

    //         // it ('should remove item in check-in form when click delete', function(){
    //         //  // Get list items
    //         //  $httpBackend.when ('GET', '/api/products').respond ({
    //         //      data: productsList
    //         //  });
    //         //  var layout = createLayout();
    //         //  var vm = createController();
    //         //  vm.model.dom.checkin.checkinDiv = false;
    //         //  vm.ctrl.toggleCheckInDiv()
    //         //  $httpBackend.flush();

    //         //  // Select customer
    //         //  $httpBackend.when ('GET', /\/checkin\/search-customers.*/).respond ({
    //         //      data: mockCustomer
    //         //  });

    //         //  vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //         //  vm.ctrl.checkin.searchCustomer();
    //         //  $httpBackend.flush();
    //         //  vm.ctrl.checkin.selectCustomer(0);

    //         //  // Assume have already item in orderline
    //         //  vm.model.temporary.checkin.selecteditems = ['7up']
    //         //  vm.model.checkingin.order.orderline = mockOrderline;

    //         //  // Delete item
    //         //  vm.ctrl.checkin.removeitem(0)

    //         //  expect(vm.model.checkingin.order.orderline.length).toEqual(0);

    //         // })
    //         it('should remove item names in temporary object and items in orderline', function() {
    //             // Get list items
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();

    //             // Select customer
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });

    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Assume have already item in orderline
    //             vm.model.temporary.checkin.selecteditems = ['7up']
    //             vm.model.checkingin.order.orderline = mockOrderline;

    //             // Delete item
    //             vm.ctrl.checkin.removeitem(0)

    //             // This tests both remove orderline, and temporary items
    //             expect(vm.model.checkingin.order.orderline.length).toEqual(0);
    //             expect(vm.model.temporary.checkin.selecteditems.length).toEqual(0);
    //             expect(vm.model.temporary.checkin.item).toEqual({})
    //         })
    //     })

    //     describe('Promocodes', function() {

    //         it('should add code and display it in added code section when select code. No longer use plus button to add code.', function() {
    //             $httpBackend.when('GET', '/promocodes/').respond({
    //                 data: mockPromoteCodes
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();
    //             // Select customer
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();

    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Get promotecodes from server
    //             console.info(vm.model.dom.data.selected.checkin.promoteCode.codes)

    //             // should show all codes in selections
    //             expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].selectedLabel).toEqual('Common - GS05')
    //             expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].selectedLabel).toEqual('Common - Giá sinh viên')

    //             // Before select
    //             expect(vm.model.checkingin.occupancy.promocodes).toEqual([])
    //             expect(vm.model.temporary.checkin.codeNames).toEqual([])

    //             vm.model.temporary.checkin.codeName = vm.model.dom.data.selected.checkin.promoteCode.codes[0].name
    //             vm.ctrl.checkin.addCode();
    //             // Code should be add right after select
    //             expect(vm.model.checkingin.occupancy.promocodes).toEqual([{ name: vm.model.temporary.checkin.codeName, status: 1 }])
    //             expect(vm.model.temporary.checkin.codeNames).toEqual([vm.model.temporary.checkin.codeName])
    //         });

    //         it('should validate and show invalid status when codes are invalid', function() {
    //             $httpBackend.when('GET', '/promocodes/').respond({
    //                 data: mockPromoteCodes
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();
    //             // Select customer
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();

    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Get promotecodes from server
    //             console.info(vm.model.dom.data.selected.checkin.promoteCode.codes)

    //             // should show all codes in selections
    //             expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].selectedLabel).toEqual('Common - GS05')
    //             expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].selectedLabel).toEqual('Common - Giá sinh viên')
    //             expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].selectedLabel).toEqual('Common - MAR05')

    //             vm.model.temporary.checkin.codeName = vm.model.dom.data.selected.checkin.promoteCode.codes[0].name
    //             vm.ctrl.checkin.addCode();
    //         })

    //         it('should delete code when click delete button', function() {
    //             $httpBackend.when('GET', '/promocodes/').respond({
    //                 data: mockPromoteCodes
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //             $httpBackend.flush();
    //             // Select customer
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();

    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Select a promocodes
    //             vm.model.temporary.checkin.codeName = vm.model.dom.data.selected.checkin.promoteCode.codes[0].name;
    //             vm.ctrl.checkin.addCode();


    //             vm.ctrl.checkin.removeCode();
    //             console.log(vm.model.checkingin.occupancy.promocodes)
    //             expect(vm.model.checkingin.occupancy.promocodes).toEqual([])
    //             expect(vm.model.temporary.checkin.codeName).toEqual('')
    //         })

    //         describe('should disable select if customer and service is not selected', function() {
    //             var layout, vm;
    //             beforeEach(function() {
    //                 $httpBackend.when('GET', '/promocodes/').respond({
    //                     data: mockPromoteCodes
    //                 });
    //                 layout = createLayout();
    //                 vm = createController();
    //                 vm.model.dom.checkin.checkinDiv = false;
    //                 vm.ctrl.toggleCheckInDiv()
    //                 $httpBackend.flush();
    //                 // Select customer
    //                 $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                     data: mockCustomer
    //                 });
    //                 vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //                 vm.ctrl.checkin.searchCustomer();

    //                 $httpBackend.flush();
    //             })

    //             it('should disable if no customer select', function() {
    //                 // Without select customer disable all options
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].disabled).toBeTruthy();
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].disabled).toBeTruthy();
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].disabled).toBeTruthy();
    //             })

    //             it('should disabled if customer selected but no service select', function() {
    //                 vm.ctrl.checkin.selectCustomer(0); // Select Customer
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].disabled).toBeTruthy();
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].disabled).toBeTruthy();
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].disabled).toBeTruthy();
    //             })

    //             it('should not disable if customer select and service select', function() {
    //                 vm.ctrl.checkin.selectCustomer(0); // Select Customer
    //                 vm.model.checkingin.occupancy.service.name = mockSelectedService.name;
    //                 vm.ctrl.checkin.serviceChangeHandler(); // Select service
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[0].disabled).toBeFalsy();
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[1].disabled).toBeFalsy();
    //                 expect(vm.model.dom.data.selected.checkin.promoteCode.codes[2].disabled).toBeFalsy();
    //             })
    //         })
    //     })

    //     describe('Edit', function() {

    //         it('should open edit form when click button edit', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             // Click button
    //             vm.ctrl.edit.edit(mockBeforeEditData[0]);
    //             expect(vm.model.dom.checkInEditDiv).toBeTruthy();
    //         })

    //         it('should close edit form when click cancel', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             // Click button
    //             vm.ctrl.edit.close();
    //             expect(vm.model.dom.checkInEditDiv).toBeFalsy();
    //         })

    //         it('should assign service name, promocodes', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.ctrl.edit.edit(mockBeforeEditData[0]);
    //             expect(vm.model.editedCustomer.service.name).toEqual('group common')
    //         })

    //         it('should assign group leader if have', function() {
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.model.checkedinList.data = occupancyList;
    //             vm.ctrl.checkin.getGroupPrivateLeader()
    //             console.info(vm.model.temporary.groupPrivateLeaders)
    //         })

    //     })

    //     describe('Confirm checkin', function() {
    //         it('should display confirm modal when user click submit in check-in form and code, if exist, is valid', function() {
    //             // Load page
    //             // $httpBackend.when ('GET', /\/checkin.*/).respond ({
    //             //  data: occupancyList
    //             // });
    //             // $httpBackend.when ('GET', '/promocodes/').respond ({
    //             //  data: mockPromoteCodes
    //             // });
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.ctrl.getCheckedinList();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //                 // Select customer
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Select service
    //             vm.model.checkingin.occupancy.service.name = 'individual common'
    //             vm.ctrl.checkin.serviceChangeHandler()
    //             vm.ctrl.checkin.confirm();
    //             expect(vm.model.dom.checkin.confirmDiv).toBeTruthy();

    //             // TODO: Need to deal with code later

    //         })
    //         it('should update new data in confirm modal when user cancel confirm and then update check-in info', function() {
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.ctrl.getCheckedinList();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //                 // Select customer
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Select service
    //             vm.model.checkingin.occupancy.service.name = 'individual common'
    //             vm.ctrl.checkin.serviceChangeHandler()
    //             vm.ctrl.checkin.confirm();

    //             vm.ctrl.checkin.cancel();
    //             // Reselect
    //             vm.model.checkingin.occupancy.service.name = 'group common'
    //             vm.ctrl.checkin.serviceChangeHandler()
    //             vm.ctrl.checkin.confirm();

    //             expect(vm.model.checkingin.occupancy.service.name).toEqual('group common')
    //         })
    //     });

    //     describe('Submit checkin', function() {
    //         it('should checkin success', function() {
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.ctrl.getCheckedinList();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //                 // Select customer
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Select service
    //             vm.model.checkingin.occupancy.service.name = 'individual common'
    //             vm.ctrl.checkin.serviceChangeHandler()
    //             vm.ctrl.checkin.confirm();

    //             // Check in
    //             $httpBackend.when('POST', '/checkin/customer/5924168b164cb9030cee9308').respond({
    //                 data: mockSuccessfulCheckin
    //             });
    //             vm.ctrl.checkin.checkin()
    //             $httpBackend.flush();
    //             expect(vm.model.temporary.justCheckedin).toBeDefined()
    //         })
    //         it('should be invalid and cannot be submitted when customer being checking in are not selected', function() {
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.ctrl.getCheckedinList();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //                 // Select customer
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();

    //             // Select service
    //             vm.model.checkingin.occupancy.service.name = 'individual common'
    //             vm.ctrl.checkin.serviceChangeHandler()
    //             vm.ctrl.checkin.confirm();

    //             // Check in
    //             $httpBackend.when('POST', '/checkin/customer/5924168b164cb9030cee9308').respond({
    //                 data: mockSuccessfulCheckin
    //             });
    //             vm.ctrl.checkin.checkin()
    //             $httpBackend.flush();
    //             expect(vm.model.temporary.justCheckedin).toBeUndefined()
    //         })
    //     });

    //     describe('Order invoice', function() {
    //         it('should display order invoice when checked in and customer makes an order', function() {
    //             $httpBackend.when('GET', '/api/products').respond({
    //                 data: productsList
    //             });
    //             $httpBackend.when('GET', /\/checkin\/search-customers.*/).respond({
    //                 data: mockCustomer
    //             });
    //             var layout = createLayout();
    //             var vm = createController();
    //             vm.ctrl.getCheckedinList();
    //             vm.model.dom.checkin.checkinDiv = false;
    //             vm.ctrl.toggleCheckInDiv()
    //                 // Select customer
    //             vm.model.search.checkin.username = 'NGUYỄN LAN HƯƠNG';
    //             vm.ctrl.checkin.searchCustomer();
    //             $httpBackend.flush();
    //             vm.ctrl.checkin.selectCustomer(0);

    //             // Select service
    //             vm.model.checkingin.occupancy.service.name = 'individual common'
    //             vm.ctrl.checkin.serviceChangeHandler()
    //             vm.ctrl.checkin.confirm();

    //             // Add item
    //             vm.model.temporary.checkin.item.name = '7up';
    //             vm.model.temporary.checkin.item.quantity = 1;
    //             vm.ctrl.checkin.additem();

    //             // Check in
    //             $httpBackend.when('POST', '/checkin/customer/5924168b164cb9030cee9308').respond({
    //                 data: mockSuccessfulCheckin
    //             });
    //             vm.ctrl.checkin.checkin()
    //             $httpBackend.flush();
    //             expect(vm.model.temporary.justCheckedin.order.occupancyId).toBeDefined()
    //         })
    //     });

    // });


    // describe('Edit checked-in', function() {
    //     it('should get checked-in of selected customer')
    //     it('should display confirm when submit edit')
    //     it('should update ')
    // })

    // describe('Check-out', function() {
    //     it('should select correctly checking out customer', function() {
    //         // Get checkin list
    //         var layout = createLayout();
    //         var vm = createController();
    //         $httpBackend.when('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond({
    //             data: mockInvoice
    //         });
    //         //Select occupancy
    //         vm.ctrl.checkout.getInvoice(occupancyList[0])
    //         $httpBackend.flush();
    //         expect(vm.model.checkingout.occupancy).toBeDefined();

    //     })
    //     it('should display confirm when click checkout button', function() {
    //         // Get checkin list
    //         var layout = createLayout();
    //         var vm = createController();
    //         $httpBackend.when('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond({
    //             data: mockInvoice
    //         });
    //         //Select occupancy
    //         vm.ctrl.checkout.getInvoice(occupancyList[0])
    //         $httpBackend.flush();
    //         expect(vm.model.dom.checkOutDiv).toBeTruthy()
    //     })
    //     it('should return success message', function() {
    //         // Get checkin list
    //         var layout = createLayout();
    //         var vm = createController();
    //         $httpBackend.when('GET', '/checkout/invoice/59253a1d466e685c1733834d').respond({
    //             data: mockInvoice
    //         });
    //         //Select occupancy
    //         vm.ctrl.checkout.getInvoice(occupancyList[0])
    //         $httpBackend.flush();
    //         $httpBackend.when('POST', '/checkout').respond({
    //             data: 'sucess'
    //         });
    //         vm.ctrl.checkout.checkout()
    //         $httpBackend.flush();

    //     })
    //     it('should update checked-in list', function() {

    //     })
    // })

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
            getCheckinListCtrl(vm) // get checkin
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
            getCheckinListCtrl(vm) // get checkin
            getInvoiceCtrl(vm, occupancyList[1]) // get invoice
            expect(vm.model.temporary.availableChildren.length).toEqual(1);
            expect(vm.model.temporary.availableChildren[0]._id).toEqual('593750866548c57de15054c2')
        })

    })

    describe('Disable checkboxes represent a checkout customer', function() {

        it('should disable children occ which have been checked out', function() {
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm) // get checkin
            getInvoiceCtrl(vm, occupancyList[1]) // get invoice
            expect(vm.model.temporary.disableChildren.length).toEqual(1);
            expect(vm.model.temporary.disableChildren[0]._id).toEqual('5937bd3dc098114b9c27b9f3')
        })

    })

    describe('Send request includes selected children to server', function() {
        it('should include childrenIdArr in data sent to checkout', function() {
            var layout = createLayout();
            var vm = createController();
            getCheckinListCtrl(vm) // get checkin
            getInvoiceCtrl(vm, occupancyList[1]) // get invoice
            console.log(vm.model.checkingout.occupancy)
            vm.model.checkingout.occupancy.childrenIdList.push(vm.model.temporary.availableChildren[0]._id); // Assume select all available members
            expect(vm.model.checkingout.occupancy.childrenIdList[0]).toEqual('593750866548c57de15054c2')
        })
    })

});
