angular
	.module ('posApp')
	.filter('myfilter', [myfilter])

function myfilter(){
	return function(item, condition){
		if(!item){
			return item
		}else{
			if(condition != 0){
				return item.filter(function(ele){return ele.status == condition})
			}
			return item
		}
	}
}