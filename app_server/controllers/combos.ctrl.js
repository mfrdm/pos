var mongoose = require ('mongoose');
var Combos = mongoose.model ('combos');

module.exports = new CombosCtrl();

function CombosCtrl() {
	this.purchaseCombos = function (){
		
	}

	this.readAngularCombo = function(req, res){
		helper.angularRender( req, res,'combo')
	}
}