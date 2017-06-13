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
    		filter:{},
    		sorting:{},
    		storageList:[],
    		storage:{},
    		editStorage:{},
    		options:[{label:'Name', value:'name'}, {label:'Age', value:'age'}],
    		items:[{name:'cuong', age:22}, {name:'long', age:20}]
    	}

    	///////////////////////////// Get storage ////////////////////////////////////
    	vm.ctrl.getStorageList = function(){
    		StorageService.readStorageList().then(function(res){
    			console.log(res.data.data)
    		})
    	}
    	vm.ctrl.filter = function(){
    		console.log(vm.model.filter)
    	}
    }
})()