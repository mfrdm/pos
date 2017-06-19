(function() {
    angular.module('posApp')
        .controller('StorageCtrl', ['DataPassingService', 'StorageService', '$scope', '$window', '$route', StorageCtrl])

    function StorageCtrl (DataPassingService, StorageService, $scope, $window, $route){
    	var vm = this;
    	/* Model description
    	
    	// dom
		vm.model.dom.filterDiv: filter div
		vm.model.dom.addStorageDiv: create storage div
		vm.model.dom.editStorageDiv: edit storage div

		// Filter model
		vm.model.filter

		// Sorting model
		vm.model.sorting

		// Storage list
		vm.model.storageList

		// Add storage
		vm.model.storage: storage will be sent to server to create new storage

		// Edit storage
		vm.model.editStorage: will be sent to edit

        // start time, end time
        vm.model.temporary.startTime
        vm.model.temporary.endTime
    	*/
    	vm.ctrl = {
    		getStorageList:{}, // Get storage
    		dom:{
    			openAddStorage:{},
    			toggleFilter:{},
    			openEditStorage:{}
    		},
    		filter:{}
    	};
    	vm.model = {
    		dom:{
    			filterDiv:false,
    			addStorageDiv:false,
    			editStorageDiv:false
    		},
            temporary:{
                startTime:'',
                endTime:'',
                itemId:'',
                quantity:'',
                note:''
            },
            product:{
                name:'',
                category:'',
                price:'',
                note:''
            },
            storage:{
                itemList:[],
            },
    		filter:{},
    		sorting:{},
    		storageList:[],
    		storage:{},
    		editStorage:{},
    	}

        vm.model.categoryOptions = [
            {label:'Soft Drink', value:1},
            {label:'Fast Food', value:2},
            {label:'Snack', value:3},
            {label:'Asset', value:4}
        ];

        vm.model.productOptions = []

        /////////////////////////////////////Initial///////////////////////////////////
        angular.element(document.getElementById ('mainContentDiv')).ready(function () {// after page load
            vm.ctrl.getAllProducts();
        });

        ///////////////////////////////////// Product /////////////////////////////////
        // get all products
        vm.ctrl.getAllProducts = function(){
            StorageService.readProducts().then(function(res){
                res.data.data.map(function(ele){
                    vm.model.productOptions.push({
                        label:ele.name,
                        value:ele._id
                    })
                })
                console.log(vm.model.productOptions)
            })
        }
        
        // add product
        vm.ctrl.addProduct = function(){
            StorageService.createProduct(vm.model.product).then(function(res){
                console.log(res.data.data)
            })
        }

        ///////////////////////////////////// Storage /////////////////////////////////

        // add storage
        vm.ctrl.addStorage = function(){
            vm.model.storage.itemList.push()
            StorageService.createStorage(vm.model.storage).then(function(res){
                console.log(res.data.data)
            })
        }

    	///////////////////////////// Get storage ////////////////////////////////////
    	vm.ctrl.getStorageList = function(){
    		StorageService.readStorageList(vm.model.temporary.startTime, vm.model.temporary.endTime).then(function(res){
    			console.log(res.data.data)
    		})
    	}
    }
})()