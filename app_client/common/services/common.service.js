angular
	.module ('posApp')
	.service ('motion', [motion]);

function motion (){
	this.hide = function (id){
		$(id).foundation ('hide');
	}

	this.show = function (id){
		$(id).foundation ('show');
	}
}