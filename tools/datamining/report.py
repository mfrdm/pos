import pandas as pd
import numpy as np

from sys import argv
import argparse

from pymongo import MongoClient
from dateutil.parser import parse
import datetime

import source.finance as finReport
import libs.db as dbpackage

class Report:
	def __init__ (self): pass

	def get_transactions (self, targetDate=None):
		if targetDate is None:
			targetDate = datetime.datetime.today ().strftime ('%Y-%m-%d')

		db = dbpackage.MGWrapper ({'db': 'pos'})
		occ = db.find_on_date ('occupancies', targetDate, 'checkinTime')

		occ = [o for o in occ]
		occdf = pd.DataFrame (occ)

		orders = db.find_on_date ('orders', targetDate)
		orders = [o for o in orders]
		orderdf = pd.DataFrame (orders)

		deposits = db.find_on_date ('deposits', targetDate)
		deposits = [d for d in deposits]
		ddf = pd.DataFrame(deposits)

		def formatNumber (s):
			return s.map (lambda x: '{:,}'.format (x))

		trans = finReport.Transactions (occdf, orderdf, ddf)

		print ('///////////////////////////// Report on {}'.format (targetDate))
		print ('/////////////////////////////')
		print ('Transactions by shifts')
		print (trans.get_total_trans_by_daily_shift (targetDate).apply (formatNumber))
		print ('/////////////////////////////')
		print ('Transactions')

	def get_new_customer_number (self, targetDate):
		print ('get new customer number')

	def get_costs (self, targetDate):
		print ('get costs')	

if __name__ == '__main__':
	parser = argparse.ArgumentParser(description='Report Greenspace activities')
	parser.add_argument ('-t', '--trans', help='Display transaction in a given day')
	parser.add_argument ('-ncn', '--newcustomernumber', help='Display new customer number in a given day')
	parser.add_argument ('-c', '--costs', help='Display costs in a given day')
	args = parser.parse_args ()

	report = Report ()

	if (args.trans is not None):
		report.get_transactions (args.trans)
	elif (args.newcustomernumber is not None):
		report.get_new_customer_number (args.newcustomernumber)
	elif (args.costs is not None):
		report.get_costs (args.costs)


