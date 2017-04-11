$('.customer-step').hide()

$('body').on('click', 'input.button', function(){
	var val = $('input.input-group-field').val()
	$.ajax({
		url: 'http://localhost:3000/customers/customer/58eb3dd97e155c3df6eb09bd',
		type: 'GET',
		dataType: 'json'
	})
	.done(function(response) {
		var data = response.user.data;

		$('.checkin-step').hide();
		$('.customer-step').show();
		var rows = ['Firstname', 'Lastname'];
		var vals = [data.firstname, data.lastname];
		for (var i = 0; i<rows.length; i++){
			$('tbody.customer-detail').append('<tr><td>'+rows[i]+'</td><td>'+vals[i]+'</td></tr>')
		}
	})
	.fail(function() {
		console.log("error");
	})
})