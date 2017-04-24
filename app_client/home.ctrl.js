angular
	.module ('posApp')
	.controller ('homeCtrl', homeCtrl);

function homeCtrl (homeData) {
	var vm = this;
	vm.test = 'home'
}