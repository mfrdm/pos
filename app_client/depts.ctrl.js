app.controller('DeptCtrl', ['deptService','$route',DeptCtrl])

function DeptCtrl(deptService, $route){
	var vm = this;
		vm.tab = 'tab-main';
		vm.storeInfo = {};
		vm.look = {};
		vm.searchResult = {};
		vm.store = {};
		vm.storeInfo.contact = {}
		vm.look.allstores = [];

		vm.look.storesSearchResultDiv = false;
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
		//get all stores
		deptService.readSome()
			.then(function success(res){
				vm.look.allStores = res.data.data
			}, function error(err){
				console.log(err)
			})
		////////////////////////////////////////////////////////
		//Search store
		vm.searchFunc = function(){
			deptService.search(vm.searchInput)
			.then(function success(res){
				console.log(res)
				vm.searchResult.stores = res.data.data;
				vm.look.storesSearchResultDiv = true;
				//Go to view one customer
				vm.selectStoreToViewProfile = function(index){
					vm.tab = 'tab-profile';
					deptService.readOne(vm.searchResult.stores[index]._id)
						.then(function success(res){
							vm.store = res.data.data
						})
				}
			}, function error(err){
				console.log(err)
			})
		}

		vm.selectStoreInListToViewProfile = function(index){
			vm.tab = 'tab-profile';
			vm.store = vm.look.allStores[index]
		}
		
		////////////////////////////////////////////////////////
		//Create Page
		vm.createNewStore = function(){
			vm.storeInfo.name = vm.name
			vm.storeInfo.manager = vm.manager
			vm.storeInfo.contact.email = vm.contactEmail
			vm.storeInfo.contact.phone = vm.contactPhone
			deptService.createOne(vm.storeInfo)
				.then(function success(res){
					$route.reload()
				}, function error(err){
					console.log(err)
				})
		}
		////////////////////////////////////////////////////////
		//Edit Page
		vm.saveEdit = function(){

			vm.data={
				$set:vm.store
			}

			deptService.updateOne(vm.store._id, vm.data)
				.then(function success(res){
					console.log(res)
					$route.reload()
					vm.tab = 'tab-main';
				}, function error(err){
					console.log(err)
				})
		}
}
