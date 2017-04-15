angular
	.module ('posApp')
	.controller ('assetsCtrl', assetsCtrl);

function assetsCtrl (assetsData) {
	var vm = this;
	vm.other = {};
	vm.other.curIndex = -1;

	vm.resetFormData = function (from){
		if (from == 'add') vm.formDataBtnName = 'Add';

		vm.formData = {
			name: '',
			category: '',
			quantity: '',
			status: '',
			reason: '',
		};		
	};

	vm.getFormData = function (index, from){
		if (from == 'edit') vm.formDataBtnName = 'Submit';

		vm.formData = {
			name: vm.assets[index].name,
			category: vm.assets[index].category,
			quantity: vm.assets[index].quantity,
			status: vm.assets[index].status,
			reason: '',
		}

		vm.other.curIndex = index;
	};

	vm.updateFormData = function () {
		
		// call service to update data
		// insert new data

		var data = vm.formData;
		vm.assets[vm.other.curIndex] = data;
	};

	assetsData.then(
		function (data){
			vm.assets = data.data;
		},
		function (err){
			console.log (err);
		}

	)
}