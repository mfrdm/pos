conn = new Mongo ();
db = conn.getDB ('pos');

// removeUnneccesaryTitle (db);

function removeUnneccesaryTitle (db){
	cus = db.customers.find ({createdAt: {$lte: ISODate ('2017-05-24')}, $where: "this.edu.length > 1"});

	cus.forEach (function (e){
		e.edu.splice (0, 1);
		db.customers.save (e);
	});
}