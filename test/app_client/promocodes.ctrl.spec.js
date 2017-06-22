describe('Controller: PromocodesCtrl', function() {
    var PromocodesService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;

    beforeEach(module('posApp'));

    beforeEach(inject(
        function($injector) {

            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            $window = $injector.get('$window');
            $location = $injector.get('$location');
            $route = $injector.get('$route');

            PromocodesService = $injector.get('PromocodesService');
            DataPassingService = $injector.get('DataPassingService');
            authentication = $injector.get('authentication')

            var $controller = $injector.get('$controller');

            createController = function() {
                return $controller('PromocodesCtrl', {
                    DataPassingService: DataPassingService,
                    PromocodesService: PromocodesService,
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
            // $httpBackend.when('GET', /\/storages.*/).respond({
            //     data: storageList
            // });
            // $httpBackend.flush();
        }
    ));

    describe('test', function(){
        it('should be done', function(done){
            done()
        })
    })

})
