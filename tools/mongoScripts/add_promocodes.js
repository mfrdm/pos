db = connect (dbname);

function connect (dbname){
	var conn = new Mongo ();
	var db = conn.getDB (dbname);
	return db
};


function add_promocode (username, codename){
	// user is phone or email
	db.occupancies.findOne ({$or: [{'customer.email': username}, {'customer.phone': username}], status: 1}).
}