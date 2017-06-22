conn = new Mongo ();
db = conn.getDB ('pos');

upperCodeInPromocodes (db);
upperCodeInOccupancies (db);
changeCodeName (db);

function upperCodeInPromocodes (db){
	occ = db.occupancies.find ();

	occ.forEach (function (e){
		e.promocodes.map (function (x, i, arr){
			x.name = x.name.toUpperCase ();
		});

		db.occupancies.save (e);
	})
}

function upperCodeInOccupancies (db){
	promocodes = db.promocodes.find ();
	promocodes.forEach (function (e){
		e.name = e.name.toUpperCase ();
		db.promocodes.save (e);
	})
}

function changeCodeName (db){
	promocodes = db.promocodes.find ();
	promocodes.forEach (function (e){
		if (e.name == 'V02H06'){
			e.name = '02H_062017'
		}
		else if (e.name == 'V01H06'){
			e.name = '01H_062017'
		}
		else if (e.name == 'V01H06'){
			e.name = '01H_062017'
		}
		else if (e.name == 'GS05'){
			e.name = 'NEW_01H_052017'
		}
		else if (e.name == "NEWCUSTOMER_01H_062017"){
			e.name = "NEW_01H_062017"
		} 
		else if (e.name == "MAR05"){
			e.name = "MARKETING_01H_052017"
		} 

		db.promocodes.save (e);
	});

	occ = db.occupancies.find ();
	occ.forEach (function (e){
		e.promocodes.map (function (x, i, arr){
			if (x.name == 'V02H06'){
				x.name = '02H_062017'
			}
			else if (x.name == 'V01H06'){
				x.name = '01H_062017'
			}
			else if (x.name == 'GS5'){
				x.name = 'NEW_01H_052017'
			} 
			else if (x.name == "NEWCUSTOMER_01H_062017"){
				x.name = "NEW_01H_062017"
			}
			else if (x.name == "PRIVATEDISCOUNTPRICE"){
				if (e.service.name == 'Small group private'){
					x.name = "SMALLPRIVATEDISCOUNTPRICE";
				}
				else if (e.service.name == 'Medium group private'){
					x.name = "MEDIUMPRIVATEDISCOUNTPRICE";
				}
				else if (e.service.name == 'Large group private'){
					x.name = "LARGEPRIVATEDISCOUNTPRICE";
				}				
			}

		});

		db.occupancies.save (e);
	})


}



