describe('Controller: StorageCtrl', function() {
	var StorageService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;
	// category: 1-product, 2-assets
	// quality: 1-good, 2-bad
	var storageList = [
	{category:1, name:'Latte tra sua', quantity:10, quality:1, note:''},
	{category:1, name:'My tom', quantity:5, quality:1, note:''},
	{category:2, name:'Laptop', quantity:1, quality:1, note:''}
	]
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

            // Get storage list
            getStorageList = function(vm, storageList){
            	$httpBackend.when('GET', /\/storages.*/).respond({
                    data: storageList
                });
                vm.ctrl.getStorageList();
                $httpBackend.flush();
            }

        }
    ));

    xdescribe('Show list of products/assets in storage', function(){

    	it('should display products/assets correctly with current category filter', function(){
			var layout = createLayout();
			var vm = createController();
    		getStorageList(vm, storageList);
    	})

    	xit('should display correctly with time filter', function(){

    	})

    })

    xdescribe('Toggle Filter Div', function(){

    	it('should hide filter div when click filter button (if closed before)', function(){

    	})

    	it('should show filter div when click filter button (if opened before)', function(){

    	})

    	it('should reset all fields and return to default select when close filter div', function(){

    	})

    })

    xdescribe('Add new assets/products', function(){

    	it('should open add items form when click add item', function(){

    	})

    	it('should not submit if not fill all required fields', function(){

    	})

    	it('should display successful add message', function(){

    	})

    })

    xdescribe('Edit Products/Assets', function(){

    	it('should open edit items form when click edit', function(){

    	})

    	it('should fetch correctly data from that item to the form', function(){

    	})

    	it('should not submit if not fill all required fields', function(){

    	})

    	it('should display successfull edit message', function(){

    	})

    })
})