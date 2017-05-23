(function (){
	angular.module('posApp')
		.controller('NewOrdersCtrl', ['OrderService', 'CustomerService', '$scope', '$window','$route', NewOrdersCtrl])

	function NewOrdersCtrl (OrderService, CustomerService, $scope, $window, $route){
		var LayoutCtrl = $scope.$parent.layout;
		var vm = this;

		vm.model = {
			staff: LayoutCtrl.user,
			company: LayoutCtrl.company,
			dept: LayoutCtrl.dept,
			items: [],
			orderedList: [], // adjusted
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
				filterDiv: false,
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
				data: {}//data about translate

			},
			temporary: {
				ordering: {
					addedItem: [],
				}
			},
			search: {
				order: {}
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

		// FIX: only get orders from the store
		vm.ctrl.getOrderedList = function (){
			var query = {storeId: LayoutCtrl.model.dept._id};
			OrderService.getOrderList(query).then(
				function success(res){
					vm.model.originalOrderedList = res.data.data;
					vm.model.orderedList = vm.ctrl.createAdjustedOrderList (vm.model.originalOrderedList);
					
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
			}
		}


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
			if (vm.model.temporary.ordering.item.quantity && vm.model.temporary.ordering.item.name){
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
			OrderService.getInvoice (vm.model.ordering).then (
				function success (res){
					vm.model.ordering = res.data.data;
					vm.model.dom.order.confirm = true;
				},
				function failure (err){
					console.log (err);
					// display warning
				}
			)			
		}

		vm.ctrl.order.confirm = function (){
			console.log (vm.model.ordering)
			OrderService.confirmOrder (vm.model.ordering).then (
				function success (res){
					vm.ctrl.reset ();
				},
				function failture (){

				}
			)
		}		

		vm.ctrl.order.closeInvoice = function (){
			vm.model.dom.order.confirm = false;
		}

		vm.ctrl.orderedList.selectPage = function (){
			//
		}

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