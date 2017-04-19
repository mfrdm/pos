var ProductCtrl = function(productService, $route){
	var vm = this;
	vm.tab = 'tab-search';
	////////////////////////////////////////////////////////
	//Setup ng-switch
	vm.toCreate = function(){
		vm.tab = 'tab-create'
	}
	vm.toProfile = function(index){
		vm.tab = 'tab-profile';
		vm.product = vm.results[index]
	}
	vm.toSearch = function(){
		vm.tab = 'tab-search'
		$route.reload();
	}
	vm.toEdit = function(){
		vm.tab = 'tab-edit';
	}
	////////////////////////////////////////////////////////
	//Search Page
	vm.searchFunc = function(){
		productService.searchProducts(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data
		}, function error(err){
			console.log(err)
		})
	}
	////////////////////////////////////////////////////////
	//Create Page
	vm.createNewProduct = function(){
		productService.postCreateProduct(vm.formData)
			.then(function success(res){
				vm.tab = 'tab-search'
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.saveEdit = function(){
		vm.data = {
			$set:{
				name:vm.product.name,
				managerFullname:vm.product.managerFullname
			}
		}
		productService.postSaveEdit(vm.product._id, vm.data)
			.then(function success(res){
				console.log(res)
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('ProductCtrl', ['productService','$route',ProductCtrl])