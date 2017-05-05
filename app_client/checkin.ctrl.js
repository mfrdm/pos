angular.module('posApp')
	.controller('CheckinCtrl', ['$scope', 'CheckinService', CheckinCtrl])

//Get data to render all current checked in customers
function CheckinCtrl ($scope, CheckinService){
	var vm = this;
	// vm.look = {};
	// vm.data = {}; // other data
	// vm.status = {};

	// vm.searchResult = {};
	// vm.look.searchCheckingInCustomerResultDiv = false;
	// vm.look.searchEditedCustomerResultDiv = false;
	// vm.look.checkInListDiv = true;
	// vm.look.checkInEditDiv = false;
	// vm.look.checkInDiv = false;

	// // WAIT
	// vm.removeOtherItems = function (index, which){
	// 	if (which == 'checkingInDiv'){
	// 		if (vm.model.customer.checkingInData.orderline.length == 1){
	// 			// do nothing & send message that cannot remove when there is only one item
	// 		}
	// 		else {
	// 			vm.model.customer.checkingInData.orderline.splice (index, 1);
	// 		}
	// 	}
	// 	else if (which === 'editCheckedInDiv'){

	// 	}

	// };

	// vm.toggleCheckInDiv = function (){
	// 	if (!vm.look.checkInDiv){
	// 		vm.look.checkInDiv = true;
	// 	}
	// 	else{
	// 		vm.look.checkInDiv = false;
	// 		vm.model.customer.checkingInData = getDefaultCheckInData ();
	// 	}
	// };

	// vm.toggleCheckInEditDiv = function (index) {
	// 	if (vm.look.checkInEditDiv){ // turn off
	// 		vm.look.checkInEditDiv = false;
	// 		vm.look.checkInListDiv = true;
	// 		vm.data.editedCheckedInCustomer = {}; // reset
	// 	}
	// 	else{ // turn on
	// 		// turn off checkin list div
	// 		// turn on edit div
	// 		// make a deep copy of the data
	// 		// load data to the edit div
	// 		// other tasks

	// 		vm.data.editedCheckedInCustomer = JSON.parse(JSON.stringify(vm.data.checkedInList [index]));
	// 		vm.data.editedCheckedInCustomer.orderline.map (function (x, i, arr){
	// 			x.quantity = parseInt (x.quantity);
	// 		});

	// 		vm.data.editedCheckedInCustomer.username = vm.data.editedCheckedInCustomer.customer.lastname + ' ' + vm.data.editedCheckedInCustomer.customer.firstname + '/ ' + vm.data.editedCheckedInCustomer.customer.phone + '/ ' + (vm.data.editedCheckedInCustomer.customer.email ? vm.data.editedCheckedInCustomer.customer.email : '');

	// 		if (vm.data.editedCheckedInCustomer.orderline.length == 1){
	// 			vm.data.editedCheckedInCustomer.orderline.push (getDefaultProduct());
	// 		}

	// 		vm.look.checkInEditDiv = true;
	// 		vm.look.checkInListDiv = false;
	// 		vm.data.currCheckedInIndex = index;
	// 	}
	// };


	////////////////////////////////////////////////////////
	//Checkout Page
	// vm.checkout = function(){
	// 	vm.outTime = new Date();
	// 	CheckinService.postCheckOut(vm.oneOrder._id)
	// 		.then(function success(res){
	// 			vm.tab = 'tab-search';
	// 			$route.reload();
	// 		}, function error(err){
	// 			console.log(err);
	// 		})
	// };


	// FIX: later send request to server to calculate the total. Can still use it when offline


	// vm.updateCheckin = function(){
	// 	var id = vm.data.editedCheckedInCustomer._id;

	// 	// validate
	// 	vm.data.editedCheckedInCustomer.orderline.map (function (x, i, arr){
	// 		if (x.quantity <= 0){
	// 			arr.splice (i, 1);
	// 		}
	// 	});

	// 	CheckinService.updateOne (id, vm.data.editedCheckedInCustomer.orderline).then(
	// 		function (data){

	// 			vm.data.checkedInList[vm.data.currCheckedInIndex].orderline = vm.data.editedCheckedInCustomer.orderline;
	// 			var message = 'Successfully update checked-in information of customer ' + vm.data.editedCheckedInCustomer.username;
	// 			$scope.layout.updateMessage (message, 'success');
	// 			vm.toggleCheckInEditDiv ();
	// 		},
	// 		function (err){
	// 			console.log (err)
	// 			var message = err;
	// 			$scope.layout.updateMessage (message, 'alert');
	// 		}
	// 	);
	// };

	//////////////// Initialization ///////////////////////
	
	//////////////////////////////////////////////////////////////////

	vm.model = {};
	vm.ctrl = {};

	vm.model.search = {}//Any things related to search
	vm.model.search.messageNoResult = 'No search result? Or '

	vm.model.dom = {
		messageSearchResult: false,
		checkingInCustomerSearchResult: false,
		// editedCustomerSearchResult: false
	}//anything related to DOM
	vm.model.dom.checkInListDiv = true;
	vm.model.dom.checkInDiv = false;
	vm.model.dom.filterDiv = false;

	vm.model.customer = {}//Any thing related to customer

	// TESTING
	vm.model.customer.storeId = '58fdc7e1fc13ae0e8700008a';
	vm.model.customer.userId = '58eb474538671b4224745192'; // staff
	// END

	vm.model.customer.services = { // FIX: no hardcode
		//Services pull from Products model
		'Private': {
			price: 150000,
			id: 2312312,
		},
		'Common': {
			price: 10000,
			id: 31231,
		},
		'': {
			price: 0,
			id: -1,
		},
		'Coca Cola': {
			price: 7000,
			id: 4233,
		},
		'Poca': {
			price: 7000,
			id: 243,
		},
		'Pepsi': {
			price: 7000,
			id: 343,
		},		
	};
	function getDefaultCheckInData (){
		return {
			orderline: [
				{
					productName: 'Common', // default service
					quantity: 1,
					id: vm.model.customer.services['Common'].id,
				},
				{
					productName: '', //Add more
					quantity: 0,
				},			

			],
			customer: {
				firstname: '',
				lastname: '',
				phone: '',
				id: '',
			}
		}
	};
	vm.model.customer.serviceNames = Object.keys (vm.model.customer.services);
	vm.model.customer.serviceNames.copy = angular.copy(vm.model.customer.services);
	vm.model.customer.currCheckedInIndex = -1; 
	vm.model.customer.checkingInData = getDefaultCheckInData ();
	//vm.model.customer.checkingInData is data sent to check in

	vm.model.customer.editedCheckedInCustomer = {};

	// Used to fill check-in data
	// FIX: should not include hardcode
	
	//Default empty product to add more to orderline
	function getDefaultProduct (){
		return 	{
			productName: '', //
			id: '',
			quantity: 0,
		}
	};
	//Close an item
	vm.ctrl.closeAnItem = function(index){
		vm.model.customer.checkingInData.orderline.splice(index, 1)
		console.log(vm.model.customer.checkingInData.orderline)
	}

	vm.ctrl.searchCustomers = function(which) {
		CheckinService.searchCustomers(vm.model.search.username)
		.then(function success (res){
			console.log(res)
			if(res.data.data.length == 0){
				vm.model.dom.messageSearchResult = true;
				vm.model.dom.checkingInCustomerSearchResult = false;
			}else{
				if (vm.model.dom.checkInDiv && which === 'checkInDiv'){
					vm.model.search.userResults = res.data.data;
					vm.model.dom.checkingInCustomerSearchResult = true;
					vm.model.dom.messageSearchResult = false;
				}
				// else if (vm.look.checkInEditDiv && which === 'checkInEditDiv'){
				// 	vm.searchResult.editedCheckedInCustomers = res.data.data;
				// 	vm.look.dom.editedCustomerSearchResult = true;
				// }
			}
		}, function error (err){
			console.log(err)
		});
	}

	vm.ctrl.selectCustomerToCheckin = function(index){
		vm.model.customer.checkingInData.customer = {
			id: vm.model.search.userResults [index]._id,
			firstname: vm.model.search.userResults [index].firstname,
			lastname: vm.model.search.userResults [index].lastname,
			phone: vm.model.search.userResults [index].phone,			
		}

		vm.model.dom.checkingInCustomerSearchResult = false;
		vm.model.search.username = vm.model.customer.checkingInData.customer.lastname + ' ' + vm.model.customer.checkingInData.customer.firstname + ' / ' + vm.model.customer.checkingInData.customer.phone + (vm.model.customer.checkingInData.customer.email ? ' / ' + vm.model.customer.checkingInData.customer.email : '');
	}

	// vm.ctrl.changeSelected = function(serviceName){
	// 	vm.model.customer.serviceNames = vm.model.customer.serviceNames.filter(function(ele){
	// 		return ele != serviceName
	// 	})
	// }

	vm.ctrl.getTotal = function (orderline) {
		var total = 0;
		var orderNum = orderline.length;
		var items =  {};
		Object.assign (items, vm.model.customer.services, vm.model.customer.otherItems);
		for (var i = 0; i < orderNum; i++) {
			if (orderline [i].productName) {
				total += (items [orderline [i].productName].price * orderline [i].quantity);
			}
		}
		return total;
	};

	vm.ctrl.addMoreOtherItems = function (which){
		if (which === 'checkingInDiv'){
			vm.model.customer.checkingInData.orderline.push (getDefaultProduct());
			console.log(vm.model.customer.checkingInData.orderline)
		}
		// else if (which === 'editedCheckedInDiv'){
		// 	vm.data.editedCheckedInCustomer.orderline.push (getDefaultProduct());
		// }
	};

	vm.ctrl.toggleFilterDiv = function (){
		if (!vm.model.dom.filterDiv) vm.model.dom.filterDiv = true;
		else vm.model.dom.filterDiv = false;
	};

	vm.ctrl.checkin = function(){
		// before checkin

		vm.model.customer.checkingInData.total = vm.ctrl.getTotal (vm.model.customer.checkingInData.orderline);
		vm.model.customer.checkingInData.storeId = vm.model.customer.storeId;
		vm.model.customer.checkingInData.staffId = vm.model.customer.userId;

		// update id in orderline
		var items =  {};
		Object.assign (items, vm.model.customer.services, vm.model.customer.otherItems);

		vm.model.customer.checkingInData.orderline.map (function (x, i, array){
			x.id = items [x.productName];
		});

		console.log(vm.model.customer.checkingInData)
		
		CheckinService.createOne (vm.model.customer.checkingInData.id, vm.model.customer.checkingInData).then(
			function success(data){
				console.log (data)
				// vm.data.checkedInList.push (data);
				// vm.toggleCheckInDiv ();
				//vm.status.checkedin = true;
			}, 
			function error(err){
				console.log(err);
				//vm.status.checkedin = false;
			}
		);
	}

	//Toggle Ctrl
	vm.ctrl.toggleCheckInDiv = function(){
		if (!vm.model.dom.checkInDiv){
			vm.model.dom.checkInDiv = true;
		}
		else{
			vm.model.dom.checkInDiv = false;
			vm.model.customer.checkingInData = getDefaultCheckInData ();
		}
	}

	//Get checkin List
	var query = { // TESTING
		start: '2017-03-01',
		end: '2017-03-02',
		storeId: vm.model.customer.storeId,
		staffId: vm.model.customer.userId,
	}	

	CheckinService.getCheckinList (query).then(
		function success(res){
			// vm.status.getCheckinList = true;
			vm.model.customer.checkedInList = res.data.data;
		}, 
		function error(err){
			// vm.status.getCheckinList = false;
			console.log(err)
		}
	);

};
