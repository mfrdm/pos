(function() {
    angular.module('posApp')
        .controller('StorageCtrl', ['DataPassingService', 'StorageService', '$scope', '$window', '$route', StorageCtrl])

    function StorageCtrl (DataPassingService, StorageService, $scope, $window, $route){
    	var vm = this;
        var LayoutCtrl = DataPassingService.get('layout');
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
                returnStorageDiv:false,
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
                endTime:'',
                sorting:'name',
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
            {label:'Soft Drink', value:2},
            {label:'Fast Food', value:3},
            {label:'Snack', value:4},
            {label:'Asset', value:5}
        ];

        vm.model.categoryOptionsFilter = [
            {label:'Soft Drink', value:2},
            {label:'Fast Food', value:3},
            {label:'Snack', value:4},
            {label:'Asset', value:5},
            {label:'All', value:1000}
        ];

        vm.model.productOptions = []

        vm.model.timeOptions = [
            {label:'Now', value:1},
            {label:'In a Duration', value:2}
        ]

        vm.model.locationOptions = [
            {label:LayoutCtrl.model.dept.name, value:LayoutCtrl.model.dept._id},
        ]

        vm.model.sortingOptions = [
            {label:'Name A-Z', value:'name'},
            {label:'Name Z-A', value:'-name'}
        ]

        /////////////////////////////////////Initial///////////////////////////////////
        angular.element(document.getElementById ('mainContentDiv')).ready(function () {// after page load
            vm.ctrl.getAllProducts();
            vm.ctrl.getStorageList();
            vm.ctrl.getProductQuantityList();
        });

        // Function
        function getProductName (id){
            console.log(id, vm.model.productOptions)
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

        vm.ctrl.openReturnStorage = function(){
            vm.model.dom.returnStorageDiv = true;
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
        }

        vm.ctrl.toggleFilter = function(){
            if(vm.model.dom.filterDiv){
                vm.model.dom.filterDiv = false;
                vm.model.filter.productName = ''
                vm.model.filter.category = 'All'
                vm.model.filter.time = 1
                vm.model.filter.startTime = ''
                vm.model.filter.endTime = ''
            }else{
                vm.model.dom.filterDiv = true;
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////// Paginate ///////////////////////////////////////////////////
        vm.model.temporary.displayedList = {
            data:[],
            number:[]
        };
        vm.model.pagination = {
            itemsEachPages:5,
            numberOfPages:''
        }

        function checkDisabledButton(){
            var ind = 0;
            vm.model.temporary.displayedList.number.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+1 == vm.model.temporary.displayedList.number.length){
                vm.model.nextClass = "pagination-next disabled";
                vm.model.goNextText = 'Next'
            }else{
                vm.model.nextClass = "pagination-next";
                vm.model.goNextText = ''
            };
            if(ind == 0){
                vm.model.previousClass = "pagination-previous disabled";
                vm.model.goPreviousText = 'Previous'
            }else{
                vm.model.previousClass = "pagination-previous";
                vm.model.goPreviousText = ''
            }
        }

        vm.ctrl.goNext = function(){
            var ind = 0;
            vm.model.temporary.displayedList.number.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+2 <= vm.model.temporary.displayedList.number.length){
                vm.ctrl.sliceCheckinList(ind+2)
            }
        }

        vm.ctrl.goPrevious = function(){
            var ind = 0;
            vm.model.temporary.displayedList.number.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind >= 1){
                vm.ctrl.sliceCheckinList(ind)
            }
        }

        // Paginate
        vm.ctrl.change = function(){
            console.log(vm.model.dom.product.list)
        }

        ///////////////////////////////////// Product /////////////////////////////////
        // get all products
        vm.ctrl.getAllProducts = function(){
            StorageService.readProducts().then(function(res){
                res.data.data.map(function(ele){
                    if(ele.category > 1){
                        vm.model.productOptions.push({
                            label:ele.name,
                            value:ele._id
                        })
                    }
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
            if(vm.model.temporary.itemId && vm.model.temporary.quantity){
                if(vm.model.storage.itemList.length > 0){
                    var temporaryList = vm.model.storage.itemList.filter(function(ele){
                        return ele.itemId == vm.model.temporary.itemId
                    });
                    if(temporaryList.length == 0){
                        vm.model.storage.itemList.push({
                            name: getProductName(vm.model.temporary.itemId),
                            itemId:vm.model.temporary.itemId,
                            quantity:vm.model.temporary.quantity
                        })
                    }
                }else{
                    vm.model.storage.itemList.push({
                        name: getProductName(vm.model.temporary.itemId),
                        itemId:vm.model.temporary.itemId,
                        quantity:vm.model.temporary.quantity
                    })
                }
            }
            
        }

        // remove from list
        vm.ctrl.removeStorageFromList = function(item){
            vm.model.storage.itemList = vm.model.storage.itemList.filter(function(ele){
                return ele.itemId != item.itemId
            })
        }

        // add storage
        vm.ctrl.addStorage = function(){
            if(vm.model.storage.itemList.length && vm.model.storage.storeId){
                StorageService.createStorage(vm.model.storage).then(function(res){
                    vm.ctrl.reset()
                })
            }
        }

        vm.ctrl.returnStorage = function(){
            if(vm.model.storage.itemList.length && vm.model.storage.storeId){
                var returnObj = Object.assign({}, vm.model.storage);
                returnObj.itemList.map(function(ele){
                    ele.quantity = -ele.quantity;
                })
                console.log(vm.model.storage.itemList)
                console.log(returnObj)
                StorageService.createStorage(returnObj).then(function(res){
                    vm.ctrl.reset()
                })
            }
        }

    	///////////////////////////// Storage List ////////////////////////////////////
    	vm.ctrl.getStorageList = function(){// all storage for today
            var start = new Date();
            start.setHours(0,0,0,0);
            var end = new Date();
            end.setHours(23,59,59,999);
    		StorageService.readStorageList(start, end).then(function(res){
                if(res.data.data.length){
                    res.data.data.map(function(ele){
                        ele.itemList.map(function(item){
                            item.name = getProductName(item.itemId)
                            vm.model.dom.storage.list.push(item)
                        })
                    })
                }
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