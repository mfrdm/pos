(function() {
    angular.module('posApp')
        .controller('NewCheckinCtrl', ['$http', 'DataPassingService', 'CheckinService', 'OrderService', 'checkoutService', 'StorageService', '$scope', '$window', '$route', '$q', NewCheckinCtrl])

    function NewCheckinCtrl ($http, DataPassingService, CheckinService, OrderService, CheckoutService, StorageService, $scope, $window, $route, $q){
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
            this.model = {
                occupancy: {},
                order: {},
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

            // FIX
            // STOP here. Need to initialize code value and other things
            this.serviceChangeHandler = function (){
                if (!vm.checkin.model.occupancy.service){
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
                
                // set infor for order too!!                
            };

            this.confirm = function (){
                if(this.model.occupancy.customer._id){ // if have all data
                    this.setStoreInfo ();
                    this.model.occupancy.checkinTime = new Date();
                    this.model.dom.confirmDiv = true;
                }
            };

            this.checkin = function (){
                var thisObj = this;
                var customerId = thisObj.model.occupancy.customer._id;
                var data = {
                    occupancy: this.model.occupancy,
                    order: this.model.order 
                };

                vm.ctrl.showLoader ();
                CheckinService.createOne (customerId, data).then(
                    function success(res){
                        vm.ctrl.hideLoader ();
                        thisObj.model.temporary.justCheckedin = res.data.data;
                        if (thisObj.model.temporary.justCheckedin.order && thisObj.model.temporary.justCheckedin.order.orderline && thisObj.model.temporary.justCheckedin.order.orderline.length){
                            thisObj.model.order.occupancyId = vm.model.temporary.justCheckedin.occupancy._id;
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
                vm.ctrl.reset ()
            };

            // back to check-in form when on submit
            this.back = function (){
                this.model.dom.confirmDiv = false;
            };

            // STOP here
            this.order = {
                cancel: function (){

                },
                purchase: function (){

                },
                orderChangeHandler: function (){
                    if (this.model.temporary.order.name && this.model.temporary.order.quantity){
                        this.model.dom.item.addBtn = true;
                    }
                    else{
                        this.model.dom.item.addBtn = false;
                    }
                },
                hideOrderMessage: function(){
                    vm.model.dom.checkin.order.message.notEnough = false;
                },
                addItem: function (){
                    if (vm.model.temporary.checkin.item.quantity && vm.model.temporary.checkin.item.name && vm.model.checkingin.occupancy.customer){
                        // check if store has enough products for making order
                        //vm.model.temporary.checkin.item.name and vm.model.temporary.checkin.item.quantity
                        var end = new Date();
                        StorageService.readProductsQuantity(0, end).then(function(res){
                            var selectedProduct = res.data.data.filter(function(ele){
                                return ele.name == vm.model.temporary.checkin.item.name
                            })[0]
                            if(selectedProduct.totalQuantity < vm.model.temporary.checkin.item.quantity){
                                vm.model.dom.checkin.order.message.notEnough = true;
                            }else{
                                vm.model.dom.checkin.order.message.notEnough = false;
                                vm.model.items.map (function (x, i, arr){
                                    if (x.name == vm.model.temporary.checkin.item.name && vm.model.temporary.checkin.selectedItems.indexOf (x.name) == -1){
                                        var obj = Object.assign({},{
                                            quantity: vm.model.temporary.checkin.item.quantity,
                                            _id: x._id,
                                            productName: x.name,
                                            price: x.price
                                        });
                                        vm.model.checkingin.order.orderline.push (obj);
                                        vm.model.temporary.checkin.item = {};
                                        vm.model.temporary.checkin.selectedItems.push (x.name);
                                        return;
                                    }
                                    else{
                                        // display message
                                    }
                                });
                            }
                        })
                        
                    }
                },
                removeItem: function (index){
                    if (vm.model.checkingin.order.orderline && vm.model.checkingin.order.orderline.length){
                        vm.model.checkingin.order.orderline.splice (index, 1);
                        vm.model.temporary.checkin.selectedItems.splice (index, 1);
                    }
                }                  
            };
        }();

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
        
        // vm.ctrl.checkin.initCheckinDiv = function (){
        //     vm.model.dom.checkin.checkinDiv = true;
        //     vm.ctrl.checkin.getGroupPrivateLeader ();
        //     vm.ctrl.checkin.getPromocodes();
        // }

        // Get group Leader
        vm.ctrl.checkin.getGroupPrivateLeader = function (){
            vm.model.temporary.groupPrivateLeaders = [{_id: '', groupName: '', leader: ''}];
            vm.model.checkedinList.data.map (function (x, i, arr){
                if ((x.service.name.toLowerCase () == expectedServiceNames[2] || x.service.name.toLowerCase () == expectedServiceNames[3] || x.service.name.toLowerCase () == expectedServiceNames[4]) && !x.parent && x.status == 1){

                    vm.model.temporary.groupPrivateLeaders.push ({
                        _id: x._id, // occupancy id
                        groupName: x.service.label + ' / ' + x.customer.fullname + (' / ' + x.customer.email[0] ? ' / ' + x.customer.email : '') + (x.customer.phone? ' / ' + x.customer.phone : ''),
                        leader: x.customer.fullname,
                        service: x.service
                    });
                }
            });
        }

        ////////////Search customer to checkin////////////
        
        // Search customer
        vm.ctrl.checkin.searchCustomer =  function (){
            vm.ctrl.showLoader ();
            CheckinService.searchCustomers (vm.model.search.checkin.username).then(
                function success (res){
                    if (!res.data){
                        // unexpected result. should never exist
                    }
                    else{
                        if (res.data.data.length){
                            vm.model.search.checkin.customers = res.data.data;
                            vm.model.dom.checkin.search.message.notFound = false;
                            vm.model.dom.checkin.customerSearchResultDiv = true;
                        }
                        else{
                            vm.model.dom.checkin.search.message.notFound = true;
                            vm.model.dom.checkin.customerSearchResultDiv = false;
                        }
                    }
                    vm.ctrl.hideLoader ();
                }, 
                function error (err){
                    console.log(err);
                    vm.ctrl.hideLoader ();
                }
            );
        };

        // Select one customer to checkin
        vm.ctrl.checkin.selectCustomer = function (index){
            var selectedCustomer = vm.model.search.checkin.customers [index];
            vm.model.checkingin.occupancy.customer = vm.model.checkingin.order.customer = {
                fullname: selectedCustomer.fullname,
                _id: selectedCustomer._id,
                phone: selectedCustomer.phone[0],
                email: selectedCustomer.email[0],
                isStudent: selectedCustomer.isStudent,
            }
            vm.model.search.checkin.username = vm.ctrl.checkin.createUsername(selectedCustomer);// display selected customer on search input
            vm.model.services = []
            vm.model.items = []
            vm.ctrl.checkin.getItems ();
            vm.ctrl.checkin.resetSearchCustomerDiv ();// After select we remove search result div
            vm.ctrl.disablePromocodes()// Check to disable promocodes
        }

        // Display info of selected customer on search input bar
        vm.ctrl.checkin.createUsername = function (customer){
            return customer.fullname + (customer.email[0] ? ' / ' + customer.email[0] : '') + (customer.phone[0] ? ' / ' + customer.phone[0] : '');
        };

        // remove search results
        vm.ctrl.checkin.resetSearchCustomerDiv = function (){
            vm.model.dom.checkin.customerSearchResultDiv = false;
            vm.model.search.checkin.customers = [];
        };

        //Clear search result when search input is empty
        vm.ctrl.checkin.validateSearchInput = function(){
            if(!vm.model.search.checkin.username){
                vm.model.dom.checkin.customerSearchResultDiv = false;
                vm.model.checkingin.occupancy.customer = {};
                vm.model.checkingin.order.customer = {};
            }
        }

        ///// Get promocodes ///////
        // vm.model.dom.data.selected.checkin.promoteCode.original: all the codes get from db, 
        // vm.model.dom.data.selected.checkin.promoteCode.codes: codes for each kind of service; each time we select a service, this will change

        // Add label to codes
        vm.ctrl.checkin.addCodeLabels = function (codes){// codes: array of all codes
            if (vm.model.dom.data.selected.modelLanguage == 'vn'){
                codes.map (function (x, i, arr){
                    x.selectedLabel = x.label.vn;
                });             
            }
            else if (vm.model.dom.data.selected.modelLanguage == 'en'){
                codes.map (function (x, i, arr){
                    x.selectedLabel = x.label.en;
                }); 
            }       
        }

        // Disable code if not choosing customer and service
        vm.ctrl.disablePromocodes = function(){
            if((vm.model.checkingin.occupancy.customer && vm.model.checkingin.occupancy.service.name) || vm.model.edit.service.name){// condition to not disable
                vm.model.dom.data.selected.checkin.promoteCode.codes.map(function(ele){
                    return ele.disabled = false;
                });

            }else{
                vm.model.dom.data.selected.checkin.promoteCode.codes.map(function(ele){
                    return ele.disabled = true;
                })
            }
        }   

        // Get promocodes
        // FIX: create promise, to seperate get promocode and whatever actions should be call right after select codes matching with service when checkin a booking
        vm.ctrl.checkin.getPromocodes = function (){
            if (vm.model.dom.data.selected.checkin && vm.model.dom.data.selected.checkin.promoteCode.codes.length){
                return;
            }

            vm.promocodes.get ().then (function success (data){
                // when checkin a booking
                if (vm.model.checkingin.occupancy.customer && vm.model.checkingin.occupancy.service.name){
                    vm.model.dom.data.selected.checkin.promoteCode.codes = vm.ctrl.selectCodesForService(vm.model.checkingin.occupancy.service.name, vm.model.dom.data.selected.checkin.promoteCode.original);   
                }
            }, function error (err){
                console.log (err);
            });
        }

        /////// Select Promocodes ////////

        // Select and add code
        vm.ctrl.checkin.addCode = function (){
            if(vm.model.checkingin.occupancy.customer.fullname){
                vm.model.checkingin.occupancy.promocodes = [{name: vm.model.temporary.checkin.codeName, status:1}];
                vm.model.temporary.checkin.codeNames = [vm.model.temporary.checkin.codeName];
                vm.ctrl.checkin.validateCodes ();
            }
        };

        // After selecting code, validate it
        vm.ctrl.checkin.validateCodes = function (){
            if(vm.model.checkingin.occupancy.customer.fullname && vm.model.checkingin.occupancy.service.name){
                var addedCodes = [];
                if (vm.model.checkingin.occupancy.promocodes && vm.model.checkingin.occupancy.promocodes.length){
                    addedCodes = vm.model.checkingin.occupancy.promocodes.map (function(x, i, arr){
                        return x.name;
                    });
                }
                var data = {
                    codes: addedCodes,
                    isStudent: vm.model.checkingin.occupancy.customer.isStudent,
                    service: vm.model.checkingin.occupancy.service.name
                };

                vm.ctrl.showLoader ();

                CheckinService.validatePromoteCode(data).then(
                    function success(res){
                        vm.ctrl.hideLoader ();
                        console.log(res.data.data)
                        var foundCodes = res.data.data;
                        vm.model.checkingin.occupancy.promocodes = foundCodes;
                        vm.model.temporary.checkin.codeNames = [];

                        foundCodes.map (function (x, i, arr){
                            vm.model.temporary.checkin.codeNames.push (x.name);
                        });
                        if(vm.model.checkingin.occupancy.promocodes){// show if code valid or not
                            vm.model.checkingin.occupancy.promocodes.map(function(item){
                                if(vm.model.temporary.checkin.codeNames.indexOf(item.name) != -1){
                                    item.status = 3;
                                }else{
                                    item.status = 2;
                                }
                            })
                        }
                    },
                    function failure (err){
                        vm.ctrl.hideLoader ();
                        console.log (err);
                    }
                )
            }
            else{
                // display error message
            }       
        }

        // Remove code
        vm.ctrl.checkin.removeCode = function(){
            vm.model.checkingin.occupancy.promocodes = []
            vm.model.temporary.checkin.codeName = ''
        };

        //////////Get services and products ////////////////
        // vm.model.services: all services from db, need to add label
        // vm.model.items: all items
        // vm.model.dom.data.selected.services: use for dom selection, equal vm.model.services
        // vm.model.dom.data.selected.items: use for dom selection, equal vm.mode.items

        vm.ctrl.checkin.getItems = function (){
            if(vm.model.checkingin.occupancy.customer.fullname){
                vm.products.get ();     
            }
        };

        // Add service label for services
        vm.ctrl.addServiceLabel = function (service){
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
        }

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

        ////////// Select Orders //////////////
        vm.ctrl.hideOrderMessage = function(){
            vm.model.dom.checkin.order.message.notEnough = false;
        }
        // Add item to order
        vm.ctrl.checkin.addItem = function (){
            if (vm.model.temporary.checkin.item.quantity && vm.model.temporary.checkin.item.name && vm.model.checkingin.occupancy.customer){
                // check if store has enough products for making order
                //vm.model.temporary.checkin.item.name and vm.model.temporary.checkin.item.quantity
                var end = new Date();
                StorageService.readProductsQuantity(0, end).then(function(res){
                    var selectedProduct = res.data.data.filter(function(ele){
                        return ele.name == vm.model.temporary.checkin.item.name
                    })[0]
                    if(selectedProduct.totalQuantity < vm.model.temporary.checkin.item.quantity){
                        vm.model.dom.checkin.order.message.notEnough = true;
                    }else{
                        vm.model.dom.checkin.order.message.notEnough = false;
                        vm.model.items.map (function (x, i, arr){
                            if (x.name == vm.model.temporary.checkin.item.name && vm.model.temporary.checkin.selectedItems.indexOf (x.name) == -1){
                                var obj = Object.assign({},{
                                    quantity: vm.model.temporary.checkin.item.quantity,
                                    _id: x._id,
                                    productName: x.name,
                                    price: x.price
                                });
                                vm.model.checkingin.order.orderline.push (obj);
                                vm.model.temporary.checkin.item = {};
                                vm.model.temporary.checkin.selectedItems.push (x.name);
                                return;
                            }
                            else{
                                // display message
                            }
                        });
                    }
                })
                
            }
        };

        // Remove item from order
        vm.ctrl.checkin.removeItem = function (index){
            if (vm.model.checkingin.order.orderline && vm.model.checkingin.order.orderline.length){
                vm.model.checkingin.order.orderline.splice (index, 1);
                vm.model.temporary.checkin.selectedItems.splice (index, 1);
            }
        };

        ////////// Checkin ////////

        //Confirm checkin
        vm.ctrl.checkin.confirm = function(){
            if(vm.model.checkingin.occupancy.customer._id){
                vm.ctrl.addServiceLabel (vm.model.checkingin.occupancy.service);// Add service label to sent data
                vm.model.checkingin.occupancy.checkinTime = new Date();// Add checkin time to sent data
                vm.model.dom.checkin.confirmDiv = true;

                console.log (vm.model.checkingin.occupancy)
            }
        }

        // After confirm, checkin
        vm.ctrl.checkin.checkin = function (){
            vm.ctrl.showLoader ();
            var customerId = vm.model.checkingin.occupancy.customer._id;

            CheckinService.createOne (customerId, vm.model.checkingin).then(
                function success(res){
                    vm.ctrl.hideLoader ();
                    vm.model.temporary.justCheckedin = res.data.data;
                    if (vm.model.temporary.justCheckedin.order && vm.model.temporary.justCheckedin.order.orderline && vm.model.temporary.justCheckedin.order.orderline.length){
                        // Go on to process order invoice
                        vm.model.temporary.justCheckedin.order.occupancyId = vm.model.temporary.justCheckedin.occupancy._id;
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////// Checkout ///////////////////////////////////////////////

        // check if occ has no parent, will show checkbox
        function showCheckbox(occupancy){
            if(!occupancy.parent && expectedServiceNames.indexOf(occupancy.service.name.toLowerCase ()) > 1){
                vm.model.dom.checkboxDiv = true;
            }else{
                vm.model.dom.checkboxDiv = false;
            }
        }

        // Collect all children with same parent
        function collectChildren(occupancy){
            vm.model.checkedinList.data.map(function(ele){
                if(ele.parent == occupancy._id){
                    if(ele.status == 1){
                        vm.model.temporary.availableChildren.push(ele)
                    }else{
                        vm.model.temporary.disableChildren.push(ele)
                    }
                }
            });
        }

        function getOccMembers(leader, listMember){
            vm.model.temporary.occMembers.push(leader)
            vm.model.checkedinList.data.map(function(ele){
                if(listMember.indexOf(ele._id) > -1){
                    vm.model.temporary.occMembers.push(ele)
                }
            })
        }

        // Get parent for a child
        function getParent(id){
            var groupParent = vm.model.checkedinList.data.filter(function(ele){
                return ele._id == id;
            });
            if(groupParent.length > 0){
                vm.model.temporary.groupParent = groupParent[0].customer.fullname
            }
        }

        vm.ctrl.checkout.getPromocodeNames = function (){
            var codeNames = "";
            vm.model.checkingout.occupancy.promocodes.map (function (x, i, arr){
                codeNames = (codeNames ? codeNames + " / " : "" ) + x.name;
            });

            vm.model.temporary.checkout.invoice.codeNames = codeNames;
        }

        vm.ctrl.checkout.getInvoice = function (occupancy){
            vm.ctrl.showLoader ();
            vm.model.dom.checkOutDiv = true;
            if(occupancy.parent){
                getParent(occupancy.parent)
            }
            CheckinService.readInvoice(occupancy._id).then(
                function success(res){
                    vm.ctrl.hideLoader ();
                    vm.model.checkingout.occupancy = res.data.data;
                    vm.model.temporary.childrenIdList = []
                    vm.model.checkingout.occupancy.note = vm.model.temporary.note; // likely to REMOVE later

                    vm.ctrl.checkout.getPromocodeNames ();

                    vm.ctrl.addServiceLabel (vm.model.checkingout.occupancy.service);
                   
                    showCheckbox(occupancy);
                    collectChildren(occupancy);
                }, 
                function error(err){
                    vm.ctrl.hideLoader ();
                    console.log(err)
                }
            );
        };

        // FIX to apply new model
        // FIX: allow more than one account being used. LATER
        vm.ctrl.checkout.accChangeHandler = function (){
            vm.ctrl.showLoader ();
            var occ = vm.model.checkingout.occupancy;
            var accId = vm.model.temporary.checkout.selectedAccount._id;

            CheckoutService.withdrawOneAccount (occ, accId).then(
                function success (res){
                    vm.ctrl.hideLoader ();
                    vm.model.temporary.checkout.prepaidTotal = res.data.data;
                },
                function error (err){
                    vm.ctrl.hideLoader ();
                    console.log(err)
                }
            )
        }

        // FIX: allow more than one account being used. LATER
        vm.ctrl.checkout.checkout = function (){
            if (vm.model.temporary.checkout.selectedAccount._id){
                vm.model.checkingout.occupancy.paymentMethod = [vm.model.temporary.checkout.prepaidTotal.acc];
            }
            getOccMembers(vm.model.checkingout.occupancy, vm.model.temporary.childrenIdList)
            vm.ctrl.showLoader ();
            if(vm.model.temporary.occMembers.length <= 1){
                CheckinService.checkout(vm.model.checkingout.occupancy)
                    .then(function success(res){
                        vm.ctrl.hideLoader ();
                        vm.ctrl.reset();
                    }, function error(err){
                        vm.ctrl.hideLoader ();
                        console.log(err);
                        // show message
                    })
            }else{
                CheckinService.checkoutGroup(vm.model.temporary.occMembers)
                    .then(function success(res){
                        vm.ctrl.hideLoader ();
                        vm.ctrl.reset();
                    }, function error(err){
                        vm.ctrl.hideLoader ();
                        console.log(err);
                        // show message
                    })
            }
            
        };

        ///////////// Edit ////////////////


        // vm.model.edit.occupancy: editing data will be sent to server
        // vm.model.dom.data.selected.edit.services: all services (same as checkin but for editing). Initial: []
        // vm.model.dom.data.selected.edit.promoteCode.codes: all promoteCodes same as checkin, rewrite this.
        vm.ctrl.edit.edit = function(occupancy){
            vm.model.dom.checkInEditDiv = true;
            vm.model.edit.occupancy = Object.assign({}, occupancy);
            vm.model.search.edit.username = vm.ctrl.edit.createUsernameInitial(vm.model.edit.occupancy.customer);
            // Setup time
            vm.model.temporary.date = new Date(vm.model.edit.occupancy.checkinTime);
            vm.model.temporary.hour = vm.model.temporary.date.getHours();
            vm.model.temporary.min = vm.model.temporary.date.getMinutes();

            vm.ctrl.edit.getItems();
            vm.ctrl.checkin.getGroupPrivateLeader ();// Get group leader use with checkin
            if(vm.model.edit.occupancy.promocodes.length > 0){
                vm.model.temporary.edit.codeName = vm.model.edit.occupancy.promocodes[0].name
            }
            vm.ctrl.checkin.getPromocodes();// Get promocodes use with checkin
            if(vm.model.edit.occupancy.service.name == expectedServiceNames[3] || vm.model.edit.occupancy.service.name == expectedServiceNames[2] || vm.model.edit.occupancy.service.name == expectedServiceNames[4]){
                vm.model.dom.edit.privateGroupLeaderDiv = true;
            }else{
                vm.model.dom.edit.privateGroupLeaderDiv = false;
            }
            vm.model.temporary.edit.selectedGroupPrivate = {};
            if(vm.model.edit.occupancy.parent){
                vm.model.temporary.edit.selectedGroupPrivate = vm.model.temporary.groupPrivateLeaders.filter(function(ele){
                    return ele._id == vm.model.edit.occupancy.parent
                })[0]
            }
            vm.model.dom.data.selected.edit.promoteCode = {}
            // get initial value of code
            
        }

        // Should reset vm.model.dom.data.selected.edit.services, vm.model.edit.occupancy
        vm.ctrl.edit.close = function(){
            // vm.model.dom.checkInEditDiv = false;
            // vm.model.edit.occupancy = {};
            // vm.model.dom.data.selected.edit.services = []

            vm.ctrl.reset ();
        }

        // Get services and put into vm.model.dom.data.selected.edit.services
        vm.ctrl.edit.getItems = function (){
            CheckinService.readSomeProducts().then(
                function success(res){
                    res.data.data.map(function(x, i, arr){
                        if(x.category == 1){
                            vm.model.dom.data.selected.edit.services.push(x);
                        }
                    });

                    // push data into dom.data objects
                    vm.model.dom.data.selected.edit.services.map (function (x, i, arr){
                        vm.ctrl.addServiceLabel (x);
                    });
                },
                function error (err){
                    console.log (err);
                }
            );   
        };

        // Edit
        // Handle when select sevice
        vm.ctrl.edit.serviceChangeHandler = function (){
            vm.model.dom.data.selected.edit.services.map (function (x, i, arr){
                if (x.name.toLowerCase() == vm.model.edit.occupancy.service.name.toLowerCase()){
                    vm.model.edit.occupancy.service.price = x.price;// add price for select service
                    var service = vm.model.edit.occupancy.service.name.toLowerCase();
                    // Do sth when customer does uses private group service
                    if (service != expectedServiceNames[2] && service != expectedServiceNames[3] && service != expectedServiceNames[4]){
                        vm.model.dom.edit.privateGroupLeaderDiv = false;
                    }   
                    else{
                        vm.model.dom.edit.privateGroupLeaderDiv = true;
                    }
                    
                    vm.model.dom.data.selected.edit.promoteCode.codes = vm.ctrl.selectCodesForService(vm.model.edit.occupancy.service.name, vm.model.dom.data.selected.checkin.promoteCode.original);

                    return
                }
            })
        };

        // Promocodes for edit
        // Select and add code
        vm.ctrl.edit.addCode = function (){
            vm.model.edit.occupancy.promocodes = [{name: vm.model.temporary.edit.codeName, status:1}];
            vm.model.temporary.edit.codeNames = [vm.model.temporary.edit.codeName];
            vm.ctrl.edit.validateCodes ();
        };

        // After selecting code, validate it
        // vm.model.dom.data.selected.edit.promoteCode.codes
        vm.ctrl.edit.validateCodes = function (){
            var addedCodes = [];
            if (vm.model.edit.occupancy.promocodes && vm.model.edit.occupancy.promocodes.length){
                addedCodes = vm.model.edit.occupancy.promocodes.map (function(x, i, arr){
                    return x.name;
                });
            }
            var data = {
                codes: addedCodes,
                isStudent: vm.model.edit.occupancy.customer.isStudent,
                service: vm.model.edit.occupancy.service.name
            };
            vm.ctrl.showLoader ();
            CheckinService.validatePromoteCode(data).then(
                function success(res){
                    vm.ctrl.hideLoader ();
                    var foundCodes = res.data.data;
                    vm.model.edit.occupancy.promocodes = foundCodes;
                    vm.model.temporary.edit.codeNames = [];

                    foundCodes.map (function (x, i, arr){
                        vm.model.temporary.edit.codeNames.push (x.name);
                    });

                    if(vm.model.edit.occupancy.promocodes){// show if code valid or not
                        vm.model.edit.occupancy.promocodes.map(function(item){
                            if(vm.model.temporary.edit.codeNames.indexOf(item.name) != -1){
                                item.status = 3;
                            }else{
                                item.status = 2;
                            }
                        })
                    }
                },
                function failure (err){
                    vm.ctrl.hideLoader ();
                    console.log (err);
                }
            )
        }

        // Remove code
        vm.ctrl.edit.removeCode = function(){
            vm.model.edit.occupancy.promocodes = []
            vm.model.temporary.edit.codeName = ''
        };

        ////////////Search customer to edit////////////
        
        // Search customer
        vm.ctrl.edit.searchCustomer =  function (){
            vm.ctrl.showLoader ();
            CheckinService.searchCustomers (vm.model.search.edit.username).then(
                function success (res){
                    if (!res.data){
                        // unexpected result. should never exist
                    }
                    else{
                        if (res.data.data.length){
                            vm.model.search.edit.customers = res.data.data;
                            vm.model.dom.edit.search.message.notFound = false;
                            vm.model.dom.edit.customerSearchResultDiv = true;
                        }
                        else{
                            vm.model.dom.edit.search.message.notFound = true;
                            vm.model.dom.edit.customerSearchResultDiv = false;
                        }
                    }
                    vm.ctrl.hideLoader ();
                }, 
                function error (err){
                    console.log(err);
                    vm.ctrl.hideLoader ();
                }
            );
        };

        // Select one customer to edit
        vm.ctrl.edit.selectCustomer = function (index){
            var selectedCustomer = vm.model.search.edit.customers [index];
            vm.model.edit.occupancy.customer = {
                fullname: selectedCustomer.fullname,
                _id: selectedCustomer._id,
                phone: selectedCustomer.phone[0],
                email: selectedCustomer.email[0],
                isStudent: selectedCustomer.isStudent,
            }
            vm.model.search.edit.username = vm.ctrl.edit.createUsername(selectedCustomer);// display selected customer on search input
            // vm.model.services = []
            // vm.model.items = []
            vm.ctrl.edit.resetSearchCustomerDiv ();// After select we remove search result div
            // vm.ctrl.disablePromocodes()// Check to disable promocodes
        }

        // Display info of selected customer on search input bar
        vm.ctrl.edit.createUsername = function (customer){
            return customer.fullname + (customer.email[0] ? ' / ' + customer.email[0] : '') + (customer.phone[0] ? ' / ' + customer.phone[0] : '');
        };

        vm.ctrl.edit.createUsernameInitial = function (customer){
            return customer.fullname + (customer.email ? ' / ' + customer.email : '') + (customer.phone ? ' / ' + customer.phone : '');
        };

        // remove search results
        vm.ctrl.edit.resetSearchCustomerDiv = function (){
            vm.model.dom.edit.customerSearchResultDiv = false;
            vm.model.search.edit.customers = [];
        };

        // HOLDING
        //Clear search result when search input is empty
        vm.ctrl.edit.validateSearchInput = function(){
            // if(!vm.model.search.edit.username){
            //     vm.model.dom.edit.customerSearchResultDiv = false;
            //     vm.model.edit.occupancy.customer = {};
            // }
        }

        vm.ctrl.edit.selectGroup = function(){
            // If select private group service
            if (vm.model.temporary.edit.selectedGroupPrivate._id){// if select a parent
                vm.model.edit.occupancy.parent = vm.model.temporary.edit.selectedGroupPrivate._id;
                vm.model.edit.occupancy.service = vm.model.temporary.edit.selectedGroupPrivate.service;
            }else{
                vm.model.edit.occupancy.parent = ''
            }
        }

        vm.ctrl.timeChangeHandler = function(){
            vm.model.edit.occupancy.checkinTime = new Date (vm.model.temporary.date.toDateString () + ' ' + vm.model.temporary.hour + ':' + (vm.model.temporary.min ? vm.model.temporary.min : '0'));
        }

        // FIX: got error 
        vm.ctrl.edit.confirm = function(){

            var update = {
                _id: vm.model.edit.occupancy._id,
                service: vm.model.edit.occupancy.service,
                parent: vm.model.edit.occupancy.parent,
                promocodes: vm.model.edit.occupancy.promocodes,
                checkinTime: vm.model.edit.occupancy.checkinTime,
                customer: vm.model.edit.occupancy.customer,
            }

            CheckinService.updateOne(update)
                .then(function (res){
                    vm.ctrl.reset();
                }, function error (err){
                    //
                })
        }

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

        vm.ctrl.checkin.cancel = function (){
            vm.ctrl.checkin.resetCheckinDiv ();
        }

        vm.ctrl.checkin.closeConfirm = function (){
            vm.model.dom.checkin.confirmDiv = false;
        };

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
