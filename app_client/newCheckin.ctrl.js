(function() {
    angular.module('posApp')
        .controller('NewCheckinCtrl', ['$http', 'DataPassingService', 'CheckinService', 'OrderService', 'checkoutService', '$scope', '$window', '$route', 'StorageService', NewCheckinCtrl])

    function NewCheckinCtrl ($http, DataPassingService, CheckinService, OrderService, CheckoutService, $scope, $window, $route, StorageService){
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
                edit: {},
                checkboxDiv: false // Div contain checkbox to add member to checkout with leader
            },
            search: {
                checkin: {
                    username: '',
                    customers: [],
                }
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

        // Reference for model, ctrl

        
        // vm.model.dom.checkin.checkinDiv: checkin div dom
        // vm.model.dom.checkInEditDiv: edit form dom
        // vm.model.dom.filterDiv: filter dom
        // vm.model.dom.checkin.confirmDiv: confirm checkin div
        // vm.model.dom.checkOutDiv: checkout div
        // vm.model.dom.checkInEditDiv: edit div

        // vm.model.temporary.groupPrivateLeaders: group leader, contain array of {_id: '', groupName: '', leader: '', service:''}

        // vm.model.search.checkin.username: search input
        // vm.model.search.checkin.customers: search results
        // vm.model.dom.checkin.search.message.notFound: not found message div
        // vm.model.dom.checkin.customerSearchResultDiv: customer result div
        // vm.model.checkingin.occupancy.customer: customer info of occupancy will be sent to server

        // vm.model.checkingin.occupancy.service.name: selected service
        // vm.model.dom.checkin.privateGroupLeaderDiv: group leader div, only visible if select private group
        // vm.model.temporary.selectedGroupPrivate: contain selected private group, use when select parent for a service

        // vm.model.temporary.checkin.codeName: model contain code name of selected promocodes
        // vm.model.temporary.checkin.codeNames: use to check valid code or not

        // vm.model.temporary.checkin.item.quantity: order quantity selected in dom
        // vm.model.temporary.checkin.item.name: order name selected in dom
        // vm.model.temporary.checkin.selectedItems: names of all selected items
        // vm.model.checkingin.order.orderline: array all selected items, to show in dom

        // vm.model.temporary.justCheckedin: returned customer after checkin

        // vm.model.edit: model used to sent to server to edit

        // vm.model.checkingin: data will be sent to checkin
        // vm.model.checkingin.occupancy: occupancy data
        // vm.model.checkingin.order: order data

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////// Selected Dom /////////////////////////////////////////////////////
        
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
        vm.ctrl.getFilteredCheckinList = function (){
            var cleanStr = function(str){
                return LayoutCtrl.ctrl.removeDiacritics(str).trim().split(' ').join('').toLowerCase()
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

        // Toggle Checkin Div
        vm.ctrl.openCheckinDiv = function(){
            vm.model.dom.checkInEditDiv = false; // turn off
            vm.model.dom.filterDiv = false; // turn off             
            vm.ctrl.checkin.initCheckinDiv (); // Trigger get group of leaders

            if (!vm.model.dom.data.selected.services && !vm.model.dom.data.selected.items){
                vm.ctrl.checkin.getItems ();
            }
        };

        vm.ctrl.toggleFilterDiv = function (){
            if (!vm.model.dom.filterDiv) {
                vm.model.dom.filterDiv = true;
                vm.model.dom.checkInEditDiv = false;
                vm.model.dom.checkin.checkinDiv = false;
            }
            else vm.model.dom.filterDiv = false;
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////// Get group leaders /////////////////////////////////////////////////////
        
        vm.ctrl.checkin.initCheckinDiv = function (){
            vm.model.dom.checkin.checkinDiv = true;
            vm.ctrl.checkin.getGroupPrivateLeader ();
            vm.ctrl.checkin.getPromocodes();
        }

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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////Search customer to checkin//////////////////////////////////////
        
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////// Get promocodes ////////////////////////////////////////////////////////
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

            vm.ctrl.showLoader ();

            CheckinService.getPromocodes ().then (
                function success (res){
                    vm.ctrl.hideLoader ();
                    var codes = res.data.data;
                    if (codes.length){
                        vm.ctrl.checkin.addCodeLabels (codes);
                        vm.model.dom.data.selected.checkin.promoteCode.original = codes.sort (function (a, b){
                                return a.selectedLabel > b.selectedLabel;
                            }
                        );

                        vm.ctrl.disablePromocodes() // check disable
                        
                        // when open edit.
                        // FIX
                        if(vm.model.dom.checkInEditDiv){
                            vm.model.dom.data.selected.edit.promoteCode = {}
                            vm.model.dom.data.selected.edit.promoteCode.codes = vm.ctrl.selectCodesForService(vm.model.edit.occupancy.service.name, vm.model.dom.data.selected.checkin.promoteCode.original)
                        }

                        // when checkin a booking
                        if (vm.model.checkingin.occupancy.customer && vm.model.checkingin.occupancy.service.name){
                            vm.model.dom.data.selected.checkin.promoteCode.codes = vm.ctrl.selectCodesForService(vm.model.checkingin.occupancy.service.name, vm.model.dom.data.selected.checkin.promoteCode.original);                  
                        }

                    }
                    else {
                        // do nothing
                    }
                },
                function error (err){
                    vm.ctrl.hideLoader ();
                    console.log (err);
                }
            )
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////// Select Promocodes ////////////////////////////////////////////////

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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////Get services and products ///////////////////////////////////////
        // vm.model.services: all services from db, need to add label
        // vm.model.items: all items
        // vm.model.dom.data.selected.services: use for dom selection, equal vm.model.services
        // vm.model.dom.data.selected.items: use for dom selection, equal vm.mode.items

        vm.ctrl.checkin.getItems = function (){
            if(vm.model.checkingin.occupancy.customer.fullname){

                CheckinService.readSomeProducts().then(
                    function success(res){
                        res.data.data.map(function(x, i, arr){
                            if(x.category == 1){
                                vm.model.services.push(x);
                            }
                        });                     

                        res.data.data.map(function(x, i, arr){
                            if(x.category != 1){
                                vm.model.items.push(x);
                            }
                        });

                        vm.model.items = vm.model.items.sort (function (a, b){
                            return a.name.localeCompare (b.name)
                        });

                        // push data into dom.data objects
                        vm.model.services.map (function (x, i, arr){
                            vm.ctrl.addServiceLabel (x);
                        });
                        
                        vm.model.services = vm.model.services.sort (function (a, b){
                            return a.label.localeCompare (b.label)
                        });   

                        vm.model.dom.data.selected.services = vm.model.services;
                        vm.model.dom.data.selected.items = vm.model.items;
                    },
                    function error (err){
                        console.log (err);
                    }
                );          
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////// Select services ////////////////////////////////////////////////

        // Handle when select sevice
        vm.ctrl.checkin.serviceChangeHandler = function (){
            if(vm.model.checkingin.occupancy.customer.fullname){
                vm.model.services.map (function (x, i, arr){
                    if (x.name.toLowerCase() == vm.model.checkingin.occupancy.service.name.toLowerCase()){
                        vm.model.checkingin.occupancy.service.price = x.price;// add price for select service
                        var service = vm.model.checkingin.occupancy.service.name.toLowerCase();
                        // Do sth when customer does uses private group service
                        if (service != expectedServiceNames[2] && service != expectedServiceNames[3] && service != expectedServiceNames[4]){
                            vm.model.dom.checkin.privateGroupLeaderDiv = false;
                        }   
                        else{
                            vm.model.dom.checkin.privateGroupLeaderDiv = true;
                        }
                        
                        vm.model.dom.data.selected.checkin.promoteCode.codes = vm.ctrl.selectCodesForService(vm.model.checkingin.occupancy.service.name, vm.model.dom.data.selected.checkin.promoteCode.original);

                        return
                    }
                })
                vm.ctrl.disablePromocodes()
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////// Select Orders //////////////////////////////////////////////////
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////// Checkin ////////////////////////////////////////////////

        //Confirm checkin
        vm.ctrl.checkin.confirm = function(){
            if(vm.model.checkingin.occupancy.customer._id){
                vm.ctrl.addServiceLabel (vm.model.checkingin.occupancy.service);// Add service label to sent data
                vm.model.checkingin.occupancy.checkinTime = new Date();// Add checkin time to sent data
                vm.model.dom.checkin.confirmDiv = true;
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
        vm.model.temporary.occMembers = []
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
            })
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
                    console.log(vm.model.checkingout.occupancy)
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////// Edit ///////////////////////////////////////////////////

        // vm.model.edit.occupancy: editing data will be sent to server
        // vm.model.dom.data.selected.edit.services: all services (same as checkin but for editing). Initial: []
        // vm.model.dom.data.selected.edit.promoteCode.codes: all promoteCodes same as checkin, rewrite this.
        vm.ctrl.edit.edit = function(occupancy){
            vm.model.dom.checkInEditDiv = true;
            vm.model.edit.occupancy = Object.assign({}, occupancy);
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
            vm.model.dom.checkInEditDiv = false;
            vm.model.edit.occupancy = {};
            vm.model.dom.data.selected.edit.services = []
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
            console.log(vm.model.edit.occupancy.promocodes, vm.model.temporary.edit.codeNames)
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
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
            vm.ctrl.getCheckedinList ();// get checkin list
        });

    }
}())
