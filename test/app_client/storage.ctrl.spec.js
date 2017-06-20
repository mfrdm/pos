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

    var editedProduct = {
            name: 'RedBull',
            price: 10000,
            category: 'Soft Drink',
            _id: '5946ca5ee23c6302f701077d',
            updatedAt: [],
            createdAt: '2017-06-18T18:51:14.861Z'
        }
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

            // add product
            createProduct = function(vm, product){
                $httpBackend.when('POST', /\/products\/create.*/).respond({
                    data: product
                });
                vm.ctrl.addProduct();
                $httpBackend.flush();
            }
        }
    ));

    describe('Show list of storages (transactions)', function() {

        xdescribe('Show without filter and with time filter', function(){
            it('should display list of transactions/storages without time filter (default)', function() {
                var layout = createLayout();
                var vm = createController();
                vm.model.temporary.startTime = 0;
                vm.model.temporary.endTime = new Date();
                getStorageList(vm, storageList);
            })
        })
        
        describe('Toggle between Product and Storage Mode', function(){
            it('should display Products list when click button show product', function(){
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.productList = false;
                vm.ctrl.toogleList()
                expect(vm.model.dom.productList).toBeTruthy()
            })
            it('should display Storages list by default and when click button show product again', function(){
                var layout = createLayout();
                var vm = createController();
                vm.model.dom.storageList = true;
                vm.ctrl.toogleList()
                expect(vm.model.dom.storageList).toBeFalsy();
                vm.ctrl.toogleList()
                expect(vm.model.dom.storageList).toBeTruthy();
            })
        })

    })

    describe('Toggle Filter Div', function() {

        it('should hide filter div when click filter button (if closed before)', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.dom.filterDiv = true;
            vm.ctrl.toggleFilter()
            expect(vm.model.dom.filterDiv).toBeFalsy();
        })

        it('should show filter div when click filter button (if opened before)', function() {
            var layout = createLayout();
            var vm = createController();
            vm.ctrl.toggleFilter();
            expect(vm.model.dom.filterDiv).toBeTruthy()
        })

        it('should reset all fields and return to default select when close filter div', function() {
            var layout = createLayout();
            var vm = createController();
            vm.model.dom.filterDiv = true;
            vm.model.filter.productName = 'cuong';
            vm.model.filter.category = 2;
            vm.model.filter.time = 2;
            vm.model.filter.startTime = new Date();
            vm.model.filter.endTime = new Date();
            vm.ctrl.toggleFilter();
            expect(vm.model.filter.productName).toEqual('');
            expect(vm.model.filter.category).toEqual('All');
            expect(vm.model.filter.time).toEqual(1)
            expect(vm.model.filter.startTime).toEqual('')
            expect(vm.model.filter.endTime).toEqual('')
        })

    })

    xdescribe('Add new assets/products', function() {

        it('should open add items form when click add item', function() {
            var layout = createLayout();
            var vm = createController();
            vm.ctrl.openCreateProduct();
            expect(vm.model.dom.addProductDiv).toBeTruthy()
        })

        it('should not submit if not fill all required fields', function() {
            var layout = createLayout();
            var vm = createController();
            createProduct(vm, 'xxx');
            expect(vm.model.product.category).toBeDefined();
            expect(vm.model.product.name).toBeDefined();
            expect(vm.model.product.price).toBeDefined();
        })

        // it('should reset all fields and back to product list page', function() {
        //     var layout = createLayout();
        //     var vm = createController();
        //     expect(vm.model.product.category).toBeDefined();
        //     expect(vm.model.product.name).toBeDefined();
        //     expect(vm.model.product.price).toBeDefined();
        // })

    })

    describe('Edit Products/Assets', function() {

        it('should open edit items form when click edit', function() {
            var layout = createLayout();
            var vm = createController();
            expect(vm.model.dom.editStorageDiv).toBeFalsy();
            vm.ctrl.openEditStorage();
            expect(vm.model.dom.editStorageDiv).toBeTruthy();
        })

        it('should fetch correctly data from that item to the form', function() {
            var layout = createLayout();
            var vm = createController();
            vm.ctrl.openEditProduct(editedProduct);
            expect(vm.model.editProduct.name).toEqual('RedBull')
            expect(vm.model.editProduct.category).toEqual(2)
        })

        xit('should not submit if not fill all required fields', function() {
            var layout = createLayout();
            var vm = createController();
        })

        xit('should display successfull edit message', function() {
            var layout = createLayout();
            var vm = createController();
        })

    })
})
