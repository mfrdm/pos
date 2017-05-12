angular.module('posApp')
	.controller('CheckinCtrl', ['$scope', '$window','$route','CheckinService', CheckinCtrl])

function CheckinCtrl ($scope, $window, $route, CheckinService){
	var vm = this;
	//////////////////////////////////////////////////////////////////////////////////
	//Models
	//Root vm
	vm.model = {
		search:{},//Search model
		customer:{
			services:{},
			promocode:{
				codeList: [],
				errorCodes: [],
				codeInput:''
			}//Promote Code
		},//Customer model
		filter:{},//Filter model
		other:{}//Other models
	};
	vm.ctrl = {};
	//DOM
	vm.model.dom = {
		messageSearchResult: false,
		checkingInCustomerSearchResult: false,
		checkInListDiv:true,
		checkInDiv: false,
		filterDiv: true,
		checkInEditDiv: false,
		checkOutDiv: false,
		dataDom: {}//data about translate
	}
	//Translate English Vietnamese
	vm.model.dom.dataDom.using = {}//Using language
	vm.model.dom.dataDom.eng = {
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

		invoiceFullname: 'Fullname',
		invoicePhone: 'Phone',
		invoiceOtherProducts: 'Other Products',
		invoiceMainService:'Main Service',
		invoicePromoteCode: 'Promote Code',
		invoiceTotal: 'Total Money',


		headerNo:'No',
		headerName:'Name',
		headerPhone:'Phone',
		headerCheckinDate:'Checkin Date',
		headerCheckinTime:'Checkin Time',
		headerCheckoutDate:'Checkout Date',
		headerCheckoutTime:'Checkout Time',
		headerService:'Service',
		headerCheckout:'Checkout',
		headerEdit:'Edit'
	}
	vm.model.dom.dataDom.vi = {
		title: 'Checkin',
		buttonCheckin: 'Checkin',
		buttonFilter:'Filter',

		selectFirstnameAZ:'Tên theo thứ tự A-Z',
		selectFirstnameZA:'Tên theo thứ tự Z-A',
		selectBookingFarthest: 'Thời gian checkin xa nhất',
		selectBookingLastest: 'Thời gian checkin gần nhất',

		selectStatusOptionAll: 'Hiển thị tất cả khách',
		selectStatusOptionCheckin: 'Hiển thị khách đang checkin',
		selectStatusOptionCheckout: 'Hiển thị khách đã checkout',

		fieldSortBy:'Sắp xếp',
		fieldStatus:'Trạng thái',
		fieldSearchByFirstname:'TÌm kiếm theo tên',
		fieldSearchByPhone:'Tìm kiếm theo Số điện thoại',
		fieldPhoneEmail: 'Phone/Email',
		fieldPromotionCode: 'Mã giảm giá',
		fieldService:'Dịch vụ',
		fieldItem: 'Sản phẩm',
		fieldQuantity: 'Số lượng',
		fieldOtherProducts: 'Sản phẩm đã chọn',
		fieldProduct:'Tên sản phẩm',
		fieldAddItems:'Thêm sản phẩm',

		invoiceFullname: 'Họ và tên',
		invoicePhone: 'Số điện thoại',
		invoiceOtherProducts: 'Sản phẩm',
		invoiceMainService:'Dịch vụ',
		invoicePromoteCode: 'Mã giảm giá',
		invoiceTotal: 'Tổng tiền',


		headerNo:'No',
		headerName:'Họ và tên',
		headerPhone:'Số điện thoại',
		headerCheckinDate:'Ngày Checkin',
		headerCheckinTime:'Giờ Checkin',
		headerCheckoutDate:'Ngày Checkout',
		headerCheckoutTime:'Giờ Checkout',
		headerService:'Sản phẩm chính',
		headerCheckout:'Checkout',
		headerEdit:'Chỉnh sửa'
	}
	vm.model.dom.dataDom.using = vm.model.dom.dataDom.vi;

	//Filter
	vm.model.filter = {
		myfilter:{},//Customer Filter
		orderBy:{},//Filter order
		statusOptions:{
			0:vm.model.dom.dataDom.using.selectStatusOptionAll, 1:vm.model.dom.dataDom.using.selectStatusOptionCheckin, 2:vm.model.dom.dataDom.using.selectStatusOptionCheckout
		},//Options for status filter
		orderOptions:{//Options for order filter
			'customer.firstname': vm.model.dom.dataDom.using.selectFirstnameAZ,
			'-customer.firstname':vm.model.dom.dataDom.using.selectFirstnameAZ,
			'checkinTime': vm.model.dom.dataDom.using.selectBookingFarthest,
			'-checkinTime': vm.model.dom.dataDom.using.selectBookingLastest
		},
		others:{
			customer:{}
		}
	}

	//Search
	vm.model.search.messageNoResult = 'No search result? Or '

	//Test
	vm.model.customer.storeId = '59112972685d0127e59de962';
	vm.model.customer.userId = '590f4f301b7e4b1ebb3e2bd8'


	////////////////////////////////////////////////////////////////
	// Default checkin data
	function getDefaultCheckInData (){
		return {
			orderline: [
				{
					productName: "Phòng Chung Dành Cho Cá Nhân", // default service
					quantity: 1,
					_id: vm.model.customer.services["Phòng Chung Dành Cho Cá Nhân"]._id,
				}
			],
			customer: {
				firstname: '',
				middlename: '',
				lastname: '',
				phone: '',
				_id: '',
			}
		}
	};
	//Get customer data from current created Customer
	function getCheckinCurrentCreatedCus (){
		return {
			orderline: [
				{
					productName: "Phòng Chung Dành Cho Cá Nhân", // default service
					quantity: 1,
					_id: vm.model.customer.services["Phòng Chung Dành Cho Cá Nhân"]._id,
				}
			],
			customer: {
				firstname: $scope.layout.currentCustomer.firstname,
				middlename: $scope.layout.currentCustomer.middlename,
				lastname: $scope.layout.currentCustomer.lastname,
				phone: $scope.layout.currentCustomer.phone[0],
				_id: $scope.layout.currentCustomer._id,
			}
		}
	}
	//Default empty product to add more to orderline
	function getDefaultProduct (){
		return 	{
			productName: '', //
			_id: '',
			quantity: 0,
		}
	};

	////////////////////////////////////////////////////////////////
	//Controller
	CheckinService.readSomeProducts()
		.then(function success(res){
			//Get Products From Products Model, only get name
			vm.model.other.listMainProducts = res.data.data.map(function(ele){
				if(ele.category == 1){
					return ele.name
				}
			}).filter(function(ele){return ele != undefined})
			vm.model.other.listOtherProducts = res.data.data.map(function(ele){
				if(ele.category != 1){
					return ele.name
				}
			}).filter(function(ele){return ele != undefined})
			/////////////////////////////////////////////////////////////////////
			//Create an array contain all products, include price, id, category
			console.log()
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
			vm.model.customer.checkingInData = getDefaultCheckInData ();
			//vm.model.customer.checkingInData is data sent to check in
			//Set edit customer ==  {}
			vm.model.customer.editedCheckedInCustomer = {};

			if($scope.layout.currentCustomer){
				vm.model.dom.checkInDiv = true;
				vm.model.customer.checkingInData = getCheckinCurrentCreatedCus();
				vm.model.search.username = $scope.layout.currentCustomer.lastname +' '+ ($scope.layout.currentCustomer.middlename ? $scope.layout.currentCustomer.middlename : '') + ' '+ $scope.layout.currentCustomer.firstname + ($scope.layout.currentCustomer.email[0] ? '/' + $scope.layout.currentCustomer.email[0]:'') + $scope.layout.currentCustomer.phone[0]
			}
		}, function error(err){
			console.log(err)
		});

	CheckinService.getCheckinList().then(
		function success(res){
			vm.model.customer.checkedInList = res.data.data;
		}, 
		function error(err){
			console.log(err)
		}
	);

	//Toogle
	vm.ctrl.toggleFilterDiv = function (){
		if (!vm.model.dom.filterDiv) {
			vm.model.dom.filterDiv = true;
			vm.model.dom.checkInEditDiv = false;
			vm.model.dom.checkInDiv = false;
		}
		else vm.model.dom.filterDiv = false;
	};
	vm.ctrl.toggleCheckInDiv = function(){
		if (!vm.model.dom.checkInDiv){
			vm.model.dom.checkInDiv = true;
			vm.model.dom.checkInEditDiv = false;
			vm.model.dom.filterDiv = false;
		}
		else{
			vm.model.dom.checkInDiv = false;
			vm.model.customer.checkingInData = getDefaultCheckInData ();
		}
	}
	vm.ctrl.editCheckInCustomer = function (item) {
		vm.model.dom.checkInEditDiv = true;
		vm.model.dom.checkInDiv = false;
		vm.model.dom.checkInListDiv = true;
		vm.model.dom.filterDiv = false;

		vm.model.customer.editedCheckedInCustomer = item;
		vm.model.customer.editedCheckedInCustomer.orderline.map (function (x, i, arr){
			x.quantity = parseInt (x.quantity);
		});
		vm.model.customer.editedCheckedInCustomer.orderline.map (function (x){
			x._id = vm.model.customer.services [x.productName]._id;
			x.price = vm.model.customer.services [x.productName].price;
		});
	};

	//Controller Search
	vm.ctrl.searchCustomers = function() {
		CheckinService.searchCustomers(vm.model.search.username)
		.then(function success (res){
			if(res.data.data.length == 0){
				vm.model.dom.messageSearchResult = true;
				vm.model.dom.checkingInCustomerSearchResult = false;
			}else{
				vm.model.search.userResults = res.data.data;
				vm.model.dom.checkingInCustomerSearchResult = true;
				vm.model.dom.messageSearchResult = false;
			}
		}, function error (err){
			console.log(err)
		});
	}

	//Select Customer just searched to check in
	vm.ctrl.selectCustomerToCheckin = function(index){
		vm.model.customer.checkingInData.customer = {
			_id: vm.model.search.userResults [index]._id,
			firstname: vm.model.search.userResults [index].firstname,
			middlename: vm.model.search.userResults [index].middlename,
			lastname: vm.model.search.userResults [index].lastname,
			phone: vm.model.search.userResults [index].phone[0],
			email: vm.model.search.userResults [index].email[0]
		}

		vm.model.dom.checkingInCustomerSearchResult = false;
		vm.model.search.username = vm.model.search.userResults[index].lastname + ' ' +vm.model.search.userResults[index].middlename+ ' ' + vm.model.search.userResults[index].firstname + (vm.model.search.userResults[index].email[0] ? ' / ' + vm.model.search.userResults[index].email[0] : '') + ' / ' + vm.model.search.userResults[index].phone[0];
	}

	//Select extra product
	vm.model.other.selectedItem = {};
	var count = 0;
	vm.ctrl.selectService = function(){
		if(vm.model.customer.checkingInData.orderline){
			vm.model.customer.checkingInData.orderline.map(function(ele){
				if(ele.productName == vm.model.other.selectedItem.name){
					count += 1;
				}
			})
			if(count == 0 && vm.model.other.selectedItem.quantity >0 && vm.model.other.selectedItem.name){
				vm.model.customer.checkingInData.orderline.push({
					productName:vm.model.other.selectedItem.name,
					quantity: vm.model.other.selectedItem.quantity
				});
				count = 0;
			}
			count = 0;
		}
	}

	//Select Extra product when editing order
	vm.model.other.selectedToEditItem = {};
	vm.ctrl.selectServiceToEdit = function(){
		vm.model.customer.editedCheckedInCustomer.orderline.map(function(ele){
				if(ele.productName == vm.model.other.selectedToEditItem.name){
					count += 1;
				}
			})
		if(count == 0 && vm.model.other.selectedToEditItem.quantity >0 && vm.model.other.selectedToEditItem.name){
			vm.model.customer.editedCheckedInCustomer.orderline.push({
				productName:vm.model.other.selectedToEditItem.name,
				quantity: vm.model.other.selectedToEditItem.quantity
			});
			count = 0;
		}
		count = 0;
	}

	//Delete selected item when checkin
	vm.ctrl.deleteSelectService = function(product){
		vm.model.customer.checkingInData.orderline = vm.model.customer.checkingInData.orderline.filter(function(ele){return ele != product})
	}

	//Delete selected item when edit
	vm.ctrl.deleteSelectEditService = function(product){
		vm.model.customer.editedCheckedInCustomer.orderline = vm.model.customer.editedCheckedInCustomer.orderline.filter(function(ele){return ele != product})
	}

	//Promotion Code
	vm.ctrl.addPromoteCode = function(){
		var testArr = vm.model.customer.promocode.codeList.filter(function(ele){return ele == vm.model.customer.promocode.codeInput})
		if(testArr.length > 0){
			$('#addSameCode').foundation('open')
		}else{
			vm.model.customer.promocode.codeList.push(vm.model.customer.promocode.codeInput)
		}
		vm.model.customer.promocode.codeInput = ''
	}

	vm.ctrl.deletePromoteCode = function(code){
		vm.model.customer.promocode.codeList = vm.model.customer.promocode.codeList.filter(function(ele){return ele != code});
	}

	//Validate promote code
	vm.ctrl.validatePromoteCode = function(){
		CheckinService.validatePromoteCode(vm.model.customer.promocode.codeList)
			.then(function success(res){
				Array.prototype.diff = function(a) {
				    return this.filter(function(i) {return a.indexOf(i) < 0;});
				};
				vm.model.customer.promocode.errorCodes = vm.model.customer.promocode.codeList.diff(res.data.data)
				if(vm.model.customer.promocode.codeList == []){
					vm.ctrl.confirmCheckin(vm.model.customer.promocode.codeList)
				}
				if(vm.model.customer.promocode.errorCodes.length > 0){
					$('#wrongPromoCodes').foundation('open')
				}
				else{
					vm.ctrl.confirmCheckin(vm.model.customer.promocode.codeList);
				}
			})
	}

	//Confirm checkin
	vm.ctrl.confirmCheckin = function(code){
		vm.model.customer.checkingInData.storeId = vm.model.customer.storeId;
		vm.model.customer.checkingInData.staffId = vm.model.customer.userId;
		console.log(code)
		vm.model.customer.checkingInData.orderline[0].promocodes = code.map(function(ele){
			return {name:ele, _id:'58ff58e6e53ef40f4dd664cd'}//need to get id from database
		});
		vm.model.customer.checkingInData.orderline.map (function (x){
			x._id = vm.model.customer.services [x.productName]._id;
			x.price = vm.model.customer.services [x.productName].price;
		});

		vm.model.customer.checkingInData.checkinTime = new Date();
		$('#checkinModal').foundation('open')
	}

	//Checkin
	vm.ctrl.checkin = function(){
		// before checkin
		console.log(vm.model.customer.checkingInData)
		
		CheckinService.createOne (vm.model.customer.checkingInData.customer._id, vm.model.customer.checkingInData).then(
			function success(data){
				console.log(data.data.data)
				vm.model.customer.checkedInList.push (data.data.data);
				vm.ctrl.reset();
			}, 
			function error(err){
				console.log(err);
				$window.alert('Something wrong, please check it')
			}
		);
	}
	vm.ctrl.edit = function(){
		if(vm.model.customer.editedCheckedInCustomer._id){
			CheckinService.updateOne(vm.model.customer.editedCheckedInCustomer._id, vm.model.customer.editedCheckedInCustomer.orderline)
			.then(function success(res){
				$window.alert('Successfully Edit')
				vm.model.customer.editedCheckedInCustomer = null;
				vm.model.dom.checkInEditDiv = false;
			}, function error(err){
				console.log(err)
				vm.model.customer.editedCheckedInCustomer = null;
				vm.model.dom.checkInEditDiv = false;
			})
		}
	}
	vm.ctrl.getInvoiceForCheckout = function(item){
		vm.model.dom.checkOutDiv = true;
		CheckinService.readInvoice(item._id)
			.then(function success(res){
				vm.model.customer.checkoutCustomer = res.data.data;
			}, function error(err){
				console.log(err)
			})
	}

	vm.ctrl.confirmCheckout = function(){
		CheckinService.confirmCheckout(vm.model.customer.checkoutCustomer)
			.then(function success(res){
				console.log(res);
				$window.alert('Successfully checkout')
			}, function error(err){
				console.log(err)
			})
	}
	//Update check in
	vm.ctrl.updateCheckin = function(){
		CheckinService.updateOne(vm.model.customer.editedCheckedInCustomer._id, vm.model.customer.editedCheckedInCustomer.orderline)
		.then(function success(res){
			console.log(res)
		})
	}

	vm.ctrl.reset = function(){
		vm.model.customer.editedCheckedInCustomer = {};
		vm.model.customer.checkingInData = getDefaultCheckInData();
		vm.model.customer.checkoutCustomer = {};
		vm.model.search.username = '';
		$scope.layout.currentCustomer = null;
		vm.model.dom.checkInDiv = false;
		vm.model.dom.messageSearchResult = false;
		vm.model.dom.checkingInCustomerSearchResult = false;
		vm.model.dom.checkInEditDiv = false;
		vm.model.dom.filterDiv = true;
		vm.model.dom.checkOutDiv = false;
		vm.model.dom.checkInListDiv=true;
	}
}