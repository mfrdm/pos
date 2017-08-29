from pymongo import MongoClient
from datetime import datetime
from dateutil.parser import parse

defaultConfig = {
	'db': 'pos'
}

class MGWrapper:
	def __init__ (self, config=None):
		config = config if config else defaultConfig
		client = MongoClient ()
		self.db = client[config['db']]

	def get_db (self):
		return self.db

	def find_on_date (self, collection, targetDate=datetime.now ().strftime ("%Y-%m-%d"), targetField='createdAt'):
		stmt = {targetField: {'$gte': parse (targetDate), '$lte': parse ('{0} 23:59:00'.format (targetDate))}}
		docs = self.db[collection].find (stmt)
		return docs

