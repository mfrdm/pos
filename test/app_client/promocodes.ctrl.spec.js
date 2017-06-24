describe('Controller: PromocodesCtrl', function() {
    var PromocodesService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;

    var codeInfo = {
        "codeType": [{
            "value": 1,
            "label": "usage",
            "$$hashKey": "object:33"
        }, {
            "value": 2,
            "label": "price",
            "$$hashKey": "object:34"
        }, {
            "value": 3,
            "label": "total",
            "$$hashKey": "object:35"
        }, {
            "value": 4,
            "label": "quantity",
            "$$hashKey": "object:36"
        }],
        "excluded": [{
            "value": true,
            "label": "True",
            "$$hashKey": "object:54"
        }, {
            "value": false,
            "label": "False",
            "$$hashKey": "object:55"
        }],
        "priority": [{
            "value": 1,
            "label": "Base priority",
            "$$hashKey": "object:37"
        }, {
            "value": 2,
            "label": "High priority",
            "$$hashKey": "object:38"
        }],
        "services": [{
            "value": "group common",
            "label": "Nhóm chung",
            "$$hashKey": "object:39"
        }, {
            "value": "individual common",
            "label": "Cá nhân",
            "$$hashKey": "object:40"
        }, {
            "value": "small group private",
            "label": "Nhóm nhỏ",
            "$$hashKey": "object:41"
        }, {
            "value": "medium group private",
            "label": "Nhóm vừa",
            "$$hashKey": "object:42"
        }, {
            "value": "large group private",
            "label": "Nhóm lớn",
            "$$hashKey": "object:43"
        }]
    }

    var allCodes = [
        {
            "_id": "592e3e0b4eb93492334f27d4",
            "name": "yeugreenspace",
            "start": "2017-05-06T17:00:00.000Z",
            "end": "2017-05-13T17:00:00.000Z",
            "desc": "Discount 50% of total",
            "codeType": 3,
            "conflict": [],
            "override": [],
            "priority": 2,
            "updatedAt": [],
            "createdAt": "2017-05-31T03:52:43.392Z",
            "excluded": false,
            "services": [
              "all"
            ],
            "label": {
              "vn": "Common - Giảm 50% tổng hóa đơn"
            }
        }
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
            getCodeInfo = function(vm) {
                $httpBackend.when('GET', '/promocodes/code/all').respond({
                    data: allCodes
                });
                $httpBackend.when('GET', '/promocodes/code/info').respond({
                    data: codeInfo
                });
                vm.ctrl.getCodeInfo();
                $httpBackend.flush();
            }

            addCode = function(vm){
                $httpBackend.when('POST', '/promo-codes/create').respond({
                    data: 'xxx'
                });
                vm.ctrl.addCode();
                $httpBackend.flush();
            }
        }
    ));

    describe('Open form', function() {

        it('should open add new promocodes form when click button', function(done) {
            var layout = createLayout();
            var vm = createController();
            vm.ctrl.openCreatePromocode();
            expect(vm.model.dom.addCodeDiv).toBeTruthy();
            done()
        })

    })

    describe('Info in form', function() {


        it('should should fetch all services correctly', function(done) {
            var layout = createLayout();
            var vm = createController();
            getCodeInfo(vm);
            vm.ctrl.openCreatePromocode();
            expect(vm.model.codeInfo.services.length).toEqual(5)
            expect(vm.model.codeInfo.services[0].value).toEqual('group common')
            expect(vm.model.codeInfo.services[1].value).toEqual('individual common')
            expect(vm.model.codeInfo.services[2].value).toEqual('small group private')
            expect(vm.model.codeInfo.services[3].value).toEqual('medium group private')
            expect(vm.model.codeInfo.services[4].value).toEqual('large group private')
            done()
        })

        it('should should fetch all code types correctly', function(done) {
            var layout = createLayout();
            var vm = createController();
            getCodeInfo(vm);
            vm.ctrl.openCreatePromocode();
            expect(vm.model.codeInfo.codeType.length).toEqual(4)
            expect(vm.model.codeInfo.codeType[0].label).toEqual("usage")
            expect(vm.model.codeInfo.codeType[1].label).toEqual('price')
            expect(vm.model.codeInfo.codeType[2].label).toEqual('total')
            expect(vm.model.codeInfo.codeType[3].label).toEqual('quantity')
            done()
        })

        it('should not submit without select service in service checkbox selection', function(done) {
            var layout = createLayout();
            var vm = createController();
            getCodeInfo(vm);
            vm.ctrl.openCreatePromocode();
            vm.model.promocode.services = [];
            // addCode(vm)
            vm.ctrl.addCode();
            expect(vm.model.dom.addCodeDiv).toBeTruthy();
            done()
        })

        it('should not submit without name, desc, label, codeTypes, priority, start, end, redeemData, excluded', function(done) {
            var layout = createLayout();
            var vm = createController();
            getCodeInfo(vm);
            vm.ctrl.openCreatePromocode();
            vm.model.promocode.name = '';
            vm.model.promocode.start = '';
            vm.model.promocode.end = '';
            // addCode(vm)
            vm.ctrl.addCode();
            expect(vm.model.dom.addCodeDiv).toBeTruthy();
            done()
        })
    })

    xdescribe('show promocodes', function(done) {

        it('should show all not-expired codes by default', function(done) {

        })

        it('should toggle between view of not-expired and expired codes when click button', function(done) {

        })

    })

    xdescribe('edit promocode', function(done) {

        it('should fetch all data from selected promocode to edit form', function(done) {
            var layout = createLayout();
            var vm = createController();
            getCodeInfo(vm);
            vm.ctrl.openCreatePromocode();
            vm.ctrl.openEditCode(allCodes[0])
            expect(vm.model.editPromocode.name).toEqual('yeugreenspace')
            done()
        })
    })

})
