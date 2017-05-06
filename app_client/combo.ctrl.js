(function () {
	angular
		.module ('posApp')
		.controller ('ComboCtrl', ['$route', 'comboService', '$http', ComboCtrl])


	function ComboCtrl ($route, comboService, $http) {
		var vm = this;

		vm.model = {};
		vm.ctrl = {};

		vm.model.search = {};
		vm.model.dom = {};
		vm.model.combo = {};
		vm.model.combo.listOptions = {};
		vm.model.combo.add = {};//combo will be add to selected
		vm.model.combo.selected = [];//selected combo to send to server
		vm.model.combo.selected.product = {}

		vm.model.dom.messageSearchResult = false;
		vm.model.dom.customerSearchResult = false;
		vm.model.dom.selected = false;
		

		/////////////////////////////////////////////////////////////

		vm.model.combo.listOptions.value = ['One Day', 'Three Days', 'One Month', 'Three Months', 'One Year']
		vm.model.combo.listOptions.room = [
		'Group Common',
		'Individual Common',
		'Group Private'
		]

		/////////////////////////////////////////////////////////////
		//Check to show selected combo
		//Ctrl search customer to set combo
		vm.ctrl.searchCustomers = function(){
			comboService.searchCustomers(vm.model.search.username)
				.then(function success(res){
					console.log(res)
					if(res.data.data.length > 0){
						vm.model.search.userResults = res.data.data
						vm.model.dom.customerSearchResult = true;
						vm.model.dom.messageSearchResult = false;
					}else{
						vm.model.dom.messageSearchResult = true;
						vm.model.dom.customerSearchResult = false;
					}
					
				}, function error(err){
					console.log(err)
				})
		}

		//Select a customer to get combo
		vm.ctrl.selectCustomerToGetCombo = function(index){
			vm.model.search.username = vm.model.search.userResults[index].lastname  + ' ' + vm.model.search.userResults[index].firstname
			vm.model.dom.customerSearchResult = false;
		}

		//Set combo for customer
		vm.ctrl.combo = function(){

		}

		//add combo to selected list
		vm.ctrl.addCombo = function(){
			
			var count = 0;
			vm.model.combo.selected.map(function(ele){
				if(ele.value == vm.model.combo.add.value && ele.product.name == vm.model.combo.add.room){
					count += 1;
				}
			})
			if(count == 0 && vm.model.combo.add.quantity >0){
				vm.model.combo.selected.push({
					value: vm.model.combo.add.value,
					product:{
						name:vm.model.combo.add.room
					},
					quantity: vm.model.combo.add.quantity
				})
				count = 0;
			}
			console.log(vm.model.combo.selected)
			vm.model.dom.selected = true;
		}
	}

})();