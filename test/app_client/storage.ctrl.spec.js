describe('Controller: StorageCtrl', function() {
    var StorageService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;
    // Return results from server
    // list products: all products
    var productsList = [
        {
            name: 'RedBull',
            price: 10000,
            category: 1,
            _id: '5946ca5ee23c6302f701077d',
            updatedAt: [],
            createdAt: '2017-06-18T18:51:14.861Z'
        },
        {
            name: 'Latte',
            price: 8000,
            category: 1,
            _id: '5946ca5ee23c6302f701077e',
            updatedAt: [],
            createdAt: '2017-06-18T18:51:14.861Z'
        },
        {
            name: 'Haohao',
            price: 8000,
            category: 2,
            _id: '5946ca5ee23c6302f701077f',
            updatedAt: [],
            createdAt: '2017-06-18T18:51:14.861Z'
        }
    ]
    // list storages with given time
    var storageList = [
        {
            _id: '5946ca1ac2433002a522583f',
            createdAt: '2017-06-18T13:44:42.278Z',
            itemList: [
                { itemId: '5946ca5ee23c6302f701077d', quantity: 5, note: '' },
                { itemId: '5946ca5ee23c6302f701077e', quantity: 10, note: '' },
                { itemId: '5946ca5ee23c6302f701077f', quantity: 15, note: '' } 
            ]
        }, {
            _id: '5946ca1ac2433002a5225840',
            createdAt: '2017-06-18T14:44:42.280Z',
            itemList: [
                { itemId: '5946ca5ee23c6302f701077d', quantity: 10, note: '' },
                { itemId: '5946ca5ee23c6302f701077e', quantity: 15, note: '' },
                { itemId: '5946ca5ee23c6302f701077f', quantity: 20, note: '' }
            ]
        }
    ]
    // start time and end time
    var startTime = '2017-06-18T13:40:42.278Z';
    var endTime = '2017-06-18T14:50:42.280Z';

    beforeEach(module('posApp'));

    beforeEach(inject(
        function($injector) {

            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            $window = $injector.get('$window');
            $location = $injector.get('$location');
            $route = $injector.get('$route');

            StorageService = $injector.get('StorageService');
            DataPassingService = $injector.get('DataPassingService');
            authentication = $injector.get('authentication')

            var $controller = $injector.get('$controller');

            // checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

            createController = function() {
                return $controller('StorageCtrl', {
                    DataPassingService: DataPassingService,
                    StorageService: StorageService,
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

            // Get storage list with given start time and end time
            getStorageList = function(vm, storageList) {
                $httpBackend.when('GET', /\/storages.*/).respond({
                    data: storageList
                });
                vm.ctrl.getStorageList();
                $httpBackend.flush();
            }
        }
    ));

    describe('Show list of storages (transactions)', function() {

        describe('Show without filter and with time filter', function(){
            it('should display list of transactions/storages without time filter (default)', function() {
                var layout = createLayout();
                var vm = createController();
                vm.model.temporary.startTime = 0;
                vm.model.temporary.endTime = new Date();
                getStorageList(vm, storageList);
            })
        })
        

        xit('should display correctly with time filter', function() {

        })

    })

    xdescribe('Toggle Filter Div', function() {

        it('should hide filter div when click filter button (if closed before)', function() {

        })

        it('should show filter div when click filter button (if opened before)', function() {

        })

        it('should reset all fields and return to default select when close filter div', function() {

        })

    })

    xdescribe('Add new assets/products', function() {

        it('should open add items form when click add item', function() {

        })

        it('should not submit if not fill all required fields', function() {

        })

        it('should display successful add message', function() {

        })

    })

    xdescribe('Edit Products/Assets', function() {

        it('should open edit items form when click edit', function() {

        })

        it('should fetch correctly data from that item to the form', function() {

        })

        it('should not submit if not fill all required fields', function() {

        })

        it('should display successfull edit message', function() {

        })

    })
})
