createCode201707 ('gsanalysis')

function connect (dbname){
	var conn = new Mongo ();
	var db = conn.getDB (dbname);
	return db
};

function createCode201707 (dbName){
	var db = connect (dbName);

	var codes = [
		{
			name: "SMALLPRIVATEDISCOUNTPRICE",
			desc: {type: 'Discount the price for small private service after the first hour'},
			label: {
				vn: 'Giảm giá sau giờ đầu phòng riêng 15',
				en: 'Private discount after first hour',
			},	
			codeType: 3,
			services: ['small group private'],
			priority: 1,
			redeemData: {
				total: {
					value: 120000,
					formula: 1
				}
			},
			createdAt: new Date ('2017-05-07')
			start: new Date ('2017-05-07'),
			end: new Date ('2017-06-30')		
		},{
			name: "MEDIUMPRIVATEDISCOUNTPRICE",
			desc: {type: 'Discount the price for medium private service after the first hour'},
			label: {
				vn: 'Giảm giá sau giờ đầu phòng riêng 30',
				en: 'Private discount after first hour',
			},	
			codeType: 3,
			services: ['medium group private'],
			priority: 1,
			redeemData: {
				total: {
					value: 200000,
					formula: 1
				}
			},
			createdAt: new Date ('2017-05-07')
			start: new Date ('2017-05-07'),
			end: new Date ('2017-06-30')
		},{
			name: "LARGEPRIVATEDISCOUNTPRICE",
			desc: {type: 'Discount the price for large private service after the first hour'},
			label: {
				vn: 'Giảm giá sau giờ đầu phòng riêng 40',
				en: 'Private discount after first hour',
			},	
			codeType: 3,
			services: ['large group private'],
			priority: 1,
			redeemData: {
				total: {
					value: 200000,
					formula: 1
				}
			},
			createdAt: new Date ('2017-05-07'),
			start: new Date ('2017-05-07'),
			end: new Date ('2017-06-30')				
		};	

	]

}