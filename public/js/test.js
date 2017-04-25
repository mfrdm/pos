$(document).ready(function(){
	toggleSidebar()
	$(window).on('resize', function(){
		toggleSidebar()
	})
	triggerSidebar()
	$(document).foundation();
	$(document).foundation('abide', 'reflow');
})


var toggleSidebar = function(){
	if($(window).width() <= 480){
		$('.sidebar').hide()
		$('.fa-bars').show()
	}else{
		$('.sidebar').show()
		$('.fa-bars').hide()
	}
}
var triggerSidebar = function(){
	$(document).on('click', 'i.fa-bars', function(){
		$('.sidebar').toggle('slow')
	})
}