angular
	.module ('posApp')
	.controller ('assetCtrl', assetCtrl);


function assetCtrl (assetData) {
	var vm = this;
	assetData.then(
		function (data){
			vm.assets = data.data;
		},
		function (err){
			console.log (err);
		}

	)
}