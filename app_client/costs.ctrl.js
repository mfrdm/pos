angular
	.module ('posApp')
	.controller ('costsCtrl', costsCtrl);

function costsCtrl (costsData) {
	var vm = this;

	vm.formData = {
		costType: '',
		amount: '',
		desc: '',
		reason: '',
		updatedAt: '',
		createdAt: '',
	};

	vm.resetFormData = function (){
		vm.formData = {
			costType: '',
			amount: '',
			desc: '',
			reason: '',
			updatedAt: '',
			createdAt: '',
		};		
	}

	vm.getFormData = function (index){
		vm.formData = {
			costType: vm.costs[index].costType,
			amount: vm.costs[index].amount,
			desc: vm.costs[index].desc,
			reason: '',
			updatedAt: vm.costs[index].updatedAt,
			createdAt: vm.costs[index].createdAt,			
		}
	};

	costsData.then(
		function (data){
			vm.costs = data.data;
		},
		function (err){
			console.log (err);
		}

	);
}