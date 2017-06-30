function connect (dbname){
	var conn = new Mongo ();
	var db = conn.getDB (dbname);
	return db
};

function updateCodeNames (dbName){
	var db = connect (dbName);
	var codes = db.promocodes.find ();

	codes.forEach (function (e){
		if (e.name == 'MARKETING_01H_052017'){
			e.name = 'FREE_1H_COMMON_201705_MARKETING';
		}		
		else if (e.name == 'NEW_01H_052017'){
			e.name = 'FREE_1H_COMMON_201705_NEW';
		}
		else if (e.name == 'FREEWED'){
			e.name = 'FREE_1H_COMMON_201705_WEDNESDAY';
		}
		else if (e.name == 'FREE1DAYCOMMON'){
			e.name = 'FREE_24H_COMMON_201705_GOLDDAY';
		}
		else if (e.name == '01H_062017'){
			e.name = 'FREE_1H_COMMON_201706';
		}
		else if (e.name == '02H_062017'){
			e.name = 'FREE_2H_COMMON_201706';
		}		
		else if (e.name == 'SAC_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_SAC';
		}
		else if (e.name == 'IBC_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_IBC';
		}
		else if (e.name == 'SIC_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_SIC';
		}		
		else if (e.name == 'LCC_01H_062017'){
			e.name = 'FREE_1H_COMMON_201606_LCC';
		}
		else if (e.name == 'FBN_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_LCC';
		}
		else if (e.name == 'HRC_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_HRC';
		}
		else if (e.name == 'CFE_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_CFE';
		}	
		else if (e.name == 'ENACTUS_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_ENACTUS';
		}
		else if (e.name == 'JPC_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_JPC';
		}
		else if (e.name == 'REC_01H_062017'){
			e.name = 'FREE_1H_COMMON_201706_REC';
		}
		else if (e.name == 'PRIVATEHALFTOTAL'){
			e.name = '50PCT_PRIVATE_201705_GOLDDAY';
		}		
		else if (e.name == "YEUGREENSPACE"){
			e.name = '50PCT_ALL_201705_OPEN';
		}
		else if (e.name == "NEW_01H_062017"){
			e.name = 'FREE_1H_COMMON_201706_NEWCUSTOMER';
		}

		delete e.conflict;
		delete e.override;

		db.promocodes.save (e);
	})

};


updateCodeNames ('gsanalysis');
