(function (){
	angular.module('posApp')
		.controller('NewCheckinCtrl', ['DataPassingService', 'CheckinService', 'OrderService', '$scope', '$window','$route', NewCheckinCtrl])

	function NewCheckinCtrl (DataPassingService, CheckinService, OrderService, $scope, $window, $route){
		var LayoutCtrl = $scope.$parent.layout;
		var vm = this;

		var expectedServiceNames = ['group common', 'individual common', 'small group private', 'medium group private'];

		vm.ctrl = {
			checkin: {},
			checkout: {},
			order: {},
			filter: {},
			sort: {},
		};

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
			},
			checkingCustomer:{
				
			},
			editedCustomer: {

			},
			checkingout: {
				occupancy: {}
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
					products: [],
				},
				checkedinList: true,
				checkInEditDiv: false,
				
				filterDiv: false,
				data: {},
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
				}
			}

		};

		vm.model.dom.data.selected = {};

		// FIX format
		// English version
		vm.model.dom.data.eng = {
			modelLanguage: 'en',
			title: 'Check-in List',
			buttonCheckin: 'Checkin',
			buttonFilter:'Filter',

			selectFirstnameAZ:'Firstname A-Z',
			selectFirstnameZA:'Firstname Z-A',
			selectBookingFarthest: 'Checkin Time Farthest',
			selectCheckinLastest: 'Checkin Time Lastest',

			selectStatusOptionAll: 'All',
			selectStatusOptionCheckin: 'Checkin',
			selectStatusOptionCheckout: 'Checkout',

			fieldSortBy:'Sort By',
			fieldStatus:'Status',
			fieldSearchByFirstname:'Search by Firstname',
			fieldSearchByPhone:'Search by Phone',
			fieldPhoneEmail: 'Phone/Email',
			fieldPromotionCode: 'Promotion Code',
			fieldService:'Service',
			fieldItem: 'Items',
			fieldQuantity: 'Quantity',
			fieldOtherProducts: 'Selected Items',
			fieldProduct:'Product',
			fieldAddItems:'Add Items',
			fieldChooseGroup:'Choose Group',
			fieldCheckoutGroup:'Group',

			invoiceFullname: 'Fullname',
			invoicePhone: 'Phone',
			invoiceOtherProducts: 'Other Products',
			invoiceMainService:'Main Service',
			invoicePromoteCode: 'Promote Code',
			invoiceTotal: 'Total Money',


			headerNo:'No',
			headerName:'Name',
			headerBirthday:'Birthday',
			headerCheckinDate:'Checkin Date',
			headerCheckinTime:'Check-in',
			headerCheckoutDate:'Checkout Date',
			headerCheckoutTime:'Check-out',
			headerService:'Service',
			headerCheckout:'Checkout',
			headerEdit:'Edit',
			parentGroup:'Group',
			noResult: 'There is no result',
			search: {
				message: {
					notFound: 'Not Found!'
				}
			},
		};

		// FIX format
		// Vietnamese version
		vm.model.dom.data.vn = {
			modelLanguage: 'vn',
			title: 'Checkin',
			buttonCheckin: 'Checkin',
			buttonFilter:'Filter',

			selectFirstnameAZ:'Tên A-Z',
			selectFirstnameZA:'Tên Z-A',
			selectBookingFarthest: 'Checkin Z-A',
			selectBookingLastest: 'Checkin A-Z',

			selectStatusOptionAll: 'Tất cả',
			selectStatusOptionCheckin: 'Checkin',
			selectStatusOptionCheckout: 'Checkout',

			fieldSortBy:'Sắp xếp',
			fieldStatus:'Trạng thái',
			fieldSearchByFirstname:'Tên',
			fieldSearchByPhone:'Số điện thoại',
			fieldPhoneEmail: 'Phone/Email',
			fieldPromotionCode: 'Mã giảm giá',
			fieldService:'Dịch vụ',
			fieldItem: 'Sản phẩm',
			fieldQuantity: 'Số lượng',
			fieldOtherProducts: 'Sản phẩm đã chọn',
			fieldProduct:'Sản phẩm',
			fieldAddItems:'Sản phẩm',
			fieldChooseGroup:'Chọn nhóm',
			fieldCheckoutGroup:'Nhóm',

			invoiceFullname: 'Họ và tên',
			invoicePhone: 'Số điện thoại',
			invoiceOtherProducts: 'Sản phẩm',
			invoiceMainService:'Dịch vụ',
			invoicePromoteCode: 'Mã giảm giá',
			invoiceTotal: 'Tổng tiền',

			headerNo:'No',
			headerName:'Họ và tên',
			headerBirthday:'Ngày sinh',
			headerCheckinDate:'Ngày Checkin',
			headerCheckinTime:'Check-in',
			headerCheckoutDate:'Ngày Checkout',
			headerCheckoutTime:'Check-out',
			headerService:'Dịch vụ',
			headerCheckout:'',
			headerEdit:'Chỉnh sửa',
			parentGroup:'Nhóm',
			noResult: 'Không tìm thấy kết quả',
			searchCheckinginCustomerNoResult: 'Không tìm thấy khách hàng ',
			createCustomer: ' Create an account',
			search: {
				message: {
					notFound: 'Không tìm thấy kết quả!',
				}
			},					
		};

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
		}

		vm.ctrl.getCheckedinList = function (){
			var query = {
				status: 4, // get both checked out and checked in
				storeId: LayoutCtrl.model.dept._id,
			}

			CheckinService.getCheckedinList(query).then(
				function success(res){
					vm.model.checkedinList.data = res.data.data;
					vm.model.checkedinList.data.map (function (x, i, arr){
						vm.ctrl.addServiceLabel (x.service);
					});
					
				}, 
				function error(err){
					console.log(err);
				}
			);
		};

		vm.ctrl.setCurrentCus = function (){
			// 
		}

		vm.ctrl.toggleFilterDiv = function (){
			if (!vm.model.dom.filterDiv) {
				vm.model.dom.filterDiv = true;
				vm.model.dom.checkInEditDiv = false;
				vm.model.dom.checkin.checkinDiv = false;
			}
			else vm.model.dom.filterDiv = false;
		};

		vm.ctrl.toggleCheckInDiv = function(){
			if (!vm.model.dom.checkin.checkinDiv){
				vm.model.dom.checkInEditDiv = false; // turn off
				vm.model.dom.filterDiv = false; // turn off				
				vm.ctrl.checkin.initCheckinDiv ();

				if (!vm.model.dom.checkin.products.length){
					vm.ctrl.checkin.getItems ();
				}
				 
			}
			else{
				vm.ctrl.checkin.resetCheckinDiv ();
			}
		};

		vm.ctrl.seeMore = function(){
			if(vm.model.dom.seeMore == true){
				vm.model.dom.seeMore = false
			}else{
				vm.model.dom.seeMore = true
			}
		}

		// Get both items and services
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

		vm.ctrl.checkin.resetSearchCustomerDiv = function (){
			vm.model.dom.checkin.customerSearchResultDiv = false;
			vm.model.search.checkin.customers = [];
		};

		vm.ctrl.checkin.addItem = function (){
			if (vm.model.temporary.checkin.item.quantity && vm.model.temporary.checkin.item.name){
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

		vm.ctrl.checkin.removeItem = function (index){
			if (vm.model.checkingin.order.orderline && vm.model.checkingin.order.orderline.length){
				vm.model.checkingin.order.orderline.splice (index, 1);
				vm.model.temporary.checkin.selectedItems.splice (index, 1);
			}
		};

		vm.ctrl.checkin.addCode = function (){
			if (!vm.model.checkingin.occupancy.promocodes) vm.model.checkingin.occupancy.promocodes = [];

			if (vm.model.temporary.checkin.codeNames.indexOf (vm.model.temporary.checkin.codeName) == -1){
				vm.model.checkingin.occupancy.promocodes.push ({name: vm.model.temporary.checkin.codeName});
				vm.model.temporary.checkin.codeNames.push (vm.model.temporary.checkin.codeName);
				vm.model.temporary.checkin.codeName = null;				
			}

		};

		vm.ctrl.checkin.removeCode = function (index){
			if (vm.model.checkingin.occupancy.promocodes){
				vm.model.checkingin.occupancy.promocodes.splice (index, 1);
				vm.model.temporary.checkin.codeNames.splice (index, 1);
			}
		};

		vm.ctrl.checkin.initCheckinDiv = function (){
			vm.model.dom.checkin.checkinDiv = true;
			vm.ctrl.checkin.getGroupPrivateLeader ();
		}

		// FIX: should not reset the route. only the checkin div
		vm.ctrl.checkin.resetCheckinDiv = function (){
			$route.reload (); 
		}

		vm.ctrl.checkin.cancel = function (){
			vm.ctrl.checkin.resetCheckinDiv ();
		}

		vm.ctrl.checkin.closeConfirm = function (){
			vm.model.dom.checkin.confirmDiv = false;
		};

		vm.ctrl.checkin.searchCustomer =  function (){
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
				}, 
				function error (err){
					console.log(err)
				}
			);
		};

		vm.ctrl.checkin.createUsername = function (customer){
			return customer.fullname + (customer.email[0] ? ' / ' + customer.email[0] : '') + (customer.phone[0] ? ' / ' + customer.phone[0] : '');
		};

		vm.ctrl.checkin.selectCustomer = function (index){
			var selectedCustomer = vm.model.search.checkin.customers [index];

			vm.model.checkingin.occupancy.customer = vm.model.checkingin.order.customer = {
				fullname: selectedCustomer.fullname,
				_id: selectedCustomer._id,
				phone: selectedCustomer.phone[0],
				email: selectedCustomer.email[0],
				isStudent: selectedCustomer.isStudent,
			}
			
			vm.model.search.checkin.username = vm.ctrl.checkin.createUsername(selectedCustomer);
			vm.ctrl.checkin.resetSearchCustomerDiv ();
		}

		vm.ctrl.checkin.serviceChangeHandler = function (){
			vm.model.services.map (function (x, i, arr){
				if (x.name.toLowerCase() == vm.model.checkingin.occupancy.service.name.toLowerCase()){
					vm.model.checkingin.occupancy.service.price = x.price;

					// Do sth when customer does uses private group service
					if (vm.model.checkingin.occupancy.service.name.toLowerCase() != expectedServiceNames[2] && vm.model.checkingin.occupancy.service.name.toLowerCase() != expectedServiceNames[3]){

						vm.model.dom.checkin.privateGroupLeaderDiv = false;
					}	
					else{
						vm.model.dom.checkin.privateGroupLeaderDiv = true;
					}

					return
				}
			})
		};

		vm.ctrl.checkin.selectedGroupChangeHandler = function (){
			if (vm.model.temporary.selectedGroupPrivate._id){
				vm.model.checkingin.occupancy.parent = vm.model.temporary.selectedGroupPrivate._id;
				vm.model.checkingin.occupancy.service = vm.model.temporary.selectedGroupPrivate.service
			} 
		};

		// FIX: Fetching existing groups in client is not a good solution in long-term
		vm.ctrl.checkin.getGroupPrivateLeader = function (){
			vm.model.temporary.groupPrivateLeaders = [{_id: '', groupName: '', leader: ''}];
			vm.model.checkedinList.data.map (function (x, i, arr){
				if ((x.service.name.toLowerCase () == expectedServiceNames[2] || x.service.name.toLowerCase () == expectedServiceNames[3]) && !x.parent){

					vm.model.temporary.groupPrivateLeaders.push ({
						_id: x._id, // occupancy id
						groupName: x.service.label + ' / ' + x.customer.fullname + (' / ' + x.customer.email[0] ? ' / ' + x.customer.email : '') + (x.customer.phone? ' / ' + x.customer.phone : ''),
						leader: x.customer.fullname,
						service: x.service
					});
				}
			});
			
		} 

		//Confirm checkin
		vm.ctrl.checkin.confirm = function(){
			if(vm.model.checkingin.occupancy.customer._id){
				vm.ctrl.addServiceLabel (vm.model.checkingin.occupancy.service);
				vm.model.checkingin.occupancy.checkinTime = new Date();
				vm.model.dom.checkin.confirmDiv = true;
			}
		}

		vm.ctrl.checkin.checkin = function (){
			var customerId = vm.model.checkingin.occupancy.customer._id;
			CheckinService.createOne (customerId, vm.model.checkingin).then(
				function success(res){
					vm.model.temporary.justCheckedin = res.data.data;
					if (vm.model.temporary.justCheckedin.order && vm.model.temporary.justCheckedin.order.orderline && vm.model.temporary.justCheckedin.order.orderline.length){
						// do nothing. Go on to process order invoice
					}
					else{
						vm.ctrl.reset ();
					}
					
	 			}, 
				function error(err){
					console.log(err);
				}
			);			
		};

		// FIX: should validate after adding code
		vm.ctrl.checkin.validateCode = function (){
			if(vm.model.checkingin.occupancy.customer.fullname){
				var codes = [];
				if (vm.model.checkingin.occupancy.promocodes && vm.model.checkingin.occupancy.promocodes.length){
					codes = vm.model.checkingin.occupancy.promocodes.map (function(x, i, arr){
						return x.name;
					});
				}

				var data = {
					codes: codes,
					isStudent: vm.model.checkingin.occupancy.customer.isStudent,
					service: vm.model.checkingin.occupancy.service.name,
				};

				CheckinService.validatePromoteCode(data).then(
					function success(res){
						var foundCodes = res.data.data;
						vm.model.checkingin.occupancy.promocodes = foundCodes;
						vm.model.temporary.checkin.codeNames = [];
						foundCodes.map (function (x, i, arr){
							vm.model.temporary.checkin.codeNames.push (x.name);
						});

						if (foundCodes.length >= codes.length){
							vm.ctrl.checkin.confirm ();
						}
			
					},
					function failure (err){
						console.log (err);
						// display warning
					}
				)
			}
		};

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

		vm.ctrl.checkout.getInvoice = function (occupancy){
			vm.model.dom.checkOutDiv = true;
			CheckinService.readInvoice(occupancy._id).then(
				function success(res){
					vm.model.checkingout.occupancy = res.data.data;
					vm.ctrl.addServiceLabel (vm.model.checkingout.occupancy.service);
					// vm.ctrl.addGroupParent (vm.model.checkingout.occupancy.service) // Build later
				}, 
				function error(err){
					console.log(err)
				}
			);
		
		};

		vm.ctrl.checkout.checkout = function (){
			CheckinService.checkout(vm.model.checkingout.occupancy)
				.then(function success(res){
					vm.ctrl.reset();
					$('#askCheckout').foundation('close');
					$('#announceCheckoutSuccess').foundation('open');

				}, function error(err){
					console.log(err)
				})
		};

		vm.ctrl.checkout.confirm = function (){
			$('#askCheckout').foundation('open');
		};

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

		vm.ctrl.reset = function (){
			$route.reload ();
		};

		////////////////////////////// INITIALIZE ///////////////////////////////		
		angular.element(document.getElementById ('mainContentDiv')).ready(function () {
			vm.model.dom.data.selected = vm.model.dom.data.vn;
			vm.ctrl.getCheckedinList ();
			vm.ctrl.checkinBooking ();
			vm.ctrl.checkinNewCustomer ();
			$scope.$apply();
		});	

	};

}());

