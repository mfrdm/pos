var mongoose = require ('mongoose');
var Combos = mongoose.model ('combos');

module.exports = new CombosCtrl();

function CombosCtrl() {
	this.buy = function (){
		
	};

	this.readAngularCombo = function(req, res){
		helper.angularRender( req, res,'combo')
	};

	this.createACombo = function (req, res, next){

	};
}