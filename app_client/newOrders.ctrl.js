(function (){
	angular.module('posApp')
		.controller('NewOrdersCtrl', ['OrderService', 'CustomerService', '$scope', '$window','$route', NewOrdersCtrl])

	function NewOrdersCtrl (OrderService, CustomerService, $scope, $window, $route){
		var LayoutCtrl = $scope.$parent.layout;
		var vm = this;

		vm.ctrl = {
			order:{
			},
		}

		vm.model = {
			staff: LayoutCtrl.user,
			company: LayoutCtrl.company,
			dept: LayoutCtrl.dept,
			items: [],
			orderedList: [], // adjusted
			pagination:{
				itemsEachPages:3,
				numberOfPages:''
			},
			orderedListEachPage:{
				data:[]
			},
			originalOrderedList: [],
			ordering: {
				orderline: [],
				staffId: LayoutCtrl.model.user._id,
				location: {
					_id: LayoutCtrl.model.dept._id || LayoutCtrl.model.dept.id,
					name: LayoutCtrl.model.dept.name,
				},				
			},
			dom:{
				messageSearchResult: false,
				checkingInCustomerSearchResult: false,
				orderDiv: false,
				orderList:true,
				order:{
					customerSearchResult: false,
					confirm: false,
					search: {
						message: {
							notFound: false,
						}
						
					},
					customer: [],
				},
				filterDiv: true,	
				data: {}//data about translate

			},
			temporary: {
				ordering: {
					addedItem: [],
				},
				displayedList:{
					data:[]
				}
			},
			search: {
				order: {}
			},
			filter:{
				orderBy:'',
				orderOptions:{
					'customer.fullname': 'Tên A-Z',
					'-customer.fullname':'Tên Z-A',
					'createdAt': 'Create A-Z',
					'-createdAt': 'Create Z-A'
				},
				myfilter:{
					status:'',
				},
				statusOptions:{
					0:'Tất cả', 
					1:'Checkin', 
					2:'Checkout'
				},

				others:{
					customer:{
						fullname:'',
						phone:''
					}
				}
			}
		};

		vm.model.dom.data.selected = {} //Using language

		// FIX format
		vm.model.dom.data.eng = {
			title:'Order List',
			order: {
				search:{
					label:{
						username:'Customer'
					},
					placeholder:{
						username:'Enter phone, email, or full name to search'
					},
					message:{
						notFound:'Not found customer: '
					}
				},
				product:{
					title:'Choose Products',
					label:'Product',
					product:'Product',
					quantity:'Quantity'				
				}
			},
			orderList:{
				header:{
					number:'No',
					fullname:'Fullname',
					product:'Product',
					quantity:'Quantity',
					time:'Time'
				},
				body: {
					message: {
						notFound: 'Not Found!'
					}
				},	
			}
		};



		// FIX format
		vm.model.dom.data.vn = {
			title:'Order List',
			order: {
				search:{
					label:{
						username:'Khách hàng'
					},
					placeholder:{
						username:'Nhập sđt, email, hoặc tên để tìm kiếm khách hàng'
					},
					message:{
						notFound:'Không tìm thấy khách hàng: '
					},
					list:{
						number:'No',
						fullname:'Họ và tên',
						email:'Email',
						phone:'Số điện thoại'
					}
				},
				product:{
					title:'Chọn sản phẩm',
					label:'Thêm sản phẩm',
					product:'Sản phẩm',
					quantity:'Số lượng'
				}
			},
			orderList:{
				header:{
					number:'No',
					fullname:'Họ và tên',
					product:'Sản phẩm',
					quantity:'Số lượng',
					time:'Thời gian'
				},
				body: {
					message: {
						notFound: 'Không có kết quả!'
					}
				},	
			},
			sorting:{
				label:'Sorting'
			},
			filter:{
				status:'Status',
				fullname:'Tên',
				phone:'Số điện thoại'
			}
		};
		
		vm.model.dom.data.selected = vm.model.dom.data.vn
		vm.ctrl = {
			order: {},
			orderedList: {}

		};

		// Rebuilt order list to make it easy for presenting purpose
		vm.ctrl.createAdjustedOrderList = function (orderList){
			var adjusted = [];
			orderList.map (function (x, i, arr){
				x.orderline.map (function (y, t, z){
					y.customer = {fullname: x.customer.fullname};
					y.createdAt = x.createdAt;
					y.orderIndex = i;
					adjusted.push (y);
				});
			});
			return adjusted;
		}

		//Pagination
		vm.ctrl.order.pagination = function(){
			var cleanStr = function(str){
				return LayoutCtrl.ctrl.removeDiacritics(str).trim().split(' ').join('').toLowerCase()
			}
			//data actually show after filter
			vm.model.temporary.displayedList.data = vm.model.originalOrderedList.filter(function(item){
					return cleanStr(item.customer.fullname).includes(cleanStr(vm.model.filter.others.customer.fullname))
				}).filter(function(item){
					return (item.customer.phone).includes(vm.model.filter.others.customer.phone)
				})
			
			//Get number of pages
			vm.model.pagination.numberOfPages = Math.ceil(
				vm.model.temporary.displayedList.data.length/vm.model.pagination.itemsEachPages)

			vm.ctrl.order.getNumberOfPages = function(){
				var arr = []
				for(var i = 1; i<vm.model.pagination.numberOfPages+1; i++){
					arr.push(i)
				}
				return arr
			}

			vm.model.orderedListEachPage.data = vm.model.temporary.displayedList.data.slice(0, vm.model.pagination.itemsEachPages)

			//slice array to pages
			vm.ctrl.order.sliceOrderedList = function(i){
				vm.model.orderedListEachPage.data = vm.model.temporary.displayedList.data.slice((i-1)*vm.model.pagination.itemsEachPages,i*vm.model.pagination.itemsEachPages)
			}

			//show correct orders in each slice in each page
			vm.ctrl.order.showInPage = function(occ){
				var testArr = vm.model.orderedListEachPage.data.filter(function(ele){
					return ele.createdAt == occ.createdAt
				})
				if(testArr.length > 0){
					return true
				}else{
					return false
				}
			}
		}

		// FIX: only get orders from the store
		vm.ctrl.getOrderedList = function (){
			var query = {storeId: LayoutCtrl.model.dept._id};
			OrderService.getOrderList(query).then(
				function success(res){
					vm.model.originalOrderedList = res.data.data;
					vm.model.orderedList = vm.ctrl.createAdjustedOrderList (vm.model.originalOrderedList);
					vm.ctrl.order.pagination();
				}, 
				function error(err){
					console.log(err)
				}
			);			
		}

		// FIX: should reset only order div
		vm.ctrl.toggleOrderDiv = function (){
			if (vm.model.dom.orderDiv){
				vm.ctrl.reset ();
			}
			else{
				vm.model.dom.orderDiv = true;
				vm.model.dom.filterDiv = false;
			}
		}

		vm.ctrl.toggleFilterDiv = function (){
			if (!vm.model.dom.filterDiv) {
				vm.ctrl.reset()
				vm.model.dom.filterDiv = true;
				vm.model.dom.orderDiv = false;
			}
			else vm.model.dom.filterDiv = false;
		};

		vm.ctrl.order.resetSearchCustomerDiv = function (){
			vm.model.dom.order.customerSearchResult = false;
			vm.model.search.order.customers = [];
		};

		vm.ctrl.order.getItems = function (){
			OrderService.readSomeProducts().then(
				function success(res){
					res.data.data.map(function(x, i, arr){
						if(x.category != 1){
							vm.model.items.push(x);
						}
					});
					vm.model.dom.data.selected.items = vm.model.items;
				},
				function error (err){
					console.log (err);
				}
			);			
		};


		vm.ctrl.order.searchCustomer =  function (){
			CustomerService.readCustomers (vm.model.search.order.username).then(
				function success (res){
					if (!res.data){
						// unexpected result. should never exist
					}
					else{
						if (res.data.data.length){
							vm.model.search.order.customers = res.data.data;
							vm.model.dom.order.search.message.notFound = false;
							vm.model.dom.order.customerSearchResult = true;
							
						}
						else{
							vm.model.dom.order.search.message.notFound = true;
							vm.model.dom.order.customerSearchResult = false;
						}
					}
				}, 
				function error (err){
					console.log(err)
				}
			);
		};

		vm.ctrl.order.clearSearchInput = function(){
			if(!vm.model.search.order.username){
				if(vm.model.ordering.customer){
					vm.model.ordering.customer = {};
				}
				vm.ctrl.order.resetSearchCustomerDiv()
				vm.model.dom.order.search.message.notFound = false
			}
		}

		vm.ctrl.order.selectCustomer = function (index){
			vm.model.ordering.customer = {
				fullname: vm.model.search.order.customers [index].fullname,
				_id: vm.model.search.order.customers [index]._id,
				phone: vm.model.search.order.customers [index].phone[0],
				email: vm.model.search.order.customers [index].email[0]	,
				isStudent: vm.model.search.order.customers [index].isStudent,

			}

			if (vm.model.search.order.customers [index].checkinStatus){
				vm.model.ordering.occupancyId = vm.model.search.order.customers [index].occupancy.pop ();
			}

			vm.model.search.order.username = vm.model.search.order.customers[index].fullname + (vm.model.search.order.customers [index].email[0] ? ' / ' + vm.model.search.order.customers [index].email[0] : '') + (vm.model.search.order.customers [index].phone[0] ? ' / ' + vm.model.search.order.customers [index].phone[0] : '');

			vm.ctrl.order.resetSearchCustomerDiv ();
		};

		vm.ctrl.order.addItem = function (){
			if (vm.model.temporary.ordering.item.quantity && vm.model.temporary.ordering.item.name && vm.model.ordering.customer){
				vm.model.items.map (function (x, i, arr){

					if (x.name == vm.model.temporary.ordering.item.name && vm.model.temporary.ordering.addedItem.indexOf (x.name) == -1){
						var obj = Object.assign({},{
							quantity: vm.model.temporary.ordering.item.quantity,
							_id: x._id,
							productName: x.name,
							price: x.price
						});

						vm.model.ordering.orderline.push (obj);
						vm.model.temporary.ordering.item = {};
						vm.model.temporary.ordering.addedItem.push (x.name);

						return;
					}
					else{
						// display message
					}
				});
			}
		};

		vm.ctrl.order.removeItem = function (index){
			if (vm.model.ordering.orderline && vm.model.ordering.orderline.length){
				
				vm.model.ordering.orderline.splice (index, 1);
				vm.model.temporary.ordering.addedItem.splice (index, 1);
			}
		};

		vm.ctrl.order.addCode = function (){
			// later
		}

		vm.ctrl.order.validateCodes = function (){
			// later
		}

		// FIX: need to implememnt
		vm.ctrl.order.validate = function (){
			// validate
			if(vm.model.ordering.customer._id && vm.model.ordering.orderline.length){
				vm.ctrl.order.getInvoice ();
			}
			else {
				// display warning
			}
		}

		vm.ctrl.order.getInvoice = function (){
			vm.ctrl.showLoader ();
			OrderService.getInvoice (vm.model.ordering).then (
				function success (res){
					vm.ctrl.hideLoader ();
					vm.model.ordering = res.data.data;
					vm.model.dom.order.confirm = true;
				},
				function failure (err){
					console.log (err);
					vm.ctrl.hideLoader ();
					// display warning
				}
			)			
		}

		vm.ctrl.order.confirm = function (){
			vm.ctrl.showLoader ();
			OrderService.confirmOrder (vm.model.ordering).then (
				function success (res){
					vm.ctrl.hideLoader ();
					vm.ctrl.reset ();
				},
				function failture (err){
					console.log (err);
					vm.ctrl.hideLoader ();
				}
			)
		}		

		vm.ctrl.order.closeInvoice = function (){
			vm.model.dom.order.confirm = false;
		}

		vm.ctrl.orderedList.selectPage = function (){
			//
		}

		vm.ctrl.showLoader = function (){
			LayoutCtrl.ctrl.showTransLoader ();
		};

		vm.ctrl.hideLoader = function (){
			LayoutCtrl.ctrl.hideTransLoader ();
		};	

		vm.ctrl.reset = function (){
			$route.reload ();
		};		

		////////////////////////////// INITIALIZE ///////////////////////////////		
		angular.element(document.getElementById ('mainContentDiv')).ready(function () {
			vm.model.dom.data.selected = vm.model.dom.data.vn;
			vm.ctrl.order.getItems ();
			vm.ctrl.getOrderedList ();
			$scope.$apply();
		});	

	};

}());