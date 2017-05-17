angular.module('posApp')
	.controller('CheckinCtrl', ['$scope', '$window','$route','CheckinService', CheckinCtrl])

function CheckinCtrl ($scope, $window, $route, CheckinService){
	var LayoutCtrl = $scope.$parent.layout;
	var vm = this;

	//////////////////////////////////////////////////////////////////////////////////
	//Models
	//Root vm
	vm.model = {
		search:{},//Search model
		customer:{
			checkingInData:{},
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
		messageSearchAlreadyCheckin: false,
		seeMore: false,
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
		headerCheckinTime:'Checkin Time',
		headerCheckoutDate:'Checkout Date',
		headerCheckoutTime:'Checkout Time',
		headerService:'Service',
		headerCheckout:'Checkout',
		headerEdit:'Edit',

		parentGroup:'Group',
		seeMoreBtn:'Expand',

		noResult: 'There is no result'
	}
	vm.model.dom.dataDom.vi = {
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
		fieldProduct:'Tên sản phẩm',
		fieldAddItems:'Thêm sản phẩm',
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
		headerCheckinTime:'Giờ Checkin',
		headerCheckoutDate:'Ngày Checkout',
		headerCheckoutTime:'Giờ Checkout',
		headerService:'Dịch vụ',
		headerCheckout:'Checkout',
		headerEdit:'Chỉnh sửa',

		parentGroup:'Nhóm',
		seeMoreBtn:'Expand',

		noResult: 'Không có kết quả'
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
			'-customer.firstname':vm.model.dom.dataDom.using.selectFirstnameZA,
			'checkinTime': vm.model.dom.dataDom.using.selectBookingFarthest,
			'-checkinTime': vm.model.dom.dataDom.using.selectBookingLastest
		},
		others:{
			customer:{}
		}
	}

	//See more
	vm.ctrl.seeMore = function(){
		if(vm.model.dom.seeMore == true){
			vm.model.dom.seeMore = false;
			vm.model.dom.dataDom.using.seeMoreBtn = 'Expand'
		}else{
			vm.model.dom.seeMore = true;
			vm.model.dom.dataDom.using.seeMoreBtn = 'Shrink'
		}
	}

	//Search
	vm.model.search.messageNoResult = 'No search result? Or '
	vm.model.search.messageAlreadyCheckin = 'No User Found! Already Checked in'

	//Test
	vm.model.customer.storeId = '59112972685d0127e59de962';
	vm.model.customer.staffId = '590f4f301b7e4b1ebb3e2bd8'

	//Products
	vm.model.products = {
		'group common':"Phòng Chung Dành Cho Nhóm",
		'individual common': "Phòng Chung Dành Cho Cá Nhân",
		'medium group private':"Phòng Riêng cho 20 - 40",
		'small group private':"Phòng Riêng cho 15 - 20"
	}

	vm.model.parents = {}


	////////////////////////////////////////////////////////////////
	// Default checkin data
	function getDefaultCheckInData (){
		return {
			service: {
					name: "individual common", // default service
					_id: vm.model.customer.services["individual common"]._id,
				}
			,
			customer: {
				firstname: '',
				middlename: '',
				lastname: '',
				phone: '',
				email:'',
				_id: '',
			}
		}
	};
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
			service: 
				{
					name: "individual common", // default service
					_id: vm.model.customer.services["individual common"]._id,
				}
			,
			customer: currentCus
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

	function getGroup(){
		CheckinService.getCheckinList().then(
			function success(res){
				vm.model.parents.list = res.data.data.filter(function(ele){
					return (ele.service.name == 'small group private' || ele.service.name == 'medium group private') && !ele.parent
				});
				vm.model.parents.options = {}

				vm.model.parents.list.map(function(ele){
					var value = ele.customer.lastname+ ' ' + ele.customer.middlename+ ' ' + ele.customer.firstname + '  ||  ' + ele.customer.email + '  ||  ' +ele.customer.phone
					vm.model.parents.options[ele._id] = value
				})
			}, 
			function error(err){
				console.log(err)
			}
		);
				
	}

	function setCurrentCus(){
		if($scope.layout.currentCustomer){
				vm.model.dom.checkInDiv = true;
				vm.model.dom.filterDiv = false;
				vm.model.customer.checkingInData.occupancy = getCheckinCurrentCreatedCus();
				vm.model.search.username = $scope.layout.currentCustomer.lastname +' '+ ($scope.layout.currentCustomer.middlename ? $scope.layout.currentCustomer.middlename : '') + ' '+ $scope.layout.currentCustomer.firstname + ' || '+($scope.layout.currentCustomer.email[0] ? $scope.layout.currentCustomer.email[0]:'') + ' || '+ $scope.layout.currentCustomer.phone[0]
			}
	}

	function getCheckin(){
		CheckinService.getCheckinList().then(
			function success(res){
				vm.model.customer.checkedInList = res.data.data;
			}, 
			function error(err){
				console.log(err)
			}
		);
	}

	getGroup()

	////////////////////////////////////////////////////////////////
	//Controller
	//
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
			vm.model.customer.checkingInData = {};
			vm.model.customer.checkingInData.order = getDefaultOrder();
			vm.model.customer.checkingInData.occupancy = getDefaultCheckInData ();
			setCurrentCus();
			//vm.model.customer.checkingInData.occupancy is data sent to check in
			//Set edit customer ==  {}
			vm.model.customer.editedCheckedInCustomer = {};

			
		}, function error(err){
			console.log(err)
		});

	
	getCheckin()

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
			vm.model.customer.checkingInData.occupancy = getDefaultCheckInData ();
			setCurrentCus();
		}
	}

	//Change
	vm.ctrl.changeMainService = function(){
		if(vm.model.customer.checkingInData.occupancy.service.name != 'medium group private' && vm.model.customer.checkingInData.occupancy.service.name != 'small group private'){
				vm.model.customer.checkingInData.occupancy.parent = ''
			}else{
				//Get parent group
				getGroup();
			}
	}

	vm.ctrl.changeEditMainService = function(){
		if(vm.model.customer.editedCheckedInCustomer.service.name != 'medium group private' && vm.model.customer.editedCheckedInCustomer.service.name != 'small group private'){
				vm.model.customer.editedCheckedInCustomer.parent = ''
			}else{
				//Get parent group
				getGroup()
			}
	}
	

	//Controller Search
	vm.ctrl.searchCustomers = function() {
		CheckinService.searchCustomers(vm.model.search.username)
		.then(function success (res){
			if(res.data.data.length == 0){
				vm.model.dom.messageSearchResult = true;
				vm.model.dom.checkingInCustomerSearchResult = false;
			}else{
				vm.model.search.userResults = res.data.data.filter(function(ele){
					return ele.checkinStatus == false;
				})
				if(vm.model.search.userResults.length == 0){
					vm.model.dom.messageSearchAlreadyCheckin = true;
					vm.model.dom.checkingInCustomerSearchResult = false;
				}else{
					vm.model.dom.checkingInCustomerSearchResult = true;
					vm.model.dom.messageSearchResult = false;
					vm.model.dom.messageSearchAlreadyCheckin = false;
				}
				
			}
		}, function error (err){
			console.log(err)
		});
	}

	//Select Customer just searched to check in
	vm.ctrl.selectCustomerToCheckin = function(index){
		vm.model.customer.checkingInData.occupancy.customer = vm.model.customer.checkingInData.order.customer = {
			_id: vm.model.search.userResults [index]._id,
			firstname: vm.model.search.userResults [index].firstname,
			middlename: vm.model.search.userResults [index].middlename,
			lastname: vm.model.search.userResults [index].lastname,
			phone: vm.model.search.userResults [index].phone[0],
			email: vm.model.search.userResults [index].email[0],
			edu:vm.model.search.userResults [index].edu[0],
			isStudent:vm.model.search.userResults [index].isStudent
		}
		vm.model.dom.checkingInCustomerSearchResult = false;
		vm.model.search.username = vm.model.search.userResults[index].lastname + ' ' +vm.model.search.userResults[index].middlename+ ' ' + vm.model.search.userResults[index].firstname + (vm.model.search.userResults[index].email[0] ? ' || ' + vm.model.search.userResults[index].email[0] : '') + ' || ' + vm.model.search.userResults[index].phone[0];
	}

	////////////////////////////////////////////////////////////////////////
	// Add Order

	//Select extra product
	vm.model.other.selectedItem = {};
	var count = 0;
	vm.ctrl.selectService = function(){
			vm.model.customer.checkingInData.order.orderline.map(function(ele){
				if(ele.productName == vm.model.other.selectedItem.name){
					count += 1;
				}
			})
			console.log(count)
			if(count == 0 && vm.model.other.selectedItem.quantity >0 && vm.model.other.selectedItem.name){
				vm.model.customer.checkingInData.order.orderline.push({
					productName:vm.model.other.selectedItem.name,
					quantity: vm.model.other.selectedItem.quantity,
					price: vm.model.customer.services [vm.model.other.selectedItem.name].price
				});
				count = 0;
			}
			vm.model.other.selectedItem = getDefaultProduct()
			count = 0;		
	}

	//Delete selected item when checkin
	vm.ctrl.deleteSelectService = function(product){
		vm.model.customer.checkingInData.order.orderline = vm.model.customer.checkingInData.order.orderline.filter(function(ele){return ele != product})
	}
	///////////////////////////////////////////////////////////////////////

	//Promotion Code
	vm.ctrl.addPromoteCode = function(){
		if(vm.model.customer.promocode.codeInput.length > 0){
			var testArr = vm.model.customer.promocode.codeList.filter(function(ele){return ele == vm.model.customer.promocode.codeInput})
			if(testArr.length > 0){
				$('#addSameCode').foundation('open')
			}else{
				vm.model.customer.promocode.codeList.push(vm.model.customer.promocode.codeInput)
			}
			vm.model.customer.promocode.codeInput = []
		}
	}

	vm.ctrl.deletePromoteCode = function(code){
		vm.model.customer.promocode.codeList = vm.model.customer.promocode.codeList.filter(function(ele){return ele != code});
	}

	//Validate promote code
	vm.ctrl.validatePromoteCode = function(){
		if(vm.model.customer.checkingInData.occupancy.customer.firstname){
			var data = {
				codes: vm.model.customer.promocode.codeList,
				isStudent: vm.model.customer.checkingInData.occupancy.customer.isStudent
			}
			CheckinService.validatePromoteCode(data)
			.then(function success(res){
				vm.model.customer.promocode.conflictedCode = []
				vm.model.customer.promocode.errorCodes = []
				vm.model.customer.promocode.codeList.map(function(ele){
					var count = 0;
					res.data.data.map(function(item){
						if(item.name == ele){
							count ++;
						}
					})
					if(count == 0){
						vm.model.customer.promocode.errorCodes.push(ele)
					}
				})
				
				vm.model.customer.promocode.conflictedCode = res.data.data.filter(function(ele){
					return ele.conflicted.length > 0
				});
				if(vm.model.customer.promocode.errorCodes.length > 0 || vm.model.customer.promocode.conflictedCode.length > 0){
					$('#wrongPromoCodes').foundation('open')
				}
				else{
					vm.ctrl.confirmCheckin(res.data.data);
				}
			})
		}
	}
	vm.ctrl.deletePromoteCode = function(code){
		vm.model.customer.promocode.codeList = vm.model.customer.promocode.codeList.filter(function(ele){return ele != code});
	}
	//Confirm checkin
	vm.ctrl.confirmCheckin = function(code){
		if(vm.model.customer.checkingInData.occupancy.customer.firstname){
			vm.model.customer.checkingInData.occupancy.storeId = vm.model.customer.storeId;
			vm.model.customer.checkingInData.occupancy.staffId = vm.model.customer.staffId;
			vm.model.customer.checkingInData.occupancy.promocodes = code.map(function(ele){
				return {name:ele.name, _id:ele._id, codeType: ele.codeType}//need to get id from database
			});
			vm.model.customer.checkingInData.occupancy.service.price = vm.model.customer.services [vm.model.customer.checkingInData.occupancy.service.name].price
			vm.model.customer.checkingInData.occupancy.service._id = vm.model.customer.services [vm.model.customer.checkingInData.occupancy.service.name]._id

			vm.model.customer.checkingInData.occupancy.checkinTime = new Date();

			//Remove order if there is no orderline
			if(vm.model.customer.checkingInData.order.orderline.length == 0){
				vm.model.customer.checkingInData.order = null
			}
			$('#checkinModal').foundation('open')
		}
	}
	//Checkin
	vm.ctrl.checkin = function(){
		// before checkin
		CheckinService.createOne (vm.model.customer.checkingInData.occupancy.customer._id, vm.model.customer.checkingInData).then(
			function success(res){
				console.log(res.data.data)
				vm.model.customer.checkedInList.push (res.data.data.occupancy);
				$window.location.reload();
				//vm.ctrl.reset();
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
	vm.ctrl.getInvoiceForCheckout = function(item){
		vm.model.dom.checkOutDiv = true;
		CheckinService.readInvoice(item._id)
				.then(function success(res){
					console.log(res)
					vm.model.customer.checkoutCustomer = {}
					vm.model.customer.checkoutCustomer.occupancy = res.data.data;
					// vm.model.customer.checkoutCustomer.parent = item.parent;
				}, function error(err){
					console.log(err)
				})
	}

	vm.ctrl.askConfirmCheckout = function(){
		$('#askCheckout').foundation('open');
	}
	vm.ctrl.confirmCheckout = function(){
		
		CheckinService.confirmCheckout(vm.model.customer.checkoutCustomer.occupancy)
			.then(function success(res){
				$('#askCheckout').foundation('close');
				$('#announceCheckoutSuccess').foundation('open');
				vm.ctrl.reset();
				getCheckin();
			}, function error(err){
				console.log(err)
			})
	}

	///////////////////////////////////////////////////////////////////
	// Edit

	//Pre Edit
	vm.ctrl.editCheckInCustomer = function (item) {
		vm.model.dom.checkInEditDiv = true;
		vm.model.dom.checkInDiv = false;
		vm.model.dom.checkInListDiv = true;
		vm.model.dom.filterDiv = false;
		vm.model.customer.editedCheckedInCustomer = {}
		vm.model.customer.editedCheckedInCustomer.occupancy = item;
		getGroup();
		console.log(vm.model.customer.editedCheckedInCustomer.occupancy)
		console.log(vm.model.parents.options)	
	};

	vm.ctrl.confirmEdit = function(){
		if(vm.model.customer.editedCheckedInCustomer.occupancy.customer.firstname){
			if(vm.model.customer.editedCheckedInCustomer.occupancy.parent){
				vm.model.customer.groupName = vm.model.parents.options[vm.model.customer.editedCheckedInCustomer.occupancy.parent]
			}
			$('#editModal').foundation('open')
		}
	}

	//Edit order
	vm.ctrl.edit = function(){
		if(vm.model.customer.editedCheckedInCustomer.occupancy._id){
			vm.model.customer.editedCheckedInCustomer.occupancy.service._id = vm.model.customer.services [vm.model.customer.editedCheckedInCustomer.occupancy.service.name]._id
			vm.model.customer.editedCheckedInCustomer.occupancy.service.price = vm.model.customer.services [vm.model.customer.editedCheckedInCustomer.occupancy.service.name].price
			if(vm.model.customer.editedCheckedInCustomer.occupancy.service.name == 'group common' || vm.model.customer.editedCheckedInCustomer.occupancy.service.name == 'individual common'){
				vm.model.customer.editedCheckedInCustomer.occupancy.parent = null;
			}
			console.log(vm.model.customer.editedCheckedInCustomer.occupancy)
			CheckinService.updateOne(vm.model.customer.editedCheckedInCustomer.occupancy._id, vm.model.customer.editedCheckedInCustomer.occupancy.service, vm.model.customer.editedCheckedInCustomer.occupancy.parent )
			.then(function success(res){
				$('#announceEditSuccess').foundation('open')
				vm.ctrl.reset()
			}, function error(err){
				console.log(err)
				vm.ctrl.reset()
			})
		}
	}

	vm.ctrl.reset = function(){
		vm.model.customer.editedCheckedInCustomer = {};
		vm.model.customer.checkingInData.occupancy = getDefaultCheckInData();
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
		vm.model.dom.messageSearchAlreadyCheckin = false;
	}
}