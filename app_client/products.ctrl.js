var ProductCtrl = function(productService, $route, $window){
	var vm = this;
	vm.tab = 'tab-main';

	vm.model = {};
	vm.ctrl = {};

	vm.model.product = {}
	vm.model.product.selectedForCreateProduct = {}
	//vm.model.product.selectedForCreateProduct: input model for new product
	
	vm.productInfo = {};
	vm.look = {};
	vm.searchResult = {};
	vm.product = {};

	vm.productInfo.edu = {};
	vm.look.productSearchResultDiv = false;
	vm.look.fields = ['name', 'price', 'category']
	////////////////////////////////////////////////////////
	// Setup ng-switch
	vm.toMain = function(){
		vm.tab = 'tab-main'
	}
	vm.toProfile = function(index){
		vm.tab = 'tab-profile';
	}
	vm.toEdit = function(){
		vm.tab = 'tab-edit';
	}
	////////////////////////////////////////////////////////
	//Search Page
	vm.searchFunc = function(){

		productService.search(vm.searchInput)
		.then(function success(res){
			vm.searchResult.products = res.data.data;
			vm.look.productSearchResultDiv = true;
			//Go to view one product
			vm.selectproductToViewProfile = function(index){
				vm.tab = 'tab-profile';
				productService.readOne(vm.searchResult.products[index]._id)
					.then(function success(res){
						vm.product.info = res.data.data
					})
			}
		}, function error(err){
			console.log(err)
		})
	}
	
	////////////////////////////////////////////////////////
	//Create Page
	vm.ctrl.createNewProduct = function(){
		productService.createOne(vm.model.product.selectedForCreateProduct)
			.then(function success(res){
				console.log(res)
				$window.alert('Create new product successfully')
			}, function error(err){
				console.log(err)
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.saveEdit = function(){
		vm.productData = {}
		
		vm.look.fields.map(function(field){
			vm.productData[field] = vm.product.info[field]
		})
		vm.data={
			$set:vm.productData
		}

		productService.updateOne(vm.product.info._id, vm.data)
			.then(function success(res){
				console.log(res)
				$route.reload()
				vm.tab = 'tab-main';
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('ProductCtrl', ['productService','$route','$window',ProductCtrl])