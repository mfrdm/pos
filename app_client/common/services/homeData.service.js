angular 
	.module ('posApp')
	.service ('homeData', homeData);

function homeData ($http) {
	// no data
	return {
		message: 'Test service for home'
	}
}
