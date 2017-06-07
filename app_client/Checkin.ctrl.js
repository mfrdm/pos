(function() {
    angular.module('posApp')
        .controller('NewCheckinCtrl', ['$http', 'DataPassingService', 'CheckinService', 'OrderService', 'checkoutService', '$scope', '$window', '$route', NewCheckinCtrl])

    function NewCheckinCtrl ($http, DataPassingService, CheckinService, OrderService, CheckoutService, $scope, $window, $route){
    	var LayoutCtrl = DataPassingService.get('layout');
        var vm = this;

        vm.ctrl = {
            checkin: {},
            checkout: {},
            order: {},
            filter: {},
            sort: {},
            edit: {}
        }; // Everything about ctroller

        vm.model = {
            staff: LayoutCtrl.user,
            company: LayoutCtrl.company,
            dept: LayoutCtrl.dept,
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
                },
                displayedList: {
                    data: [],
                    number: []
                },
                note: "",
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

        // vm.model.checkedinList.data: array contains all occs today
        // vm.model.dom.checkin.checkinDiv: checkin div dom
        // vm.model.dom.checkInEditDiv: edit form dom
        // vm.model.dom.filterDiv: filter dom
        // vm.model.dom.checkin.confirmDiv: confirm checkin div
        // vm.model.dom.checkOutDiv: checkout div
        // vm.model.dom.checkInEditDiv: edit div

        // vm.model.temporary.groupPrivateLeaders: group leader, contain array of {_id: '', groupName: '', leader: '', service:''}

        // vm.model.dom.data.selected.checkin.promoteCode.original: all the codes get from db, 
        // vm.model.dom.data.selected.checkin.promoteCode.codes: codes for each kind of service; each time we select a service, this will change

        // vm.model.services: all services from db, need to add label
        // vm.model.items: all items
        // vm.model.dom.data.selected.services: use for dom selection, equal vm.model.services
        // vm.model.dom.data.selected.items: use for dom selection, equal vm.mode.items

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
        // Label for services
        var expectedServiceNames = ['group common', 'individual common', 'small group private', 'medium group private', 'large group private'];

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////// Implement data from booking and customer page to checkin//////////////////

        vm.ctrl.checkinBooking = function (){
			var b = DataPassingService.get ('booking');
			
			if (b){
				vm.ctrl.toggleCheckInDiv ();
				Object.assign (vm.model.checkingin.occupancy, b);
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
				vm.ctrl.toggleCheckInDiv ();
				vm.model.checkingin.occupancy.customer = vm.model.checkingin.order.customer = c;
				var tempCustomer = {
					email: [c.email],
					phone: [c.phone],
					fullname: c.fullname,
				}
				vm.model.search.checkin.username = vm.ctrl.checkin.createUsername (tempCustomer);			
				DataPassingService.reset ('customer');
			}			
		}

		///////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////// INITIALIZE //////////////////////////////////////////////
		
		angular.element(document.getElementById ('mainContentDiv')).ready(function () {// after page load
			vm.ctrl.getCheckedinList ();// get checkin list
			vm.model.dom.data.selected = vm.model.dom.data.vn; // Select vietnamese mode
		});

		// Get checkin list when load page
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

			vm.model.checkinListEachPage.data = afterFilterList.slice(0, vm.model.checkedinList.pagination.itemsEachPages)
			vm.ctrl.sliceCheckinList = function(i){
				vm.model.checkinListEachPage.data = afterFilterList.slice((i-1)*vm.model.checkedinList.pagination.itemsEachPages,i*vm.model.checkedinList.pagination.itemsEachPages)
				vm.model.temporary.displayedList.number.map(function(ele, index, array){
					if(index == i-1){
						array[index].class = 'current'
					}else{
						array[index].class = ''
					}
					
				})
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
		vm.ctrl.toggleCheckInDiv = function(){
			if (!vm.model.dom.checkin.checkinDiv){
				vm.model.dom.checkInEditDiv = false; // turn off
				vm.model.dom.filterDiv = false; // turn off				
				vm.ctrl.checkin.initCheckinDiv (); // Trigger get promocodes and group of leaders

				if (!vm.model.dom.data.selected.services && !vm.model.dom.data.selected.items){
					vm.ctrl.checkin.getItems ();
				}
				 
			}
			else{
				vm.ctrl.checkin.resetCheckinDiv ();
			}
			vm.ctrl.disableService();
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
		/////////////////////////////// Get promocodes and group leaders ////////////////////////////////////////
		
		vm.ctrl.checkin.initCheckinDiv = function (){
			vm.model.dom.checkin.checkinDiv = true;
			vm.ctrl.checkin.getGroupPrivateLeader ();
			vm.ctrl.checkin.getPromocodes ();
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
		vm.ctrl.disableService = function(){
			if((vm.model.checkingin.occupancy.customer && vm.model.checkingin.occupancy.service.name) || vm.model.edit.service.name){// condition to not disable
				vm.model.dom.data.selected.checkin.promoteCode.codes.map(function(ele){
					return ele.disabled = false;
				})
			}else{
				vm.model.dom.data.selected.checkin.promoteCode.codes.map(function(ele){
					return ele.disabled = true;
				})
			}
		}	

		// Get promocodes
		vm.ctrl.checkin.getPromocodes = function (){
			if (vm.model.dom.data.selected.checkin.promoteCode.codes.length){
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
								return a.selectedLabel > b.selectedLabel
							}
						);
						vm.model.dom.data.selected.checkin.promoteCode.codes = vm.model.dom.data.selected.checkin.promoteCode.original // At the beginning we set vm.model.dom.data.selected.checkin.promoteCode.codes default
						vm.ctrl.disableService() // check disable
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
		/////////////////////////////////////Get services and products ///////////////////////////////////////
		
		vm.ctrl.checkin.getItems = function (){
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

					// push data into dom.data objects
					vm.model.services.map (function (x, i, arr){
						vm.ctrl.addServiceLabel (x);
					});
					
					vm.model.dom.data.selected.services = vm.model.services;
					vm.model.dom.data.selected.items = vm.model.items;
				},
				function error (err){
					console.log (err);
				}
			);			
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
			vm.ctrl.checkin.resetSearchCustomerDiv ();// After select we remove search result div
			vm.ctrl.disableService()// Check to disable promocodes
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
		////////////////////////////////////// Select services ////////////////////////////////////////////////

		// Handle when select sevice
		vm.ctrl.checkin.serviceChangeHandler = function (){
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
					// edit code depends on services
					vm.model.dom.data.selected.checkin.promoteCode.codes = vm.model.dom.data.selected.checkin.promoteCode.original.filter(function(ele){
						return ele.services.indexOf(vm.model.checkingin.occupancy.service.name) > -1
					})// After select service, check which promocodes will be shown for that service
					return
				}
			})
			vm.ctrl.disableService()
		};

		// If select private group service
		vm.ctrl.checkin.selectedGroupChangeHandler = function (){
			if (vm.model.temporary.selectedGroupPrivate._id){// if select a parent
				vm.model.checkingin.occupancy.parent = vm.model.temporary.selectedGroupPrivate._id;
				vm.model.checkingin.occupancy.service = vm.model.temporary.selectedGroupPrivate.service;
			} 
		};

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
					service: vm.model.checkingin.occupancy.service.name,
				};
				vm.ctrl.showLoader ();
				CheckinService.validatePromoteCode(data).then(
					function success(res){
						vm.ctrl.hideLoader ();
						var foundCodes = res.data.data;
						vm.model.checkingin.occupancy.promocodes = foundCodes;
						vm.model.temporary.checkin.codeNames = [];

						foundCodes.map (function (x, i, arr){
							vm.model.temporary.checkin.codeNames.push (x.name);
						});
						if(vm.model.checkingin.occupancy.promocodes){// show if code valid or not
							vm.model.checkingin.occupancy.promocodes.map(function(item){
								if(vm.model.temporary.checkin.codeNames.indexOf(item.name.toLowerCase()) != -1){
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
		////////////////////////////////////// Select Orders //////////////////////////////////////////////////

		// Add item to order
		vm.ctrl.checkin.addItem = function (){
			if (vm.model.temporary.checkin.item.quantity && vm.model.temporary.checkin.item.name && vm.model.checkingin.occupancy.customer){
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
					console.log(res.data.data)
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
			if(!occupancy.parent && expectedServiceNames.indexOf(occupancy.service.name) > 1){
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

		vm.ctrl.checkout.getInvoice = function (occupancy){

			vm.ctrl.showLoader ();
			vm.model.dom.checkOutDiv = true;
			CheckinService.readInvoice(occupancy._id).then(
				function success(res){
					vm.ctrl.hideLoader ();
					vm.model.checkingout.occupancy = res.data.data;
					vm.model.checkingout.occupancy.childrenIdList = []
					vm.model.checkingout.occupancy.note = vm.model.temporary.note; // likely to REMOVE later

					vm.ctrl.addServiceLabel (vm.model.checkingout.occupancy.service);
					showCheckbox(occupancy)
					collectChildren(occupancy)
				}, 
				function error(err){
					vm.ctrl.hideLoader ();
					console.log(err)
				}
			);
		};

		vm.ctrl.checkout.accChangeHandler = function (){
			vm.ctrl.showLoader ();
			var occ = vm.model.checkingout.occupancy;
			var accId = vm.model.temporary.checkout.selectedAccount._id;

			CheckoutService.withdrawOneAccount (occ, accId).then(
				function success (res){
					vm.ctrl.hideLoader ();
					vm.model.temporary.checkout.reaminTotal = res.data.data.total;
					vm.model.temporary.checkout.withdrawnUsage = res.data.data.withdrawnUsage;
					vm.model.temporary.checkout.accAmountRemain = res.data.data.accAmountRemain;


				},
				function error (err){
					vm.ctrl.hideLoader ();
					console.log(err)
				}
			)
		}

		vm.ctrl.checkout.checkout = function (){
			// assume if the object exist, account is used to pay
			// at this moment, only one account is used at one checkout time

			if (vm.model.temporary.checkout.selectedAccount._id){
				vm.model.checkingout.occupancy.paymentMethod = [{
					methodId: vm.model.temporary.checkout.selectedAccount._id, 
					name: 'account', 
					amount: vm.model.temporary.checkout.withdrawnUsage,
					paid: vm.model.checkingout.occupancy.total - vm.model.temporary.checkout.reaminTotal,
				}]
			}

			vm.ctrl.showLoader ();
			// console.log(vm.model.checkingout.occupancy.childrenIdList)
			CheckinService.checkout(vm.model.checkingout.occupancy)
				.then(function success(res){
					vm.ctrl.hideLoader ();
					vm.ctrl.reset();
				}, function error(err){
					vm.ctrl.hideLoader ();
					console.log(err);
					// show message
				})
		};

		///////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////// Edit ///////////////////////////////////////////////////

		vm.ctrl.edit.edit = function(occupancy){
			vm.model.dom.checkInEditDiv = true;
			vm.model.edit = occupancy;
			vm.ctrl.checkin.getItems();
			vm.ctrl.checkin.getGroupPrivateLeader ();
			vm.ctrl.checkin.getPromocodes ();
		}

		vm.ctrl.edit.close = function(){
			vm.model.dom.checkInEditDiv = false;
			vm.model.edit = {}
		}

		vm.ctrl.edit.selectService = function(){
			vm.model.services.map (function (x, i, arr){
				if (x.name.toLowerCase() == vm.model.edit.service.name.toLowerCase()){
					vm.model.edit.service.price = x.price;
					
					var service = vm.model.edit.service.name.toLowerCase();
					// Do sth when customer does uses private group service
					if (service != expectedServiceNames[2] && service != expectedServiceNames[3] && service != expectedServiceNames[4]){
						vm.model.dom.edit.privateGroupLeaderDiv = false;
					}	
					else{
						vm.model.dom.edit.privateGroupLeaderDiv = true;
					}

					// edit code depends on services
					vm.model.dom.data.selected.checkin.promoteCode.codes = vm.model.dom.data.selected.checkin.promoteCode.original.filter(function(ele){
						return ele.services.indexOf(vm.model.edit.service.name) > -1
					})

					return
				}
			})
		}

		vm.ctrl.edit.validateCodes = function (){
			// not
			var addedCodes = [];
			if (vm.model.edit.promocodes && vm.model.edit.promocodes.length){
				addedCodes = vm.model.edit.promocodes.map (function(x, i, arr){
					return x.name;
				});
			}

			var data = {
				codes: addedCodes,
				isStudent: vm.model.edit.customer.isStudent,
				service: vm.model.edit.service.name,
			};

			vm.ctrl.showLoader ();

			CheckinService.validatePromoteCode(data).then(
				function success(res){

					vm.ctrl.hideLoader ();
					var foundCodes = res.data.data;
					vm.model.edit.promocodes = foundCodes;
					vm.model.temporary.checkin.codeNames = [];

					foundCodes.map (function (x, i, arr){
						vm.model.temporary.checkin.codeNames.push (x.name);
					});

					if(vm.model.edit.promocodes){
						vm.model.edit.promocodes.map(function(item){
							if(vm.model.temporary.checkin.codeNames.indexOf(item.name.toLowerCase()) != -1){
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

		vm.ctrl.edit.addCode = function (){
			if(vm.model.edit.customer.fullname){
				vm.model.edit.promocodes = [{name: vm.model.temporary.checkin.codeName, status:1}];
				vm.model.temporary.checkin.codeNames = [vm.model.temporary.checkin.codeName];

				vm.ctrl.edit.validateCodes ();
			}
		};

		vm.ctrl.edit.removeCode = function(){
			vm.model.edit.promocodes = []
			vm.model.temporary.checkin.codeName = ''
		};

		vm.ctrl.edit.selectGroup = function(){
			console.log(vm.model.temporary.edit.selectedGroupPrivate)
		}

		vm.ctrl.edit.confirm = function(){
			console.log(vm.model.edit)
		}

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
			// Clear model related to checkin data
			vm.model.checkingin.occupancy.checkinTime = {};
			vm.model.checkingin.occupancy.customer = {};
			vm.model.checkingin.occupancy.promocodes = [];
			vm.model.checkingin.occupancy.service = {};

			vm.model.temporary.checkin.codeName = ''

			vm.model.checkingin.order.customer = {};
			vm.model.checkingin.order.orderline = [];
			vm.model.temporary.checkin.selectedItems = [];

			// Search div
			vm.model.dom.checkin.customerSearchResultDiv = false;
			vm.model.search.checkin.customers = []

			vm.model.dom.checkin.checkinDiv = false;
			vm.model.search.checkin.username = '';
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
    }
}())
