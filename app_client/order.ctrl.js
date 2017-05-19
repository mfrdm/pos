angular.module('posApp')
	.controller('OrderCtrl', ['$scope', '$window','$route','OrderService', OrderCtrl])

function OrderCtrl ($scope, $window, $route, OrderService){
	var LayoutCtrl = $scope.$parent.layout;
	var vm = this;

	//////////////////////////////////////////////////////////////////////////////////
	//Models
	//Root vm
	vm.model = {
		search:{},//Search model
		order:{
			orderline:[],
		},//Customer model
		orderList:[],
		customer:{services:[]},
		filter:{},//Filter model
		other:{}//Other models
	};
	vm.ctrl = {};
	//DOM
	vm.model.dom = {
		messageSearchResult: false,
		checkingInCustomerSearchResult: false,
		filterDiv: true,
		orderDiv: true,
		orderListDiv:true,
		dataDom: {}//data about translate
	}
	//Translate English Vietnamese
	vm.model.dom.dataDom.using = {}//Using language
	vm.model.dom.dataDom.eng = {
		title: 'Order',
		buttonCheckin: 'Add Order',
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
		fieldService:'Service',
		fieldItem: 'Items',
		fieldQuantity: 'Quantity',
		fieldOtherProducts: 'Selected Items',
		fieldProduct:'Product',
		fieldAddItems:'Add Items',

		headerNo:'No',
		headerName:'Name',
		headerService:'Order',

		total:'Total',

		noResult: 'There is no result'
	}
	vm.model.dom.dataDom.vi = {
		title: 'Order',
		buttonCheckin: 'Add Order',
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
		fieldService:'Dịch vụ',
		fieldItem: 'Sản phẩm',
		fieldQuantity: 'Số lượng',
		fieldOtherProducts: 'Sản phẩm đã chọn',
		fieldProduct:'Tên sản phẩm',
		fieldAddItems:'Thêm sản phẩm',

		headerNo:'No',
		headerName:'Họ và tên',
		headerService:'Dịch vụ',

		total:'Tổng',

		noResult: 'Không có kết quả'
	}
	vm.model.dom.dataDom.using = vm.model.dom.dataDom.vi;

	//Filter
	vm.model.filter = {
		// myfilter:{},//Customer Filter
		// orderBy:{},//Filter order
		// statusOptions:{
		// 	0:vm.model.dom.dataDom.using.selectStatusOptionAll, 1:vm.model.dom.dataDom.using.selectStatusOptionCheckin, 2:vm.model.dom.dataDom.using.selectStatusOptionCheckout
		// },//Options for status filter
		// orderOptions:{//Options for order filter
		// 	'customer.firstname': vm.model.dom.dataDom.using.selectFirstnameAZ,
		// 	'-customer.firstname':vm.model.dom.dataDom.using.selectFirstnameAZ,
		// 	'checkinTime': vm.model.dom.dataDom.using.selectBookingFarthest,
		// 	'-checkinTime': vm.model.dom.dataDom.using.selectBookingLastest
		// },
		// others:{
		// 	customer:{}
		// }
	}

	//Search
	vm.model.search.messageNoResult = 'No search result? Or '

	//Test
	vm.model.customer.storeId = '59112972685d0127e59de962';
	vm.model.customer.staffId = '590f4f301b7e4b1ebb3e2bd8';

	////////////////////////////////////////////////////////////////
	// Default checkin data
	function getDefaultOrder(){
		return {
			orderline:[],
			customer:{},
			storeId:vm.model.customer.storeId,
			staffId:vm.model.customer.staffId,
		}
	}
	//Get customer data from current created Customer
	function getCheckinCurrentCreatedCus (){
		var currentCus = $scope.layout.currentCustomer;
		currentCus.edu = currentCus.edu[0]
		return {
			orderline:[],
			customer: currentCus,
			storeId:vm.model.customer.storeId,
			staffId:vm.model.customer.staffId,
		}

	}

	function setCurrentCus(){
		if($scope.layout.currentCustomer){
				vm.model.dom.checkInDiv = true;
				vm.model.dom.filterDiv = false;
				vm.model.customer.checkingInData.occupancy = getCheckinCurrentCreatedCus();
				vm.model.search.username = $scope.layout.currentCustomer.lastname +' '+ ($scope.layout.currentCustomer.middlename ? $scope.layout.currentCustomer.middlename : '') + ' '+ $scope.layout.currentCustomer.firstname + ' || '+($scope.layout.currentCustomer.email[0] ? $scope.layout.currentCustomer.email[0]:'') + ' || '+ $scope.layout.currentCustomer.phone[0]
			}
	}

	function getOrderList(){
		OrderService.getOrderList().then(
			function success(res){
				vm.model.orderList = res.data.data;
			}, 
			function error(err){
				console.log(err)
			}
		);
	}
	////////////////////////////////////////////////////////////////
	//Controller
	//
	OrderService.readSomeProducts()
		.then(function success(res){
			//Get Products From Products Model, only get name
			vm.model.other.listOtherProducts = res.data.data.map(function(ele){
				if(ele.category != 1){
					return ele.name
				}
			}).filter(function(ele){return ele != undefined})
			/////////////////////////////////////////////////////////////////////
			//Create an array contain all products, include price, id, category
			res.data.data.map(function(ele){
				vm.model.customer.services[ele.name] = {
					price: ele.price,
					_id: ele._id,
					category: ele.category
				}
			})

			/////////////////////////////////////////////////////////////////////
			//Get all the names of products
			vm.model.customer.serviceNames = Object.keys (vm.model.customer.services);
			//Set default value for the order
			vm.model.order = getDefaultOrder();
			setCurrentCus();
			//vm.model.customer.checkingInData.occupancy is data sent to check in
			//Set edit customer ==  {}
		}, function error(err){
			console.log(err)
		});

	getOrderList()

	//Toogle
	// vm.ctrl.toggleFilterDiv = function (){
	// 	if (!vm.model.dom.filterDiv) {
	// 		vm.model.dom.filterDiv = true;
	// 		vm.model.dom.checkInEditDiv = false;
	// 		vm.model.dom.checkInDiv = false;
	// 	}
	// 	else vm.model.dom.filterDiv = false;
	// };
	// vm.ctrl.toggleCheckInDiv = function(){
	// 	if (!vm.model.dom.checkInDiv){
	// 		vm.model.dom.checkInDiv = true;
	// 		vm.model.dom.checkInEditDiv = false;
	// 		vm.model.dom.filterDiv = false;
	// 	}
	// 	else{
	// 		vm.model.dom.checkInDiv = false;
	// 		vm.model.customer.checkingInData.occupancy = getDefaultCheckInData ();
	// 		setCurrentCus();
	// 	}
	// }	

	//Controller Search
	vm.ctrl.searchCustomers = function() {
		OrderService.searchCustomers(vm.model.search.username)
		.then(function success (res){
			
			if(res.data.data.length == 0){
				vm.model.dom.messageSearchResult = true;
				vm.model.dom.checkingInCustomerSearchResult = false;
			}else{
				vm.model.search.userResults = res.data.data
				console.log(vm.model.search.userResults)
				vm.model.dom.customerSearchResult = true;
				vm.model.dom.messageSearchResult = false;				
			}
		}, function error (err){
			console.log(err)
		});
	}

	//Select Customer just searched to check in
	vm.ctrl.selectCustomer = function(index){
		vm.model.order.customer = {
			_id: vm.model.search.userResults [index]._id,
			firstname: vm.model.search.userResults [index].firstname,
			middlename: vm.model.search.userResults [index].middlename,
			lastname: vm.model.search.userResults [index].lastname,
			phone: vm.model.search.userResults [index].phone[0],
			email: vm.model.search.userResults [index].email[0],
			edu:vm.model.search.userResults [index].edu[0],
			isStudent:vm.model.search.userResults [index].isStudent
		}
		vm.model.dom.customerSearchResult = false;
		vm.model.search.username = vm.model.search.userResults[index].lastname + ' ' +vm.model.search.userResults[index].middlename+ ' ' + vm.model.search.userResults[index].firstname + (vm.model.search.userResults[index].email[0] ? ' || ' + vm.model.search.userResults[index].email[0] : '') + ' || ' + vm.model.search.userResults[index].phone[0];
	}

	////////////////////////////////////////////////////////////////////////
	// Add Order

	//Select extra product
	vm.model.other.selectedItem = {};
	var count = 0;
	vm.ctrl.selectService = function(){
			vm.model.order.orderline.map(function(ele){
				if(ele.productName == vm.model.other.selectedItem.name){
					count += 1;
				}
			})
			if(count == 0 && vm.model.other.selectedItem.quantity >0 && vm.model.other.selectedItem.name){
				vm.model.order.orderline.push({
					productName:vm.model.other.selectedItem.name,
					quantity: vm.model.other.selectedItem.quantity,
					price: vm.model.customer.services [vm.model.other.selectedItem.name].price,
					_id: vm.model.customer.services [vm.model.other.selectedItem.name]._id
				});
				count = 0;
			}
			count = 0;		
	}

	//Delete selected item when checkin
	vm.ctrl.deleteSelectService = function(product){
		vm.model.order.orderline = vm.model.order.orderline.filter(function(ele){return ele != product})
	}
	///////////////////////////////////////////////////////////////////////

	//Confirm checkin
	vm.ctrl.validateOrder = function(code){
		if(vm.model.order.customer.firstname){
			vm.model.order.storeId = vm.model.customer.storeId;
			vm.model.order.staffId = vm.model.customer.staffId;
			//Remove order if there is no orderline
			console.log(vm.model.order)
			OrderService.getInvoice (vm.model.order)
				.then(function success(res){
					console.log(res.data.data)
					vm.model.order = res.data.data
					$('#orderModal').foundation('open')
				})
			
		}
	}
	//Checkin
	vm.ctrl.confirmOrder = function(){
		// before checkin
		OrderService.confirmOrder (vm.model.order).then(
			function success(res){
				$window.location.reload();
 			}, 
			function error(err){
				console.log(err);
				$window.alert('Something wrong, please check it')
			}
		);
	}

	///////////////////////////////////////////////////////////////////////////////
	//Checkout
	//Checkout
	// vm.ctrl.getInvoiceForCheckout = function(item){
	// 	vm.model.dom.checkOutDiv = true;
	// 	OrderService.readInvoice(item._id)
	// 			.then(function success(res){
	// 				console.log(res)
	// 				vm.model.customer.checkoutCustomer = {}
	// 				vm.model.customer.checkoutCustomer.occupancy = res.data.data;
	// 				// vm.model.customer.checkoutCustomer.parent = item.parent;
	// 			}, function error(err){
	// 				console.log(err)
	// 			})
	// }

	// vm.ctrl.askConfirmCheckout = function(){
	// 	$('#askCheckout').foundation('open');
	// }
	// vm.ctrl.confirmCheckout = function(){
		
	// 	OrderService.confirmCheckout(vm.model.customer.checkoutCustomer.occupancy)
	// 		.then(function success(res){
	// 			$('#askCheckout').foundation('close');
	// 			$('#announceCheckoutSuccess').foundation('open');
	// 			vm.ctrl.reset();
	// 			getCheckin();
	// 		}, function error(err){
	// 			console.log(err)
	// 		})
	// }

	vm.ctrl.reload = function(){
		$window.location.reload()
	}

}