describe('Controller: BookingCtrl', function() {
    var CustomerService, ProductService, BookingService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;
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

    var mockForm = {
        "quantity": 1,
        "staffId": "591ab5b1a77c813f4afd644a",
        "location": {
            "name": "Green Space Chùa Láng",
            "_id": "59203df203b00119ac8d77ff"
        },
        "customer": {
            "fullname": "DƯƠNG QUANG HIẾU",
            "_id": "5924168b164cb9030cee93e3",
            "phone": "0947011176",
            "email": "hieudq07.cfe@gmail.com",
            "isStudent": true
        },
        "service": {
            "_id": "59195b6103476b069405e57f",
            "name": "individual common",
            "price": 15000,
            "category": 1,
            "__v": 0,
            "updatedAt": [],
            "createdAt": "2017-05-15T07:40:17.132Z",
            "label": "Cá nhân"
        },
        "checkinTime": "2017-06-13T18:01:00.000Z",
        "checkoutTime": "2017-06-13T22:01:00.000Z"
    }

    var mockBookingList = [{
        "_id": "59275ee046b8ce44c8db5fba",
        "staffId": "591ab5b1a77c813f4afd644a",
        "checkinTime": "2017-05-11T19:02:00.000Z",
        "checkoutTime": "2017-05-11T21:02:00.000Z",
        "__v": 0,
        "createdAt": "2017-05-25T22:46:56.722Z",
        "updatedAt": [],
        "status": 3,
        "location": {
            "name": "Green Space Chùa Láng",
            "_id": "59203df203b00119ac8d77ff"
        },
        "service": {
            "name": "small group private",
            "price": 150000,
            "label": "Nhóm riêng 15"
        },
        "customer": {
            "fullname": "PHẠM THANH LAM",
            "_id": "5924168b164cb9030cee92d5",
            "phone": "01648002555",
            "email": "thanhlam.ulis@gmail.com",
            "isStudent": true
        },
    }, {
        "_id": "59275f120521cb456b70f21c",
        "staffId": "591ab5b1a77c813f4afd644a",
        "checkinTime": "2017-05-10T19:02:00.000Z",
        "checkoutTime": "2017-05-10T21:02:00.000Z",
        "__v": 0,
        "createdAt": "2017-05-25T22:47:46.525Z",
        "updatedAt": [],
        "status": 5,
        "location": {
            "name": "Green Space Chùa Láng",
            "_id": "59203df203b00119ac8d77ff"
        },
        "service": {
            "name": "small group private",
            "price": 150000,
            "label": "Nhóm riêng 15"
        },
        "customer": {
            "fullname": "NGUYỄN QUANG LINH",
            "_id": "5924168b164cb9030cee9329",
            "phone": "01663136659",
            "email": "newtime5454@gmail.com",
            "isStudent": true
        },
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
            ProductService = $injector.get('ProductService');
            BookingService = $injector.get('BookingService');
            DataPassingService = $injector.get('DataPassingService');
            authentication = $injector.get('authentication')

            var $controller = $injector.get('$controller');

            // checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

            createController = function() {
                return $controller('NewBookingCtrl', {
                    DataPassingService: DataPassingService,
                    ProductService: ProductService,
                    CustomerService: CustomerService,
                    BookingService: BookingService,
                    $scope: $scope,
                    $window: $window,
                    $route: $route,
                    $location: $location
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

    describe('Toggle booking form', function() {

        it('should hide booking form by default', function() {
            var layout = createLayout();
            var vm = createController();
            expect(vm.model.dom.booking.bookingDiv).toBeFalsy()
        })

        it('should show form when click Booking if hidden', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.dom.booking.bookingDiv = false;
            vm.ctrl.booking.toggleBookingDiv();
            expect(vm.model.dom.booking.bookingDiv).toBeTruthy()
        })

        it('should reset and close form when click Booking if shown', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.dom.booking.bookingDiv = true;
            vm.ctrl.booking.toggleBookingDiv();
            expect(vm.model.dom.booking.bookingDiv).toBeFalsy();
            expect(vm.model.dom.booking.customerSearchResultDiv).toBeFalsy();
        })

    })

    describe('Search customer', function() {

        it('should show all customer found', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();

            expect(vm.model.search.booking.customers.length).toEqual(2)
            expect(vm.model.dom.booking.search.message.notFound).toBeFalsy();
            expect(vm.model.dom.booking.customerSearchResultDiv).toBeTruthy()
        })

        it('should show message not found if not found', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: []
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();

            expect(vm.model.dom.booking.search.message.notFound).toBeTruthy();
            expect(vm.model.dom.booking.customerSearchResultDiv).toBeFalsy()
        })

        it('should remove result div if no input', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();

            // when input is empty
            vm.model.search.booking.username = ''
            vm.ctrl.booking.clearSearchInput();
            expect(vm.model.search.booking.customers.length).toEqual(0)
            expect(vm.model.dom.booking.customerSearchResultDiv).toBeFalsy();

            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: []
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();
            vm.model.search.booking.username = ''
            vm.ctrl.booking.clearSearchInput();
            expect(vm.model.search.booking.customers.length).toEqual(0)
            expect(vm.model.dom.booking.search.message.notFound).toBeFalsy();
        })

    })

    describe('Booking Form', function() {

        it('should not submit if no customer selected', function() {
            // Search customer
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();

            // Select customer
            // vm.ctrl.booking.selectCustomer(0);

            // Submit form
            vm.ctrl.booking.confirm();
            expect(vm.model.dom.booking.confirmDiv).toBeFalsy()
        })

        xit('should return correct form of date time', function() { // FIx later to use time in jasmine
            // Search customer
            var layout = createLayout();
            var vm = createController();

            vm.model.temporary.booking.checkinDate = '2017-05-31T17:00:00.000Z'
            vm.model.temporary.booking.checkinHour = 10
            vm.model.temporary.booking.checkinMin = 10
            vm.ctrl.booking.checkinTimehangeHandler();
            expect(vm.model.booking.checkinTime).toEqual("2017-06-01T03:10:00.000Z")
        })

        it('should not submit if no checkin time select', function() {
            // Search customer
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();

            // Select customer
            vm.ctrl.booking.selectCustomer(0);

            // No check in
            Object.assign(vm.model.booking, mockForm)
            vm.model.booking.checkinTime = ''

            // Confirm
            vm.ctrl.booking.confirm()
            expect(vm.model.dom.booking.confirmDiv).toBeFalsy()
        })

        it('should not submit if no service select', function() {
            // Search customer
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();

            // Select customer
            vm.ctrl.booking.selectCustomer(0);

            // No check in
            Object.assign(vm.model.booking, mockForm)
            vm.model.booking.service = ''

            // Confirm
            vm.ctrl.booking.confirm()
            expect(vm.model.dom.booking.confirmDiv).toBeFalsy()
        })

        it('should display confirm div', function() {
            // Search customer
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/customers.*/).respond({
                data: mockSearchCustomers
            });
            vm.ctrl.booking.searchCustomer();
            $httpBackend.flush();

            // Select customer
            vm.ctrl.booking.selectCustomer(0);

            // No check in
            Object.assign(vm.model.booking, mockForm)
            console.info(vm.model.booking)

            // Confirm
            vm.ctrl.booking.confirm()
            expect(vm.model.dom.booking.confirmDiv).toBeTruthy()
        })

    })

    describe('Booking List', function() {

        it('should return booking list', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/bookings\/all.*/).respond({
                data: mockBookingList
            });
            vm.ctrl.bookingList.fetch()
            $httpBackend.flush();
            expect(vm.model.bookingList.data.length).toEqual(2)
        })

        it('should show cancel confirmation when clicking cancel', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.search.booking.username = 'test'
            $httpBackend.when('GET', /\/bookings\/all.*/).respond({
                data: mockBookingList
            });
            vm.ctrl.bookingList.fetch()
            $httpBackend.flush();
            vm.ctrl.bookingList.confirmCancel(0);
            expect(vm.model.dom.bookingList.cancelConfirmDiv).toBeTruthy()
            expect(vm.model.temporary.canceledBooking.customer.fullname).toEqual('PHẠM THANH LAM')
        })

    })

})
