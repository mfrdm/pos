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
            title:"Storage",
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
            vm.ctrl.getProductQuantityList();
        });

        // Function
        function getProductName (id){
            if(vm.model.productOptions.length && vm.model.productOptions.length>0){
                return vm.model.productOptions.filter(function(ele){
                    return ele.value == id
                })[0].label
            }
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
                vm.model.title = "Storage"
            }else{
                vm.model.dom.storageList = false;
                vm.model.dom.productList = true;
                vm.model.title = "Product"
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
        ////////////////////////////////////////// Paginate for product ///////////////////////////////////////
        vm.model.temporary.displayedList = {
            product:[],
            productNumber:[],
            storage:[],
            storageNumber:[]
        };
        vm.model.pagination = {
            product:{
                itemsEachPages:5,
                numberOfPages:''
            },
            storage:{
                itemsEachPages:5,
                numberOfPages:''
            }
        }
        vm.model.listEachPageProduct = {}
        vm.ctrl.product = {}
        vm.model.productPage = {}


        // Slice list after filter
        vm.ctrl.product.getFilteredCheckinList = function (){
            // Input
            if(vm.model.dom.product.list.length && vm.model.dom.product.list.length > 0){
                vm.model.temporary.displayedList.product = vm.model.dom.product.list.filter(function(ele){
                    if(vm.model.filter.category == 'All'){
                        return ele
                    }else{
                        return ele.category == vm.model.filter.category
                    }
                }).filter(function(item){
                    return (item.name).includes(vm.model.filter.productName)
                })
                return vm.model.temporary.displayedList.product
            }
        }

        function checkDisabledButtonProduct(){
            var ind = 0;
            vm.model.temporary.displayedList.productNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+1 == vm.model.temporary.displayedList.productNumber.length){
                vm.model.productPage.nextClass = "pagination-next disabled";
                vm.model.productPage.goNextText = 'Next'
            }else{
                vm.model.productPage.nextClass = "pagination-next";
                vm.model.productPage.goNextText = ''
            };
            if(ind == 0){
                vm.model.productPage.previousClass = "pagination-previous disabled";
                vm.model.productPage.goPreviousText = 'Previous'
            }else{
                vm.model.productPage.previousClass = "pagination-previous";
                vm.model.productPage.goPreviousText = ''
            }
        }

        vm.ctrl.product.goNext = function(){
            var ind = 0;
            vm.model.temporary.displayedList.productNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+2 <= vm.model.temporary.displayedList.productNumber.length){
                vm.ctrl.product.sliceCheckinList(ind+2)
            }
        }

        vm.ctrl.product.goPrevious = function(){
            var ind = 0;
            vm.model.temporary.displayedList.productNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind >= 1){
                vm.ctrl.product.sliceCheckinList(ind)
            }
        }

        // Paginate
        vm.ctrl.product.paginate = function (afterFilterList){
            if(afterFilterList){
                vm.model.temporary.displayedList.productNumber = []
                vm.model.pagination.product.numberOfPages = Math.ceil(
                    afterFilterList.length/vm.model.pagination.product.itemsEachPages)
                
                for(var i = 1; i<vm.model.pagination.product.numberOfPages+1; i++){
                    vm.model.temporary.displayedList.productNumber.push({number:i, class:''})
                }
                vm.model.temporary.displayedList.productNumber.map(function(ele, index, array){
                    array[0].class = 'current'
                })
                
                checkDisabledButtonProduct()
                vm.model.listEachPageProduct.product = afterFilterList.slice(0, vm.model.pagination.product.itemsEachPages)
                vm.ctrl.product.sliceCheckinList = function(i){
                    vm.model.listEachPageProduct.product = afterFilterList.slice((i-1)*vm.model.pagination.product.itemsEachPages,i*vm.model.pagination.product.itemsEachPages)
                    vm.model.temporary.displayedList.productNumber.map(function(ele, index, array){
                        if(index == i-1){
                            array[index].class = 'current'
                        }else{
                            array[index].class = ''
                        }
                    });
                    
                    checkDisabledButtonProduct()
                }

                vm.ctrl.product.showInPage = function(product){
                    var testArr = vm.model.listEachPageProduct.product.filter(function(ele){
                        return ele.name == product.name && ele.createdAt == product.createdAt
                    })
                    if(testArr.length > 0){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }

        // // Paginate after filter
        vm.ctrl.product.filterPaginate = function (){
            var afterFilterList = vm.ctrl.product.getFilteredCheckinList();
            vm.ctrl.product.paginate(afterFilterList)
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////// Paginate for storage ///////////////////////////////////////
        vm.model.listEachPageStorage = {}
        vm.ctrl.storage = {}
        vm.model.storagePage = {}


        // Slice list after filter
        vm.ctrl.storage.getFilteredCheckinList = function (){
            // Input
            if(vm.model.dom.storage.list.length && vm.model.dom.storage.list.length > 0){
                vm.model.temporary.displayedList.storage = vm.model.dom.storage.list.filter(function(item){
                    return (item.name).includes(vm.model.filter.productName)
                })
                return vm.model.temporary.displayedList.storage
            }
        }

        function checkDisabledButtonStorage(){
            var ind = 0;
            vm.model.temporary.displayedList.storageNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+1 == vm.model.temporary.displayedList.storageNumber.length){
                vm.model.storagePage.nextClass = "pagination-next disabled";
                vm.model.storagePage.goNextText = 'Next'
            }else{
                vm.model.storagePage.nextClass = "pagination-next";
                vm.model.storagePage.goNextText = ''
            };
            if(ind == 0){
                vm.model.storagePage.previousClass = "pagination-previous disabled";
                vm.model.storagePage.goPreviousText = 'Previous'
            }else{
                vm.model.storagePage.previousClass = "pagination-previous";
                vm.model.storagePage.goPreviousText = ''
            }
        }

        vm.ctrl.storage.goNext = function(){
            var ind = 0;
            vm.model.temporary.displayedList.storageNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+2 <= vm.model.temporary.displayedList.storageNumber.length){
                vm.ctrl.storage.sliceCheckinList(ind+2)
            }
        }

        vm.ctrl.storage.goPrevious = function(){
            var ind = 0;
            vm.model.temporary.displayedList.storageNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind >= 1){
                vm.ctrl.storage.sliceCheckinList(ind)
            }
        }

        // Paginate
        vm.ctrl.storage.paginate = function (afterFilterList){
            if(afterFilterList){
                vm.model.temporary.displayedList.storageNumber = []
                vm.model.pagination.storage.numberOfPages = Math.ceil(
                    afterFilterList.length/vm.model.pagination.storage.itemsEachPages)
                
                for(var i = 1; i<vm.model.pagination.storage.numberOfPages+1; i++){
                    vm.model.temporary.displayedList.storageNumber.push({number:i, class:''})
                }
                vm.model.temporary.displayedList.storageNumber.map(function(ele, index, array){
                    array[0].class = 'current'
                })
                
                checkDisabledButtonStorage()
                vm.model.listEachPageStorage.storage = afterFilterList.slice(0, vm.model.pagination.storage.itemsEachPages)
                vm.ctrl.storage.sliceCheckinList = function(i){
                    vm.model.listEachPageStorage.storage = afterFilterList.slice((i-1)*vm.model.pagination.storage.itemsEachPages,i*vm.model.pagination.storage.itemsEachPages)
                    vm.model.temporary.displayedList.storageNumber.map(function(ele, index, array){
                        if(index == i-1){
                            array[index].class = 'current'
                        }else{
                            array[index].class = ''
                        }
                    });
                    
                    checkDisabledButtonStorage()
                }

                vm.ctrl.storage.showInPage = function(product){
                    var testArr = vm.model.listEachPageStorage.storage.filter(function(ele){
                        return ele.name == product.name && ele.createdAt == product.createdAt
                    })
                    if(testArr.length > 0){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }

        // // Paginate after filter
        vm.ctrl.storage.filterPaginate = function (){
            var afterFilterList = vm.ctrl.storage.getFilteredCheckinList();
            vm.ctrl.storage.paginate(afterFilterList)
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
                        });
                    };
                });
                vm.ctrl.getStorageList();
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
                            console.log(item.name)
                            item.createdAt = ele.createdAt
                            vm.model.dom.storage.list.push(item)
                        })
                    })
                };
                if(vm.model.dom.storage.list.length){
                    vm.ctrl.storage.filterPaginate()
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
                    });
                });
                vm.ctrl.product.filterPaginate();
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