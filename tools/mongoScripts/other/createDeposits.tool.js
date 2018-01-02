function connect (dbname){
	var conn = new Mongo ();
	var db = conn.getDB (dbname);
	return db
};

function createDepositOnly (dbName){
	var db = connect (dbName);	
	var customer

}
