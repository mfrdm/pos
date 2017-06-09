angular.module ('posApp')
	.service ('CheckinService', ['$http','$q', CheckinService])

function CheckinService ($http, $q){
	this.searchCustomers = function(input){
		return $http({
			method:'GET',
			url:'/checkin/search-customers',
			params: {input: input}
		});
	}	

	//Validate Promote Code
	this.validatePromoteCode = function(query){
		return $http({
			method: 'GET',
			url: '/checkin/validate-promotion-code',
			params: query
		})
	}

	this.getPromocodes = function (){
		return $http({
			method: 'GET',
			url: '/promocodes/'
		});
	}

	this.getCheckedinList = function(query){
		query.status = query.status ? query.status : 4; // get all by default

		return $http({
			method:'GET',
			url:'/checkin',
			params: query,
		})
	}

	this.readSomeProducts = function(){
		return $http({
			method:'GET',
			url:'/api/products'
		})
	}

	this.createOne = function (customerId, data) {
		return $http({
			method:'POST',
			url:'/checkin/customer/' + customerId,
			data: JSON.stringify({data: data}),
		});
	};

	this.readOneParent = function(id){
		return $http({
			method:'GET',
			url:'/occupancies/occupancy/'+id
		})
	}
	//Update new Order
	this.updateOne = function(id, service, parent){
		return $http({
			method: 'POST',
			url: '/checkin/customer/edit/'+id,
			data: JSON.stringify({
				$set: { service: service, parent:parent }
			})
		})
	};

	//Checkout for customer
	this.checkout = function(occupancy){
		return $http({
			url:'/checkout',
			method:'POST',
			data:JSON.stringify({data: occupancy})
		})
	};

	this.readInvoice = function(id){
		return $http({
			url: '/checkout/invoice/'+ id,
			method:'GET'
		})
	}
}


    // var mockEditDataReturn = {
    //     "customer": {
    //         "fullname": "LÊ THỊ DUYÊN",
    //         "_id": "5924168b164cb9030cee9509",
    //         "phone": "0904543572",
    //         "email": "duyenlt.nevents@gmail.com",
    //         "isStudent": true
    //     },
    //     "promocodes": [{
    //         "_id": "592e3e0b4eb93492334f27da",
    //         "name": "v01h06",
    //         "codeType": 1,
    //         "priority": 2,
    //         "override": [],
    //         "services": [
    //             "group common",
    //             "individual common"
    //         ],
    //         "status": 3
    //     }],
    //     "service": {
    //         "_id": "59195b6103476b069405e57f",
    //         "name": "individual common",
    //         "price": 15000,
    //         "category": 1,
    //         "__v": 0,
    //         "updatedAt": [],
    //         "createdAt": "2017-05-15T07:40:17.132Z",
    //         "label": "Cá nhân"
    //     },
    // }

    // var mockBeforeEditData = [{
    //     "customer": {
    //         "fullname": "LÊ THỊ DUYÊN",
    //         "_id": "5924168b164cb9030cee9509",
    //         "phone": "0904543572",
    //         "email": "duyenlt.nevents@gmail.com",
    //         "isStudent": true
    //     },
    //     "promocodes": [],
    //     "service": {
    //         "_id": "59195b6103476b069405e57f",
    //         "name": "group common",
    //         "price": 15000,
    //         "category": 1,
    //         "__v": 0,
    //         "updatedAt": [],
    //         "createdAt": "2017-05-15T07:40:17.132Z",
    //         "label": "Nhóm chung"
    //     },
    // }, {
    //     "customer": {
    //         "fullname": "LÊ THỊ DUYÊN",
    //         "_id": "5924168b164cb9030cee9509",
    //         "phone": "0904543572",
    //         "email": "duyenlt.nevents@gmail.com",
    //         "isStudent": true
    //     },
    //     "promocodes": [],
    //     "parent": "59263d72a74493116b6fe1ab",
    //     "service": {
    //         "_id": "59195b6103476b069405e57f",
    //         "name": "group common",
    //         "price": 15000,
    //         "category": 1,
    //         "__v": 0,
    //         "updatedAt": [],
    //         "createdAt": "2017-05-15T07:40:17.132Z",
    //         "label": "Nhóm chung"
    //     },
    // }]
