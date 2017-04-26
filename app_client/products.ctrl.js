var ProductCtrl = function(productService, $route){
	var vm = this;
	vm.tab = 'tab-main';
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
	vm.createNewProduct = function(){
		vm.productInfo.name = vm.name
		vm.productInfo.price = vm.price
		vm.productInfo.category = vm.category
		productService.createOne(vm.productInfo)
			.then(function success(res){
				console.log(res)
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

app.controller('ProductCtrl', ['productService','$route',ProductCtrl])