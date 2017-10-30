(function() {
    angular.module('posApp')
        .controller('NewCheckinCtrl', ['$http', 'RewardService', 'AccountService', 'DataPassingService', 'CheckinService', 'OrderService', 'checkoutService', 'StorageService', '$scope', '$window', '$route', '$q', NewCheckinCtrl])

    function NewCheckinCtrl ($http, RewardService, AccountService, DataPassingService, CheckinService, OrderService, CheckoutService, StorageService, $scope, $window, $route, $q){
        var LayoutCtrl = DataPassingService.get('layout');
        LayoutCtrl.ctrl.setCurrentController ({id: 'checkin'});

        var vm = this;

        vm.ctrl = {
            layout: LayoutCtrl,
            checkin: {},
            checkout: {},
            order: {},
            filter: {},
            sort: {},
            edit: {}
        }; // Everything about ctroller

        vm.model = {
            staff: LayoutCtrl.model.user,
            company: LayoutCtrl.model.company,
            dept: LayoutCtrl.model.dept,
            services: [],
            items: [],
            checkingin: {
                occupancy: {
                    staffId: LayoutCtrl.model.user._id,
                    location: {
                        _id: LayoutCtrl.model.dept._id,
                        name: LayoutCtrl.model.dept.name,
                    },
                    promocodes: [],
                    service: {},
                    customer: {}
                },
                order: {
                    orderline: [],
                    staffId: LayoutCtrl.model.user._id,
                    location: {
                        _id: LayoutCtrl.model.dept._id,
                        name: LayoutCtrl.model.dept.name,
                    },
                },
            },
            checkedinList: {
                data: [],
                pagination: {
                    itemsEachPages: 10,
                    numberOfPages: ''
                },
            },
            checkinListEachPage: {
                data: []
            },
            checkingCustomer: {

            },
            edit: {
                service: {}
            },
            checkingout: {
                occupancy: {
                    childrenIdList:[]
                }
            },
            dom: {
                search: {
                    message: {
                        notFound: false,
                    },
                    resultdiv: false,
                },
                checkin: {
                    checkInDiv: false,
                    confirmDiv: false,
                    customerSearchResultDiv: false,
                    search: {
                        message: {
                            notFound: false,
                        }

                    },
                    invalidCode: false,
                    products: [],
                    order:{
                        message:{
                            notEnough:false
                        }
                    }
                },
                checkedinList: true,
                checkInEditDiv: false,
                note: false,
                filterDiv: true,
                data: {},
                edit: {
                    search:{
                        message:{
                            notFound: false,
                        },
                    },
                },
                checkboxDiv: false // Div contain checkbox to add member to checkout with leader
            },
            search: {
                customer: {
                    username: '',
                },
                checkin: {
                    username: '',
                    customers: [],
                },
                edit: {
                    username: '',
                    customers: [],
                },
            },
            temporary: {
                checkin: {
                    item: {},
                    selectedItems: [],
                    codeNames: [],
                    wrongCodes: [],
                    statusCode: {
                        1: 'unchecked',
                        2: 'invalid',
                        3: 'valid'
                    },
                    promocodes: [],
                },
                checkout: {
                    note: '',
                    selectedAccount: {},
                    invoice: {
                        codeNames: ""
                    }

                },
                displayedList: {
                    data: [],
                    number: []
                },
                note: "",
                edit:{},
                occMembers: [],
                availableChildren:[], // not checkout children from allChildren
                disableChildren:[] // all children which have been disable (coz checked out)
            },
            filter: {
                orderBy: '',
                orderOptions: {
                    'customer.fullname': 'Tên A-Z',
                    '-customer.fullname': 'Tên Z-A',
                    'checkinTime': 'Checkin A-Z',
                    '-checkinTime': 'Checkin Z-A'
                },
                myfilter: {
                    status: '1',
                },
                statusOptions: [
                    { value: '1', label: 'Checked-in' },
                    { value: '2', label: 'Checked-out' },
                    { value: '3', label: 'All' },
                ],
                others: {
                    customer: {
                        username: ''
                    }
                }
            }
        }; // Everything about model

        vm.model.dom.data.selected = {}; // Select dom vietnamese or english

        // English version
        vm.model.dom.data.eng = {
            modelLanguage: 'en',
            title: 'Check-in List',

            checkin: {
                buttonToogle: 'Checkin',
                search: {
                    label: 'Search Customers',
                    placeholder: 'Enter phone/email to search customers',
                    message: {
                        notFound: 'Not Found Customer: '
                    },
                    list: {
                        number: 'No',
                        fullname: '',
                        birthday: '',
                        email: '',
                        phone: ''
                    }
                },
                service: {
                    title: 'Choose Service',
                    label: 'Service',
                },
                product: {
                    title: 'Choose Product',
                    productName: {
                        label: 'Product'
                    },
                    quantity: {
                        label: 'Quantity'
                    }
                },
                promoteCode: {
                    title: 'Add promote codes',
                    label: 'Code',
                    codes: [],
                }
            },
            checkinList: {
                headers: {
                    number: 'No',
                    fullname: 'Fullname',
                    checkinHour: 'Checkin',
                    checkoutHour: 'Checkout',
                    service: 'Service'
                },
                body: {
                    message: {
                        notFound: 'Not Found!'
                    }
                },
            }
        }

        // Vietnamese version
        vm.model.dom.data.vn = {
            modelLanguage: 'vn',
            title: 'Check-in List',

            checkin: {
                buttonToogle: 'Checkin',
                search: {
                    label: 'Khách hàng',
                    placeholder: 'Điền tên, sđt, hoặc email để tìm kiếm khách hàng',
                    message: {
                        notFound: 'Không tìm thấy khách hàng: '
                    },
                    list: {
                        number: 'No',
                        fullname: 'Họ và tên',
                        birthday: 'Sinh nhật',
                        email: 'Email',
                        phone: 'Điện thoại'
                    }
                },
                service: {
                    title: 'Chọn dịch vụ',
                    label: 'Dịch vụ',
                },
                product: {
                    title: 'Chọn sản phẩm',
                    productName: {
                        label: 'Sản phẩm'
                    },
                    quantity: {
                        label: 'Số lượng'
                    },
                    header: {
                        product: 'Sản phẩm',
                        quantity: 'Số lượng'
                    }
                },
                promoteCode: {
                    title: 'Điền code giảm giá',
                    label: 'Code',
                    codes: [],
                }
            },

            checkinList: {
                header: {
                    number: 'No',
                    fullname: 'Họ và tên',
                    checkinDate: 'Ngày Checkin',
                    checkinHour: 'Giờ Checkin',
                    checkoutDate: 'Ngày Checkout',
                    checkoutHour: 'Giờ Checkout',
                    service: 'Dịch vụ',
                    checkout: 'Checkout'
                },
                body: {
                    message: {
                        notFound: 'Không tìm thấy kết quả!'
                    },
                },
            },
            sorting: {
                label: 'Sắp xếp'
            },
            filter: {
                status: 'Trạng thái',
                username: 'Tên / Sđt'
            },
            edit:{
                services:[]
            },

            seeMoreBtn: 'More',
            seeMoreBtnIcon: 'swap_horiz'
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////// Loader ///////////////////////////////////////////////////////////
        
        vm.ctrl.showLoader = function (){
            LayoutCtrl.ctrl.showTransLoader ();
        };

        vm.ctrl.hideLoader = function (){
            LayoutCtrl.ctrl.hideTransLoader ();
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // Official service names
        var expectedServiceNames = ['group common', 'individual common', 'small group private', 'medium group private', 'large group private'];

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////// Implement data from booking and customer page to checkin//////////////////

        // Display info of selected customer on search input bar
        vm.store = new function (){
            this.model = {
                location: {
                   _id: LayoutCtrl.model.dept._id,
                    name: LayoutCtrl.model.dept.name,                    
                },              
                staff: {
                    _id: LayoutCtrl.model.user._id,
                }
            };

            this.getLocationInfo = function (){
                return this.model.location;
            };

            this.getStaffInfo = function (){
                return this.model.staff;
            };
        };

        vm.customers = new function (){
            this.createUsername = function (customer){
                customer.email = typeof customer.email == 'string' ? customer.email : customer.email[0];
                customer.phone = typeof customer.phone == 'string' ? customer.phone : customer.phone[0];
                return customer.fullname + (customer.email ? ' / ' + customer.email : '') + (customer.phone ? ' / ' + customer.phone : '');
            }; 

            this.get = function (username, Service){
                var thisObj = this;
                Service = Service ? Service : CheckinService;
                return Service.searchCustomers (username).then(
                    function success (res){
                        var deferred = $q.defer ();
                        if (!res.data){
                            // unexpected result. should never exist
                            deferred.reject ({message: 'Unknown error'});
                            return deferred.promise;
                        }
                        else{
                            if (res.data.data.length){
                                deferred.resolve (res.data.data);
                                return deferred.promise;
                            }
                            else{
                                deferred.reject ({message: 'No customer found'});
                                return deferred.promise;                                
                            }
                        }

                    }, 
                    function error (err){
                        console.log(err);
                    }
                );
            };
        }();      

        vm.search = new function (){
            this.model = {
                customer: {
                    username: ''
                },
                customerList: [],
                dom: {
                    message: {
                        notFound: false
                    },
                    resultdiv: false,
                }

            };

            this.inputChangeHandler = function (){
                if(!this.model.customer.username){
                    this.model.dom.resultdiv = false;
                    this.model.dom.message.notFound = false;
                    this.model.customer = {};
                }                
            };

            this.selectCustomer = function (index){
                var selectedCustomer = this.model.customerList [index];
                var customer = {
                    fullname: selectedCustomer.fullname,
                    _id: selectedCustomer._id,
                    phone: selectedCustomer.phone[0],
                    email: selectedCustomer.email[0],
                    isStudent: selectedCustomer.isStudent,
                }

                this.model.customer.username = vm.customers.createUsername(selectedCustomer);

                this.model.dom.resultdiv = false;

                return customer;
            };

            this.searchCustomers = function (Service){
                var thisObj = this;
                Service = Service ? Service : CheckinService;
                vm.ctrl.showLoader ();
                vm.customers.get (thisObj.model.customer.username, Service)
                    .then (function success (data){
                        vm.ctrl.hideLoader ();
                        thisObj.model.customerList = data;
                        thisObj.model.dom.message.notFound = false;
                        thisObj.model.dom.resultdiv = true; 

                    }, function error (err){
                        vm.ctrl.hideLoader ();
                        if (err.message == 'No customer found'){
                            thisObj.model.dom.message.notFound = true;
                        }

                        thisObj.model.dom.resultdiv = false;
                    });


                // vm.ctrl.showLoader ();
                // Service.searchCustomers (thisObj.model.customer.username).then(
                //     function success (res){
                //         if (!res.data){
                //             // unexpected result. should never exist

                //         }
                //         else{
                //             if (res.data.data.length){
                //                 thisObj.model.customers = res.data.data;
                //                 thisObj.model.dom.message.notFound = false;
                //                 thisObj.model.dom.resultdiv = true;
                //             }
                //             else{
                //                 thisObj.model.dom.message.notFound = true;
                //                 thisObj.model.dom.resultdiv = false;
                //             }
                //         }
                //         vm.ctrl.hideLoader ();
                //     }, 
                //     function error (err){
                //         console.log(err);
                //         vm.ctrl.hideLoader ();
                //     }
                // );
            };
        }();

        vm.products = new function (){
            this.model = {
                services: [],
                items: [],                
                serviceNames: [
                    'group common', 
                    'individual common', 
                    'small group private', 
                    'medium group private', 
                    'large group private'
                ],
            };

            this.resetProducts = function (){
                this.model.items = [];
                this.model.services = [];
            }

            this.get = function (){
                var thisObj = this;
                thisObj.resetProducts ();
                CheckinService.readSomeProducts()
                    .then(function success(res){
                        res.data.data.map(function(x, i, arr){
                            if(x.category == 1){
                                thisObj.model.services.push(x);
                            }
                        });                     

                        res.data.data.map(function(x, i, arr){
                            if(x.category != 1){
                                thisObj.model.items.push(x);
                            }
                        });

                        thisObj.model.items = thisObj.model.items.sort (function (a, b){
                            return a.name.localeCompare (b.name)
                        });

                        // push data into dom.data objects
                        thisObj.model.services.map (function (x, i, arr){
                            thisObj.addServiceLabel (x);
                        });
                        
                        vm.model.services = vm.model.services.sort (function (a, b){
                            return a.label.localeCompare (b.label)
                        });   

                        vm.model.dom.data.selected.services = vm.model.services;
                        vm.model.dom.data.selected.items = vm.model.items;

                    },
                    function error (err){
                        console.log (err);
                    });               
            };

            this.serviceChangeHandler = function (service){
                var thisObj = this;
                var serviceName = service.name.toLowerCase();
                serviceDefaultNames = vm.model.services.map (function (x, i, arr){
                    return x.name.toLowerCase ();
                });

                if (serviceDefaultNames.indexOf (serviceName) != -1){
                    // Private service
                    if (thisObj.model.serviceNames.slice(2).indexOf (serviceName) == -1){
                        vm.privateGroups.model.privateGroupLeaderDiv = false; // FIX
                    }   
                    else{
                        vm.privateGroups.model.privateGroupLeaderDiv = true; // FIX
                    }

                    return true;
                }
                else{
                    return false; // should never happen!
                }
            };

            this.addServiceLabel = function (service){
                if (service.name.toLowerCase () == 'group common'){
                    if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm chung';
                    else service.label = service.name;
                }
                else if (service.name.toLowerCase () == 'individual common'){
                    if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Cá nhân';
                    else service.label = service.name;
                }
                else if (service.name.toLowerCase () == 'small group private'){
                    if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm riêng 15';
                    else service.label = service.name;
                }
                else if (service.name.toLowerCase () == 'medium group private'){
                    if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm riêng 30';
                    else service.label = service.name;
                }   
                else if (service.name.toLowerCase () == 'large group private'){
                    if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm riêng 40';
                    else service.label = service.name;
                }                                                           
            };
        }();

        vm.promocodes = new function (){
            this.model = {
                codes: [],
                codeStatus: {
                    1: 'unchecked',
                    2: 'invalid',
                    3: 'valid'
                },
            };

            this.get = function (){
                if (this.model.codes.length){
                    var deferred = $q.defer ();
                    deferred.resolve ({data: 'success'});
                    return deferred.promise;
                }

                var thisObj = this;
                vm.ctrl.showLoader ();
                return CheckinService.getPromocodes ()
                    .then (function success (res){
                        vm.ctrl.hideLoader ();
                        var codes = res.data.data;

                        if (codes.length){
                            vm.ctrl.checkin.addCodeLabels (codes);
                            thisObj.model.codes = codes.sort (function (a, b){
                                return a.selectedLabel > b.selectedLabel;
                            })

                            vm.ctrl.disablePromocodes() // check disable
                           
                        }

                        var deferred = $q.defer ();
                        deferred.resolve ({data: 'success'});
                        return deferred.promise;
                    },
                    function error (err){
                        vm.ctrl.hideLoader ();
                        console.log (err);                    
                    });                              
            };

            this.getCodesByServices = function (selectedServiceName){
                selectedServiceName = selectedServiceName ? selectedServiceName.toLowerCase () : selectedServiceName;
                return this.model.codes.filter(function(ele){
                    return (ele.services.indexOf(selectedServiceName) > -1 || ele.services[0] == 'all')
                });
            };

            // After selecting code, validate it
            this.validate = function (query){
                return CheckinService.validatePromoteCode(query).then(
                    function success(res){
                        var data = res.data.data ? res.data.data : []; // review server
                        var deferred = $q.defer ();
                        deferred.resolve ({message: 'success', data: data});
                        return deferred.promise;
                    },
                    function failure (err){
                        var deferred = $q.defer ();
                        deferred.reject ({message: 'falure', error: err});
                        return deferred.promise;                        
                    }
                );   
            }            
        }();

        vm.privateGroups = new function (){
            this.model = {
                privateGroupLeaderDiv: false,
                temporary: {},
            };

            this.getLeaders = function (){
                var thisObj = this;
                thisObj.model.temporary.leaders = [{_id: '', groupName: '', leader: ''}]; // Default empty leader
                vm.checkinedList.model.list.data.map (function (x, i, arr){
                    var targetService = x.service.name.toLowerCase ();
                    if (vm.products.model.serviceNames.indexOf (targetService) != -1 &&targetService.indexOf ('private') != -1 && !x.parent && x.status == 1){

                        thisObj.model.temporary.leaders.push ({
                            _id: x._id, // occupancy id
                            groupName: x.service.label + ' / ' + x.customer.fullname + (' / ' + x.customer.email[0] ? ' / ' + x.customer.email : '') + (x.customer.phone? ' / ' + x.customer.phone : ''),
                            leader: x.customer.fullname,
                            service: x.service
                        });
                    }
                });

                if (thisObj.model.temporary.leaders.length){
                    return true;
                }
                else{
                    return false;
                }
            }
        }();

        vm.checkin = new function (){
            var checkinObj = this;
            this.model = {
                occupancy: {},
                order: {
                    orderline: [],
                },
                dom: {},
                temporary: {
                    order: {},
                    occupancy: {
                        promocodes: {}
                    },
                }
            };

            this.init = function (){
                this.model.dom.container = true;

                this.initServiceSection ();
                this.initItemSection ();
                this.initCodeSection ();
                this.initConfirmBtn ();

                vm.ctrl.checkin.getGroupPrivateLeader (); // FIX
                vm.ctrl.checkin.getPromocodes(); // FIX

            };

            this.initServiceSection = function (){
                this.model.occupancy.service = {};
                this.model.dom.service = {
                    select: false,
                };
            };

            this.initItemSection = function (){
                this.model.dom.item = {
                    select: false,
                    quantInput: false,
                    addBtn: false
                };
            };

            this.initCodeSection = function (){
                this.removeCode ();
                this.model.dom.code = {
                    select: false,
                };
            };

            this.initConfirmBtn = function (){
                this.model.dom.confirmBtn = false;
            };

            this.resetLeader = function (){
                this.model.dom.leaderSelect = false;
                this.model.temporary.occupancy.parent = null;
                this.model.occupancy.parent = null;
            }

            this.enableConfirmBtn = function (){
                this.model.dom.confirmBtn = true;
            };

            this.enableCodeSection = function (){
                this.model.dom.code = {
                    select: true,
                };                
            };

            this.openCheckinDiv = function (){
                vm.edit.model.dom.editDiv = false; // turn off
                vm.checkinList.dom.filterDiv = false; // turn off             
                this.init (); // Trigger get group of leaders
            };

            this.getPromocodes = function (){
                var thisObj = this;
                vm.promocodes.get ().then (function success (data){

                    var customer = thisObj.model.occupancy.customer;
                    var service = thisObj.model.occupancy.service;

                    if (customer && service.name){
                        thisObj.model.dom.codes = vm.promocodes.getCodesByServices (service.name);
                    }

                }, function error (err){
                    console.log (err);
                });                
            };

            this.getItems = function (){
                vm.products.get ();     
            }; 

            this.selectCustomer = function (index){
                this.model.occupancy.customer = this.model.order.customer = vm.search.selectCustomer (index);
                this.model.dom.service.select = true;
                this.model.dom.item.select = true;
                this.model.dom.item.quantInput = true;
                this.getItems ();
            };

            this.customerChangeHandler = function (){
                vm.search.inputChangeHandler ();
                this.initServiceSection ();
                this.initItemSection ();
                this.initCodeSection ();
                this.initConfirmBtn ();
            };

            this.getLeaders = function (){
                this.resetLeader ();
                var hasLeaders = vm.privateGroups.getLeaders ();
                if (hasLeaders){
                    this.model.dom.leaderSelect = true;
                }
                else{
                    this.model.dom.leaderSelect = false;
                }
            };

            this.leaderChangeHandler = function (){
                if (this.model.temporary.occupancy.parent._id){// if select a parent
                    this.model.occupancy.parent = this.model.temporary.occupancy.parent._id;
                    this.model.occupancy.service = this.model.temporary.occupancy.parent.service;
                }   
            };

            // FIX data model in the function
            this.serviceChangeHandler = function (){
                if (!checkinObj.model.occupancy.service){
                    return;
                }

                var targetService = this.model.occupancy.service; // FIX
                if (targetService && vm.products.serviceChangeHandler (targetService)){
                    vm.model.dom.data.selected.checkin.promoteCode.codes = vm.promocodes.getCodesByServices (targetService.name);   
                }

                this.enableConfirmBtn ();
                this.enableCodeSection ();
                this.getPromocodes ();
                this.getLeaders ();

                // vm.ctrl.disablePromocodes();              
            };

            // Select and add code
            this.addCode = function (){
                var thisObj = this;
                if(thisObj.model.occupancy.customer && thisObj.model.occupancy.customer.fullname){
                    thisObj.model.occupancy.promocodes = [{name: thisObj.model.temporary.occupancy.promocodes.name, status: 1}]; // used to display whether code status
                    thisObj.model.temporary.occupancy.promocodes.nameList = [thisObj.model.temporary.occupancy.promocodes.name]; // ? may not needed
                    thisObj.validateCodes ();
                }
            };

            // After selecting code, validate it
            this.validateCodes = function (){
                var addedCodes = [];
                var thisObj = this;

                if (thisObj.model.occupancy.promocodes && thisObj.model.occupancy.promocodes.length){
                    addedCodes = thisObj.model.occupancy.promocodes.map (function(x, i, arr){
                        return x.name;
                    });
                }

                var query = {
                    codes: addedCodes,
                    isStudent: thisObj.model.occupancy.customer.isStudent,
                    service: thisObj.model.occupancy.service.name,
                };

                vm.ctrl.showLoader ();

                vm.promocodes.validate (query)
                .then (function success (data){
                    vm.ctrl.hideLoader ();
                    var foundCodes = data.data;
                    thisObj.model.occupancy.promocodes = foundCodes;
                    thisObj.model.temporary.occupancy.promocodes.nameList = []; // ?
                    foundCodes.map (function (code, i, arr){
                        thisObj.model.temporary.occupancy.promocodes.nameList.push (code.name);
                    });

                    if(thisObj.model.occupancy.promocodes.length){ // assign status
                        thisObj.model.occupancy.promocodes.map(function(code, i, arr){
                            if(thisObj.model.temporary.occupancy.promocodes.nameList.indexOf(code.name) != -1){
                                code.status = 3; // valid code
                            }else{
                                code.status = 2; // invalid code
                            }
                        });
                    }

                }, function error (err){
                    vm.ctrl.hideLoader ();
                    console.log (err.error);
                });
            };

            // Remove code
            this.removeCode = function(){
                this.model.occupancy.promocodes = []
                this.model.temporary.occupancy.promocodes.name = ''
                this.model.temporary.occupancy.promocodes.nameList = [];
            };

            this.setStoreInfo = function (){
                this.model.occupancy.location = vm.store.getLocationInfo ();
                this.model.occupancy.staffId = vm.store.getStaffInfo ()._id;
                if (checkinObj.model.order.orderline && checkinObj.model.order.orderline.length){
                    checkinObj.model.order.location = vm.store.getLocationInfo ();
                    checkinObj.model.order.staffId = vm.store.getStaffInfo ()._id;            
                }              
            };

            this.confirm = function (){
                if(this.model.occupancy.customer._id){ // if have all data
                    this.setStoreInfo ();
                    this.model.occupancy.checkinTime = new Date();
                    this.model.dom.confirmDiv = true;
                }
            };

            this.checkin = function (){
                var customerId = checkinObj.model.occupancy.customer._id;
                var data = {
                    occupancy: this.model.occupancy,
                    order: this.model.order 
                };

                vm.ctrl.showLoader ();
                CheckinService.createOne (customerId, data).then(
                    function success(res){
                        vm.ctrl.hideLoader ();
                        checkinObj.model.temporary.justCheckedin = res.data.data;
                        if (checkinObj.model.temporary.justCheckedin.order && checkinObj.model.temporary.justCheckedin.order.orderline && checkinObj.model.temporary.justCheckedin.order.orderline.length){
                            checkinObj.model.order.occupancyId = checkinObj.model.temporary.justCheckedin.occupancy._id;
                        }
                        else{
                            vm.ctrl.reset ();
                        }
                    }, 
                    function error(err){
                        vm.ctrl.hideLoader ();
                        console.log(err);
                    }
                ); 
            };

            this.cancelCheckin = function (){
                vm.ctrl.reset ();
            };

            // back to check-in form when on submit
            this.back = function (){
                this.model.dom.confirmDiv = false;
            };

            this.order = {
                cancel: function (){
                    vm.ctrl.reset ();
                },
                buy: function (){
                    vm.ctrl.showLoader ();
                    OrderService.confirmOrder (checkinObj.model.temporary.justCheckedin.order).then(
                        function success (res){
                            // display confirm message and reset route
                            vm.ctrl.reset ();
                        },
                        function failure (err){
                            vm.ctrl.hideLoader ();
                            console.log(err);
                        }
                    )
                },
                orderChangeHandler: function (){
                    if (checkinObj.model.temporary.order.name && checkinObj.model.temporary.order.quantity){
                        checkinObj.model.dom.item.addBtn = true;
                    }
                    else{
                        checkinObj.model.dom.item.addBtn = false;
                    }
                },
                hideOrderMessage: function(){
                    vm.model.dom.checkin.order.message.notEnough = false;
                },
                addItem: function (){
                    vm.products.model.items.map (function (x, i, arr){
                        var currentItems = checkinObj.model.order.orderline.map (function (x, i, arr){
                            return x['productName'];
                        });

                        if (x.name == checkinObj.model.temporary.order.name && currentItems.indexOf (x.name) == -1){
                            var newItem = {
                                _id: x._id,
                                quantity: checkinObj.model.temporary.order.quantity,
                                productName: x.name,
                                price: x.price,
                            };

                            checkinObj.model.order.orderline.push (newItem);
                            checkinObj.model.temporary.order = {};
                            return;
                        }
                        else{
                            // display message
                        }
                    });
                },
                removeItem: function (index){
                    checkinObj.model.order.orderline.splice (index, 1);
                }                  
            };
        }();

        // STOP here
        vm.checkout = new function (){
            var checkoutObj = this;
            this.model = {
                dom: {
                    checkoutDiv: false,
                },
                checkingout:{

                },
                temporary: {
                    invoice: {total: -1},
                    selectedReward: {},
                    selectedAccount: {},
                }
            }

            this.getPromocodeNames = function (occ){
                var codeNames = "";
                occ.promocodes.map (function (x, i, arr){
                    codeNames = (codeNames ? codeNames + " / " : "" ) + x.name;
                });
                return codeNames;
            };


            this.getInvoice = function (occ){
                checkoutObj.model.dom.checkoutDiv = true;
                vm.ctrl.showLoader ();
                CheckinService.readInvoice(occ._id).then(
                    function success(res){
                        vm.ctrl.hideLoader ();
                        checkoutObj.model.checkingout.occupancy = res.data.occ;
                        checkoutObj.model.checkingout.accounts = res.data.acc;
                        checkoutObj.model.checkingout.reward = res.data.reward;
                        checkoutObj.model.temporary.invoice.codeNames = checkoutObj.getPromocodeNames (checkoutObj.model.checkingout.occupancy);
                        vm.products.addServiceLabel (checkoutObj.model.checkingout.occupancy.service);
                    }, 
                    function error(err){
                        vm.ctrl.hideLoader ();
                        console.log(err)
                    }
                );
            };

            // FIX: allow more than one account being used. LATER
            this.accChangeHandler = function (){
                // reset reward
                checkoutObj._resetReward ();

                if (!checkoutObj.model.temporary.selectedAccount._id){
                    checkoutObj.model.temporary.accWithdrawDetail = {acc: {}, occ: {}}
                    return;
                }

                var occ = checkoutObj.model.checkingout.occupancy;
                var accId = checkoutObj.model.temporary.selectedAccount._id;
                vm.ctrl.showLoader ();
                CheckoutService.withdrawOneAccount (occ, accId).then(
                    function success (res){
                        vm.ctrl.hideLoader ();
                        checkoutObj.model.temporary.accWithdrawDetail = res.data.data;
                        checkoutObj.model.temporary.selectedAccount = res.data.data.acc;
                    },
                    function error (err){
                        vm.ctrl.hideLoader ();
                        console.log(err)
                    }
                )
            };

            this._resetReward = function (){
                checkoutObj.model.temporary.rwdWithdrawDetail = {rwd: {}, occ: {}};
                checkoutObj.model.temporary.selectedReward._id = "";
            }

            this.rewardChangeHandler = function (){
                if (!checkoutObj.model.temporary.selectedReward._id || (checkoutObj.model.temporary.accWithdrawDetail && checkoutObj.model.temporary.accWithdrawDetail.occ && checkoutObj.model.temporary.accWithdrawDetail.occ.total == 0) || (checkoutObj.model.checkingout.occupancy.total == 0)){
                    checkoutObj._resetReward ();
                    return;
                }

                var total = checkoutObj.model.temporary.accWithdrawDetail && checkoutObj.model.temporary.accWithdrawDetail.acc._id ? checkoutObj.model.temporary.accWithdrawDetail.occ.total : checkoutObj.model.checkingout.occupancy.total;
                var rwdid = checkoutObj.model.temporary.selectedReward._id;
                vm.ctrl.showLoader ();
                RewardService.prepareWithdraw (rwdid, total).then (
                    function success (res){
                        vm.ctrl.hideLoader ();
                        checkoutObj.model.temporary.rwdWithdrawDetail = res.data.data;
                        checkoutObj.model.temporary.selectedReward = res.data.data;
                    },
                    function failure (err){
                        vm.ctrl.hideLoader ();
                        console.log(err)
                    }
                )
            };

            // FIX: allow more than one account being used. LATER
           this.checkout = function (){
                if (checkoutObj.model.temporary.selectedAccount._id){
                    checkoutObj.model.checkingout.occupancy.paymentMethod.push (checkoutObj.model.temporary.selectedAccount);
                }

                if (checkoutObj.model.temporary.selectedReward._id){
                    checkoutObj.model.checkingout.occupancy.paymentMethod.push (checkoutObj.model.temporary.selectedReward);
                }

                console.log (checkoutObj.model.checkingout.occupancy)
                return

                vm.ctrl.showLoader ();
                CheckinService.checkout(checkoutObj.model.checkingout.occupancy).then(
                    function success(res){
                        vm.ctrl.hideLoader ();
                        vm.ctrl.reset();
                    }, 
                    function error(err){
                        vm.ctrl.hideLoader ();
                        console.log(err);
                    }
                ); 
            };           
        }();

        // PENDING ... 
        vm.edit = new function (){
            this.model = {
                customer: {},
                temporary: {},
                dom: {
                    editDiv: false
                }
            };

            this.readCheckin = function (occupancy){

                var checkinTime = new Date (occupancy.checkinTime);

                vm.search.model.customer.username = vm.customers.createUsername (occupancy.customer)

                this.model.temporary = {
                    _id: occupancy._id,
                    customer: occupancy.customer,
                    service: occupancy.service,
                    promocodes: occupancy.promocodes,
                    checkindate: checkinTime,
                    checkinhour: checkinTime.getHours (),
                    checkinmin: checkinTime.getMinutes (),
                }; 

                this.model.dom.editdiv = true;
                vm.products.get ();
                this.getPromocodes ();
            };

            this.searchCustomer = function (){
                vm.search.searchCustomer ();
            };

            this.selectCustomer = function (index){
                this.model.customer = vm.search.selectCustomer (index);
            };

            this.serviceChangeHandler = function (){
                console.log ('change service')
            };

            this.submit = function (){
                var thisObj = this;
                var update = {
                    _id: thisObj.model.temporary._id,
                    service: thisObj.model.temporary.service,
                    parent: thisObj.model.temporary.parent,
                    promocodes: thisObj.model.temporary.promocodes,
                    // checkinTime: thisObj.model.temporary.checkinTime,
                    customer: thisObj.model.temporary.customer,
                };

                CheckinService.updateOne(update)
                    .then(function (res){
                        vm.ctrl.reset();
                    }, function error (err){
                        //
                    });
            };

            this.getPromocodes = function (){
                var thisObj = this;
                vm.promocodes.get ()
                .then (function success (data){
                    if(thisObj.model.dom.editdiv){
                        // vm.model.dom.data.selected.edit.promoteCode.codes = vm.ctrl.selectCodesForService(vm.model.edit.occupancy.service.name, vm.model.dom.data.selected.checkin.promoteCode.original)
                    }
                }, function error (err){
                    //
                });
            }
        }();

        vm.checkinedList = new function (){
            this.model = {
                dom: {
                    listDiv: true,
                    filterDiv: false,
                },
                list: {data: []},
            };

            this.get = function (){
                var thisObj = this;
                var query = {
                    status: 4, // get both checked out and checked in
                    storeId: vm.store.getLocationInfo ()._id,
                }

                return CheckinService.getCheckedinList(query)
                    .then(function success(res){
                        thisObj.model.list.data = res.data.data;
                        thisObj.model.list.data.map (function (x, i, arr){
                            vm.products.addServiceLabel (x.service);
                        });

                        var deferred = $q.defer ();
                        deferred.resolve ({data: 'success'});
                        return deferred.promise;
                    }, 
                    function error(err){
                        console.log(err);
                    });
            };
        }();


        vm.ctrl.checkinBooking = function (){
            var b = DataPassingService.get ('booking');
            
            if (b){
                Object.assign (vm.model.checkingin.occupancy, b);
                vm.ctrl.openCheckinDiv ();

                var tempCustomer = {
                    email: [b.customer.email],
                    phone: [b.customer.phone],
                    fullname: b.customer.fullname,
                }

                vm.model.search.checkin.username = vm.ctrl.checkin.createUsername (tempCustomer);

                DataPassingService.reset ('booking');
            }
        };

        vm.ctrl.checkinNewCustomer = function (){
            var c = DataPassingService.get ('customer');
            if (c){
                
                vm.model.checkingin.occupancy.customer = vm.model.checkingin.order.customer = c;
                var tempCustomer = {
                    email: [c.email],
                    phone: [c.phone],
                    fullname: c.fullname,
                }

                vm.model.search.checkin.username = vm.ctrl.checkin.createUsername (tempCustomer);

                vm.ctrl.openCheckinDiv ();
                DataPassingService.reset ('customer');
            }           
        }

        // Get checkin list when load page
        // vm.model.checkedinList.data: array contains all occs today

        vm.ctrl.getCheckedinList = function (){
            var query = {
                status: 4, // get both checked out and checked in
                storeId: LayoutCtrl.model.dept._id,
            }

            vm.ctrl.showLoader ();
            CheckinService.getCheckedinList(query).then(
                function success(res){
                    vm.ctrl.hideLoader ();
                    vm.model.checkedinList.data = res.data.data;
                    vm.model.checkedinList.data.map (function (x, i, arr){
                        vm.ctrl.addServiceLabel (x.service);
                    });// add service label to service

                    vm.ctrl.filterPaginate();// make pagination
                    vm.ctrl.checkinBooking ();// implement data from booking
                    vm.ctrl.checkinNewCustomer ();// implement data from customer
                }, 
                function error(err){
                    vm.ctrl.hideLoader ();
                    console.log(err);
                }
            );
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////// Paginate ///////////////////////////////////////////////////
        
        // Slice list after filter
        // FIX later
        vm.ctrl.getFilteredCheckinList = function (){
            var cleanStr = function(str){
                if (str){
                    return LayoutCtrl.ctrl.removeDiacritics(str).trim().split(' ').join('').toLowerCase()
                }
                return '' // Still return error, but work
            }

            vm.ctrl.showNoteColumn();

            // Input
            var input = cleanStr(vm.model.filter.others.customer.username)

            vm.model.temporary.displayedList.data = vm.model.checkedinList.data.filter(function(ele){
                    if(vm.model.filter.myfilter.status == 3){
                        return ele
                    }else{
                        return ele.status == vm.model.filter.myfilter.status
                    }
                }).filter(function(item){
                    return (cleanStr(item.customer.fullname).includes(input) || cleanStr(item.customer.phone).includes(input))
                })
            return vm.model.temporary.displayedList.data
        }

        function checkDisabledButton(){
            var ind = 0;
            vm.model.temporary.displayedList.number.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+1 == vm.model.temporary.displayedList.number.length){
                vm.model.nextClass = "pagination-next disabled";
                vm.model.goNextText = 'Next'
            }else{
                vm.model.nextClass = "pagination-next";
                vm.model.goNextText = ''
            };
            if(ind == 0){
                vm.model.previousClass = "pagination-previous disabled";
                vm.model.goPreviousText = 'Previous'
            }else{
                vm.model.previousClass = "pagination-previous";
                vm.model.goPreviousText = ''
            }
        }

        vm.ctrl.goNext = function(){
            var ind = 0;
            vm.model.temporary.displayedList.number.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+2 <= vm.model.temporary.displayedList.number.length){
                vm.ctrl.sliceCheckinList(ind+2)
            }
        }

        vm.ctrl.goPrevious = function(){
            var ind = 0;
            vm.model.temporary.displayedList.number.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind >= 1){
                vm.ctrl.sliceCheckinList(ind)
            }
        }

        // Paginate
        vm.ctrl.paginate = function (afterFilterList){
            vm.model.temporary.displayedList.number = []
            vm.model.checkedinList.pagination.numberOfPages = Math.ceil(
                afterFilterList.length/vm.model.checkedinList.pagination.itemsEachPages)
            
            for(var i = 1; i<vm.model.checkedinList.pagination.numberOfPages+1; i++){
                vm.model.temporary.displayedList.number.push({number:i, class:''})
            }
            vm.model.temporary.displayedList.number.map(function(ele, index, array){
                array[0].class = 'current'
            })
            
            checkDisabledButton()
            
            vm.model.checkinListEachPage.data = afterFilterList.slice(0, vm.model.checkedinList.pagination.itemsEachPages)
            vm.ctrl.sliceCheckinList = function(i){
                vm.model.checkinListEachPage.data = afterFilterList.slice((i-1)*vm.model.checkedinList.pagination.itemsEachPages,i*vm.model.checkedinList.pagination.itemsEachPages)
                vm.model.temporary.displayedList.number.map(function(ele, index, array){
                    if(index == i-1){
                        array[index].class = 'current'
                    }else{
                        array[index].class = ''
                    }
                });
                
                checkDisabledButton()
            }

            vm.ctrl.showInPage = function(occ){
                var testArr = vm.model.checkinListEachPage.data.filter(function(ele){
                    return ele.customer.phone == occ.customer.phone && ele.checkinTime == occ.checkinTime
                })
                if(testArr.length > 0){
                    return true
                }else{
                    return false
                }
            }
        }

        // Paginate after filter
        vm.ctrl.filterPaginate = function (){
            var afterFilterList = vm.ctrl.getFilteredCheckinList();
            vm.ctrl.paginate(afterFilterList)
        }

        //Show note column
        vm.ctrl.showNoteColumn = function (){
            if(vm.model.filter.myfilter.status == 1){
                vm.model.dom.note = false
            }else{
                vm.model.dom.note = true
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////// Toggle ////////////////////////////////////////////////////

        vm.ctrl.openCheckinDiv = function(){
            vm.model.dom.checkInEditDiv = false; // turn off
            vm.model.dom.filterDiv = false; // turn off             
            vm.checkin.init (); // Trigger get group of leaders
        };

        vm.ctrl.toggleFilterDiv = function (){
            if (!vm.model.dom.filterDiv) {
                vm.model.dom.filterDiv = true;
                vm.model.dom.checkInEditDiv = false;
                vm.model.dom.checkin.checkinDiv = false;
            }
            else vm.model.dom.filterDiv = false;
        };

        ///////////// Get group leaders /////////////



        /////// Select services //////////////

        // Handle when select sevice
        vm.ctrl.checkin.serviceChangeHandler = function (){
            if(vm.model.checkingin.occupancy.customer.fullname){
                var targetService = vm.model.checkingin.occupancy.service;

                if (vm.products.serviceChangeHandler (targetService)){
                    vm.model.dom.data.selected.checkin.promoteCode.codes = vm.promocodes.getCodesByServices (targetService.name);   
                }

                vm.ctrl.disablePromocodes();

            }else{

            }
        };

        vm.ctrl.selectCodesForService = function(selectedService, original){
                // edit code depends on services
                selectedService = selectedService ? selectedService.toLowerCase () : selectedService;
                var subCodes = original.filter(function(ele){
                    return (ele.services.indexOf(selectedService) > -1 || ele.services[0] == 'all')
                })

                return subCodes
            }

            // If select private group service
            vm.ctrl.checkin.selectedGroupChangeHandler = function (){
                if (vm.model.temporary.selectedGroupPrivate._id){// if select a parent
                    vm.model.checkingin.occupancy.parent = vm.model.temporary.selectedGroupPrivate._id;
                    vm.model.checkingin.occupancy.service = vm.model.temporary.selectedGroupPrivate.service;
                }
            };


            // After checkin occ, create order if have one
            vm.ctrl.order.confirm = function (){
                OrderService.confirmOrder (vm.model.temporary.justCheckedin.order).then(
                    function success (res){
                        // display confirm message and reset route
                        vm.ctrl.reset ();
                    },
                    function failure (err){

                    }
                )
            };



        ////////////////////////////////////////////// Others /////////////////////////////////////////////////

        //Show note column
        vm.ctrl.showNoteColumn = function (){
            if(vm.model.filter.myfilter.status == 1){
                vm.model.dom.note = false
            }else{
                vm.model.dom.note = true
            }
        }

        vm.ctrl.seeMore = function(){
            if(vm.model.dom.seeMore == true){
                vm.model.dom.seeMore = false
                vm.model.dom.data.selected.seeMoreBtn = 'More'
                vm.model.dom.data.selected.seeMoreBtnIcon = 'swap_horiz'
            }else{
                vm.model.dom.seeMore = true
                vm.model.dom.data.selected.seeMoreBtn = 'Less'
                vm.model.dom.data.selected.seeMoreBtnIcon = 'compare_arrows'
            }
        }

        // FIX: should not reset the route. only the checkin div
        vm.ctrl.checkin.resetCheckinDiv = function (){
            // // Clear model related to checkin data
            // vm.model.checkingin.occupancy.checkinTime = {};
            // vm.model.checkingin.occupancy.customer = {};
            // vm.model.checkingin.occupancy.promocodes = [];
            // vm.model.checkingin.occupancy.service = {};

            // vm.model.temporary.checkin.codeName = ''

            // vm.model.checkingin.order.customer = {};
            // vm.model.checkingin.order.orderline = [];
            // vm.model.temporary.checkin.selectedItems = [];

            // // Search div
            // vm.model.dom.checkin.customerSearchResultDiv = false;
            // vm.model.search.checkin.customers = []

            // vm.model.dom.checkin.checkinDiv = false;
            // vm.model.search.checkin.username = '';

            vm.ctrl.reset ();
        }

        vm.ctrl.reset = function (){
            $route.reload ();
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////// INITIALIZE //////////////////////////////////////////////
        vm.model.dom.data.selected = vm.model.dom.data.vn;
        angular.element(document.getElementById ('mainContentDiv')).ready(function () {// after page load
            vm.model.temporary.occMembers = []
            // vm.ctrl.getCheckedinList ();// get checkin list
            vm.ctrl.showLoader ();
            vm.checkinedList.get ()
                .then (function success (data){
                    vm.ctrl.hideLoader ();
                    // vm.ctrl.filterPaginate();// make pagination
                    vm.ctrl.checkinBooking ();// implement data from booking
                    vm.ctrl.checkinNewCustomer ();// implement data from customer
                }, function error (err){
                    vm.ctrl.hideLoader ();
                    console.log (err);
                });

        });

    }
}())
