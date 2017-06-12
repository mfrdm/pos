(function (){
	angular.module('posApp')
		.controller('DepositCtrl', ['$route', 'DataPassingService', 'CustomerService', 'DepositService', DepositCtrl])

	function DepositCtrl ($route, DataPassingService, CustomerService, DepositService){
		var LayoutCtrl = DataPassingService.get ('layout');
		var vm = this;

		var accounts = [
			{
				label: {
					vn: 'Combo 1 ngày',
				},
				amount: 24,
				unit: 'hour',
			}
		]

		vm.ctrl = {
			deposit: {}
		};

		vm.model = {
			staff: LayoutCtrl.user,
			company: LayoutCtrl.company,
			dept: LayoutCtrl.dept,
			depositing:{
				account: null,
				customer: {}
			},
			dom: {
				messageSearchResult: false,
				deposit: {
					depositDiv: false,
					confirmDiv: false,
					customerSearchResultDiv: false,
					search: {
						message: {
							notFound: false,

						}
						
					},
					accounts: {
						default: [],
					}					
				},
				filterDiv: true,
				data: {},				
			},
			search: {
				deposit: {
					username: '',
					customers: [],
				}
			},			
			temporary: {
				depositing: {
					account: null,
				},
			},
			filter:{
				orderBy:'',
				orderOptions:{
					'customer.fullname': 'Tên A-Z',
					'-customer.fullname':'Tên Z-A',
					'checkinTime': 'Checkin A-Z',
					'-checkinTime': 'Checkin Z-A'
				},
				myfilter:{
					status: '1',
				},
				statusOptions: [
					{value: '1', label: 'Checked-in'},
					{value: '2', label: 'Checked-out'},
					{value: '3', label: 'All'},
				],
				others:{
					customer:{
						username:''
					}
				}
			}			
		};

		vm.model.dom.data.selected = {};

		// FIX format
		// English version
		vm.model.dom.data.eng = {
			modelLanguage: 'en',
			title: 'Deposite List',	
			deposit: {
				buttonToogle:'Checkin',
				search:{
					label:'Search Customers',
					placeholder:'Enter phone/email to search customers',
					message:{
						notFound:'Not Found Customer: '
					},
					list:{
						number:'No',
						fullname:'',
						birthday:'',
						email:'',
						phone:''
					}
				},
			},					
		};

		// FIX format
		// Vietnamese version
		vm.model.dom.data.vn = {
			modelLanguage: 'vn',
			title: 'Deposite List',
			deposit: {
				buttonToogle:'Mua tài khoản trả trước',
				accounts: accounts,
				search:{
					label:'Khách hàng',
					placeholder:'Điền tên, sđt, hoặc email để tìm kiếm khách hàng',
					message:{
						notFound:'Không tìm thấy khách hàng: '
					},
					list:{
						number:'No',
						fullname:'Họ và tên',
						birthday:'Sinh nhật',
						email:'Email',
						phone:'Điện thoại'
					}
				},
			},
			sorting:{
				label:'Sắp xếp'
			},
			filter:{
				status:'Trạng thái',
				username:'Tên / Sđt'
			},
			seeMoreBtn:'More',
			seeMoreBtnIcon : 'swap_horiz'

		};

		// OTHER
		vm.ctrl.toggleDepositDiv = function (){
			if (!vm.model.dom.deposit.depositDiv){		
				vm.ctrl.deposit.initDepositDiv ();
			}
			else{
				vm.ctrl.deposit.reset ();
			}
		}		

		// DEPOSIT controller
		vm.ctrl.deposit.initDepositDiv = function (){
			vm.model.dom.deposit.depositDiv = true;
		}

		vm.ctrl.deposit.reset = function (){
			vm.ctrl.reset ();
		}

		vm.ctrl.deposit.cancel = function (){
			vm.ctrl.deposit.reset ();
		}

		vm.ctrl.deposit.searchCustomer = function (){
			vm.ctrl.showLoader ();

			if (vm.model.depositing.account){
				vm.model.depositing.account = null;
			}

			CustomerService.readCustomers (vm.model.search.deposit.username).then(
				function success (res){
					vm.ctrl.hideLoader ();
					if (!res.data){
						// unexpected result. should never exist
					}
					else{
						if (res.data.data.length){
							vm.model.search.deposit.customers = res.data.data;
							vm.model.dom.deposit.search.message.notFound = false;
							vm.model.dom.deposit.customerSearchResult = true;
							
						}
						else{
							vm.model.dom.deposit.search.message.notFound = true;
							vm.model.dom.deposit.customerSearchResult = false;
						}
					}
				}, 
				function error (err){
					vm.ctrl.hideLoader ();
					console.log(err)
				}
			);
		}

		vm.ctrl.deposit.selectCustomer = function (index){
			vm.model.depositing.customer = {
				_id: vm.model.search.deposit.customers [index]._id,
				fullname: vm.model.search.deposit.customers [index].fullname,
				email: vm.model.search.deposit.customers [index].email,
				phone: vm.model.search.deposit.customers [index].phone,
				isStudent: vm.model.search.deposit.customers [index].isStudent,
			}

			vm.model.search.deposit.username = vm.model.search.deposit.customers[index].fullname + (vm.model.search.deposit.customers [index].email[0] ? ' / ' + vm.model.search.deposit.customers [index].email[0] : '') + (vm.model.search.deposit.customers [index].phone[0] ? ' / ' + vm.model.search.deposit.customers [index].phone[0] : '');

			vm.ctrl.deposit.resetSearchCustomerDiv ();
			vm.ctrl.deposit.loadDefaultAccounts ();
		}

		vm.ctrl.deposit.resetSearchCustomerDiv = function (){
			vm.model.dom.deposit.customerSearchResult = false;
			vm.model.search.deposit.customers = [];			
		}

		vm.ctrl.deposit.loadDefaultAccounts = function (){
			if (vm.model.dom.deposit.accounts.default.length){
				return;
			}

			vm.ctrl.showLoader ()
			DepositService.readDefaultAccounts ().then (
				function success (res){
					vm.ctrl.hideLoader ();

					if (res.data.data){
						vm.model.dom.deposit.accounts.default = res.data.data;
					}

				},
				function error (err){
					vm.ctrl.hideLoader ();
					console.log (err);
				}

			);
		}

		vm.ctrl.deposit.accountChangeHandler = function (){
			if (vm.model.temporary.depositing.account.start && vm.model.temporary.depositing.account.label){
				vm.ctrl.deposit.addAccount ();
			}
			
		}

		// account is not deep copied. Need to reset default accounts
		vm.ctrl.deposit.addAccount = function (){
			if (vm.model.temporary.depositing.account.start){
				vm.model.depositing.account = {};
				var obj = Object.assign(vm.model.depositing.account, vm.model.temporary.depositing.account);

				vm.model.temporary.depositing.account.start = null;
				vm.model.temporary.depositing.account = {};
			}
		}

		vm.ctrl.deposit.removeAccount = function (){
			vm.model.depositing.account = '';
		}

		vm.ctrl.deposit.invoice = function (){
			if (vm.model.depositing.account && vm.model.depositing.account.start && vm.model.depositing.account.label && vm.model.depositing.customer && vm.model.depositing.customer.fullname){

				vm.ctrl.showLoader ();
				DepositService.readInvoice (vm.model.depositing).then (
					function success (res){
						vm.ctrl.hideLoader ();
						vm.model.dom.deposit.confirmDiv = true;
						var fullAccount = vm.model.depositing.account; // account for different between server model and client model
						vm.model.depositing = res.data.data;
						vm.model.depositing.account = fullAccount;
					},
					function error (err){
						vm.ctrl.hideLoader ();
						console.log (err);

					},					
				)

			}
			
			
		}

		vm.ctrl.deposit.invoiceBackDepositForm = function (){
			vm.model.dom.deposit.confirmDiv = false;
		}		

		vm.ctrl.deposit.submit = function (){
			vm.ctrl.showLoader ();
			DepositService.createOneDeposit (vm.model.depositing).then (
				function success (res){
					vm.ctrl.hideLoader ();
					vm.ctrl.reset ();
				},
				function error (err){
					vm.ctrl.hideLoader ();
					console.log (err);

				},					
			)
		}

		vm.ctrl.showLoader = function (){
			LayoutCtrl.ctrl.showTransLoader ();
		};

		vm.ctrl.hideLoader = function (){
			LayoutCtrl.ctrl.hideTransLoader ();
		};		

		vm.ctrl.reset = function (){
			$route.reload ();
		};

		////////////////////////////// INITIALIZE ///////////////////////////////		
		vm.model.dom.data.selected = vm.model.dom.data.vn;
		angular.element(document.getElementById ('mainContentDiv')).ready(function () {

		});	

	};

}());

