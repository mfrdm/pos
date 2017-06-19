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
                addProductDiv:false,
    			editStorageDiv:false,
                editProductDiv:false,
                productList:false,
                storageList:true,
                product:{
                    list:[]
                },
                storage:{
                    list:[]
                }
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
            },
    		filter:{
                productName:'',
                category:'All',
                time:1,
                startTime:'',
                endTime:''
            },
    		sorting:{},
    		storage:{
                itemList:[],
            },
            editStorage:{
                itemList:[]
            },
            editProduct:{}
    	}

        vm.model.categoryOptions = [
            {label:'Services', value:1},
            {label:'Soft Drink', value:2},
            {label:'Fast Food', value:3},
            {label:'Snack', value:4},
            {label:'Asset', value:5}
        ];

        vm.model.categoryOptionsFilter = [
            {label:'Services', value:1},
            {label:'Soft Drink', value:2},
            {label:'Fast Food', value:3},
            {label:'Snack', value:4},
            {label:'Asset', value:5},
            {label:'All', value:6}
        ];

        vm.model.productOptions = []

        vm.model.timeOptions = [
            {label:'Now', value:1},
            {label:'In a Duration', value:2}
        ]

        /////////////////////////////////////Initial///////////////////////////////////
        angular.element(document.getElementById ('mainContentDiv')).ready(function () {// after page load
            vm.ctrl.getAllProducts();
            vm.ctrl.getStorageList();
            vm.ctrl.getProductQuantityList();
        });

        // Function
        function getProductName (id){
            return vm.model.productOptions.filter(function(ele){
                return ele.value == id
            })[0].label
        }

        function getCategoryInNumber (cate){
            return vm.model.categoryOptions.filter(function(ele){
                return ele.label == cate
            })[0].value
        }

        vm.ctrl.reset = function(){
            $route.reload();
        }

        vm.ctrl.timeChange = function(){
            if(vm.model.filter.time == 1){
                var end = new Date();
                StorageService.readProductsQuantity(0, end).then(function(res){
                    var list = []
                    res.data.data.map(function(ele){
                        vm.model.categoryOptions.map(function(item){
                            if(item.value == ele.category){
                                ele.category = item.label
                                list.push(ele)
                            }
                        })
                    })

                    vm.model.dom.product.list = list;
                })
            }else{
                if(vm.model.filter.startTime && vm.model.filter.endTime){
                    StorageService.readProductsQuantity(vm.model.filter.startTime, vm.model.filter.endTime).then(function(res){
                        var list = []
                        res.data.data.map(function(ele){
                            vm.model.categoryOptions.map(function(item){
                                if(item.value == ele.category){
                                    ele.category = item.label
                                    list.push(ele)
                                }
                            })
                        });
                        vm.model.dom.product.list = list;
                    })
                }
            }
            
        }

        ///////////////////////////////////// Toogle //////////////////////////////////
        vm.ctrl.openCreateProduct = function(){
            vm.model.dom.addProductDiv = true;
        }

        vm.ctrl.openCreateStorage = function(){
            vm.model.dom.addStorageDiv = true;
        }

        vm.ctrl.toogleList = function(){
            if(vm.model.dom.productList){
                vm.model.dom.storageList = true;
                vm.model.dom.productList = false;
            }else{
                vm.model.dom.storageList = false;
                vm.model.dom.productList = true;
            }
        }

        vm.ctrl.openEditStorage = function(storage){
            vm.model.dom.editStorageDiv = true;
            vm.model.editStorage = storage;
        }

        vm.ctrl.openEditProduct = function(product){
            vm.model.dom.editProductDiv = true;
            vm.model.editProduct = product;
            vm.model.editProduct.category = getCategoryInNumber(product.category)
            console.log(vm.model.editProduct)
        }

        vm.ctrl.toggleFilter = function(){
            if(vm.model.dom.filterDiv){
                vm.model.dom.filterDiv = false;
                vm.model.filter.productName = ''
                vm.model.filter.category = 0
                vm.model.filter.time = 1
                vm.model.filter.startTime = ''
                vm.model.filter.endTime = ''
            }else{
                vm.model.dom.filterDiv = true;
            }
        }

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
            })
        }
        
        // add product
        vm.ctrl.addProduct = function(){
            if(vm.model.product.category && vm.model.product.name && vm.model.product.price)
            StorageService.createProduct(vm.model.product).then(function(res){
                vm.ctrl.reset()
            })
        }

        ///////////////////////////////////// Storage /////////////////////////////////

        // add product to itemList
        vm.ctrl.addToItemList = function(){
            
            vm.model.storage.itemList.push({
                name: getProductName(vm.model.temporary.itemId),
                itemId:vm.model.temporary.itemId,
                quantity:vm.model.temporary.quantity
            })
        }

        // add storage
        vm.ctrl.addStorage = function(){
            vm.model.storage.itemList.push()
            StorageService.createStorage(vm.model.storage).then(function(res){
                vm.ctrl.reset()
            })
        }

    	///////////////////////////// Storage List ////////////////////////////////////
    	vm.ctrl.getStorageList = function(){// all storage for today
            var start = new Date();
            start.setHours(0,0,0,0);
            var end = new Date();
            end.setHours(23,59,59,999);
    		StorageService.readStorageList(start, end).then(function(res){
                res.data.data.map(function(ele){
                    ele.itemList.map(function(item){
                        item.name = getProductName(item.itemId)
                        vm.model.dom.storage.list.push(item)
                    })
                })
    		})
    	};

        ///////////////////////////// Product List ////////////////////////////////////
        vm.ctrl.getProductQuantityList = function(){// all products until now
            var end = new Date();
            StorageService.readProductsQuantity(0, end).then(function(res){
                res.data.data.map(function(ele){
                    vm.model.categoryOptions.map(function(item){
                        if(item.value == ele.category){
                            ele.category = item.label
                            vm.model.dom.product.list.push(ele)
                        }
                    })
                })
            })
        };

        ///////////////////////////// Edit Product ////////////////////////////////////
        vm.ctrl.editProduct = function(){
            StorageService.editProduct(vm.model.editProduct._id, vm.model.editProduct).then(function(res){
                vm.ctrl.reset()
            })
        }

        ///////////////////////////// Edit Storage ////////////////////////////////////
        // vm.ctrl.editStorage = function(){
        //     console.log(vm.model.editStorage)
        //     var sentData = {
        //         $set:{
        //             name:vm.model.editStorage.name,
        //             quantity:vm.model.editStorage.quantity
        //         }
        //     }
        //     StorageService.editStorage(vm.model.editStorage.itemId, sentData).then(function(res){
        //         console.log(res.data.data)
        //     })
        // }
    }
})()