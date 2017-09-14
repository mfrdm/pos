from datetime import datetime
from pymongo import MongoClient

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

import source.occupancies as occreport

# Transactions

class Transactions:
	def __init__ (self, occdf=pd.DataFrame (), orderdf=pd.DataFrame (), ddf=pd.DataFrame ()):
		self.occdf = occdf
		self.orderdf = orderdf
		self.ddf = ddf
		self.filter = Filter ()
		self.preprocess ()

	def preprocess (self):
		self.remove_ongoing_service ()
		self.change_time_zone ()

	def remove_ongoing_service (self):
		hasPaid = self.occdf['status'] == 2
		self.occdf = self.occdf [hasPaid]

	def change_time_zone (self):
		if len (self.occdf):
			self.occdf['createdAt'] = self.occdf['createdAt'] + pd.DateOffset (hours=7)
			self.occdf['checkinTime'] = self.occdf['checkinTime'] + pd.DateOffset (hours=7)
			self.occdf['checkoutTime'] = self.occdf['checkoutTime'] + pd.DateOffset (hours=7)
		if len (self.orderdf):
			self.orderdf['createdAt'] = self.orderdf['createdAt'] + pd.DateOffset (hours=7)
		if len (self.ddf):
			self.ddf['createdAt'] = self.ddf['createdAt'] + pd.DateOffset (hours=7)					

	def get_total_trans_by_month (self, occdf=None, orderdf=None, ddf=None):
	    occTrans = self.get_service_paid_by_month (occdf)
	    depTrans = self.get_deposit_revenue_by_month (ddf)
	    orderTrans = self.get_order_revenue_by_month (orderdf)
	    
	    resetOrderTrans = orderTrans.reset_index ()
	    resetOrderTrans.columns = ['Month', 'Total']
	    resetOrderTrans['Source'] = ['Order' for i in range (len (resetOrderTrans))]

	    resetDepTrans = depTrans.reset_index ()
	    resetDepTrans.columns = ['Month', 'Total']
	    resetDepTrans['Source'] = ['Deposit' for i in range (len (resetDepTrans))]

	    resetOccTrans = occTrans.reset_index ()
	    resetOccTrans.columns = ['Month', 'Total']
	    resetOccTrans['Source'] = ['Occupancies' for i in range (len (resetOccTrans))]  

	    rev = pd.concat ([resetOccTrans, resetDepTrans, resetOrderTrans])
	    return rev.pivot_table (['Total'], index='Source', columns='Month', margins=True, aggfunc='sum').apply (lambda x: x.map ('{:,}'.format))
	    
	def get_total_trans_by_day (self, occdf=None, orderdf=None, ddf=None):
	    occTrans = get_service_paid_by_day (occdf)
	    depTrans = get_deposit_revenue_by_day (ddf)
	    orderTrans = get_order_revenue_by_day (orderdf)
	    
	    resetOrderTrans = orderTrans.reset_index ()
	    resetOrderTrans.columns = ['Date', 'Total']
	    resetOrderTrans['Source'] = ['Order' for i in range (len (resetOrderTrans))]

	    resetDepTrans = depTrans.reset_index ()
	    resetDepTrans.columns = ['Date', 'Total']
	    resetDepTrans['Source'] = ['Deposit' for i in range (len (resetDepTrans))]

	    resetOccTrans = occTrans.reset_index ()
	    resetOccTrans.columns = ['Date', 'Total']
	    resetOccTrans['Source'] = ['Occupancies' for i in range (len (resetOccTrans))]  

	    rev = pd.concat ([resetOccTrans, resetDepTrans, resetOrderTrans])
	    return rev.pivot_table (['Total'], columns='Source', index='Date', margins=True, aggfunc='sum').apply (lambda x: x.map ('{:,}'.format))
	    
	def get_total_trans_by_daily_shift (self, targetDate=datetime.today().strftime("%Y-%m-%d")):
		targetOcc = self.filter.get_service_in_a_day (self.occdf, targetDate)
		targetOrder = self.filter.get_order_in_a_day (self.orderdf, targetDate)
		targetDep = self.filter.get_deposit_in_a_day (self.ddf, targetDate)

		occTrans = self.get_service_paid_by_shift_in_day (targetOcc)
		depTrans =  self.get_deposit_revenue_by_shift_in_day (targetDep)
		orderTrans = self.get_order_revenue_by_shift_in_day (targetOrder)

		occTrans.name = 'total'

		occTrans = pd.DataFrame (occTrans)
		occTrans['Source'] = ['Service'] * len (occTrans)

		depTrans = pd.DataFrame (depTrans)
		depTrans['Source'] = ['Deposit'] * len (depTrans)

		orderTrans = pd.DataFrame (orderTrans)
		orderTrans['Source'] = ['Order'] * len (orderTrans)

		concatList = [occTrans, orderTrans, depTrans]

		concatList = [df for df in concatList if len (df) > 0]

		cc = pd.concat (concatList).reset_index ()
		cc.columns = ['Shift', 'Total', 'Source']
		return cc.pivot_table ('Total', index='Shift', columns='Source', aggfunc='sum', margins=True)

	def get_total_revenue_by_daily_shift (self, targetDate=datetime.today().strftime("%Y-%m-%d")):
		targetOcc = self.filter.get_service_in_a_day (self.occdf, targetDate)
		targetOrder = self.filter.get_order_in_a_day (self.orderdf, targetDate)
		targetDep = self.filter.get_deposit_in_a_day (self.ddf, targetDate)

		occTrans = self.get_service_revenue_by_shift_in_day (targetOcc)
		depTrans =  self.get_deposit_revenue_by_shift_in_day (targetDep)
		orderTrans = self.get_order_revenue_by_shift_in_day (targetOrder)

		occTrans = pd.DataFrame (occTrans)
		occTrans['Source'] = ['Service'] * len (occTrans)

		depTrans = pd.DataFrame (depTrans)
		depTrans['Source'] = ['Deposit'] * len (depTrans)

		orderTrans = pd.DataFrame (orderTrans)
		orderTrans['Source'] = ['Order'] * len (orderTrans)

		concatList = [occTrans, orderTrans, depTrans]

		concatList = [df for df in concatList if len (df) > 0]

		cc = pd.concat (concatList).reset_index ()
		cc.columns = ['Shift', 'Total', 'Source']
		return cc.pivot_table ('Total', index='Shift', columns='Source', aggfunc='sum', margins=True)
	    
	####### Service    
	def get_service_paid_by_month (self, df=None):
		if df is None:
			return False

		occmonths = df['checkinTime'].map (lambda x: datetime.strftime(x, "%Y-%m"))
		return df.groupby (occmonths)['paid'].sum ()

	def get_service_paid_by_day (self, df):
	    oocdays = df.checkinTime.map (lambda x: datetime.strftime(x, "%Y-%m-%d"))
	    return df.groupby (oocdays)['paid'].sum ()

	def get_service_revenue_by_month (self, df):
	    occmonths = df.checkinTime.map (lambda x: datetime.strftime(x, "%Y-%m"))
	    return df.groupby (occmonths)['total'].sum ()

	def get_service_revenue_by_day (self, df):
	    oocdays = df.checkinTime.map (lambda x: datetime.strftime(x, "%Y-%m-%d"))
	    return df.groupby (oocdays)['total'].sum ()	    

	def get_service_paid_by_shift_in_day (self, df):
	    middleHours = [12, 18]
	    hours = df['checkoutTime'].dt.hour
	    shifts = hours.map (lambda x: 'Shift 1' if (x < middleHours[0]) else ('Shift 2' if x >= middleHours[0] and x < middleHours[1] else 'Shift 3'))
	    grouped = df.groupby (shifts)
	    return grouped['paid'].sum ()

	def get_service_revenue_by_shift_in_day (self, df):
	    middleHours = [12, 18]
	    hours = df['checkoutTime'].dt.hour
	    shifts = hours.map (lambda x: 'Shift 1' if (x < middleHours[0]) else ('Shift 2' if x >= middleHours[0] and x < middleHours[1] else 'Shift 3'))
	    grouped = df.groupby (shifts)
	    return grouped['total'].sum ()	    
	    
	def get_service_paid_by_month_and_service (self, df):
	    serviceName = df['service'].map (lambda x: x['name'])
	    months = df['checkinTime'].map (lambda x: datetime.strftime(x, "%Y-%m"))
	    grouped = df.groupby ([serviceName, months])
	    return grouped['paid'].sum ().unstack ()

	def get_service_paid_by_month_and_service2 (self, df):
	    serviceName = df['service'].map (lambda x: x['name'])
	    months = df['checkinTime'].map (lambda x: datetime.strftime(x, "%Y-%m"))
	    df['months'] = months
	    df['serviceName'] = serviceName
	    return df.pivot_table ('paid', index='months', columns='serviceName', margins=True, aggfunc='sum')
	    
	def get_service_paid_by_day_and_service (self, df):
	    serviceName = df['service'].map (lambda x: x['name'])
	    days = df['checkinTime'].map (lambda x: datetime.strftime(x, "%Y-%m-%d"))
	    grouped = df.groupby ([serviceName, days])
	    return grouped['paid'].sum ().unstack ()

	####### Order
	def get_order_revenue_by_month (self, df=None):
	    ordermonths = df.createdAt.map (lambda x: datetime.strftime(x, "%Y-%m"))
	    return df.groupby (ordermonths)['total'].sum ()  

	def get_order_revenue_by_day (self, df):
	    orderdays = df.createdAt.map (lambda x: datetime.strftime(x, "%Y-%m-%d"))
	    return df.groupby (orderdays)['total'].sum () 

	def get_order_revenue_by_shift_in_day (self, df):
		if df.empty:
			return df

		middleHours = [12, 18]
		hours = df['createdAt'].dt.hour
		shifts = hours.map (lambda x: 'Shift 1' if (x < middleHours[0]) else ('Shift 2' if x >= middleHours[0] and x < middleHours[1] else 'Shift 3'))
		grouped = df.groupby (shifts)
		return grouped['total'].sum ()

	###### Deposit
	def get_deposit_revenue_by_month (self, df):
	    depositmonths = df.createdAt.map (lambda x: datetime.strftime(x, "%Y-%m"))
	    return df.groupby (depositmonths)['total'].sum ()

	def get_deposit_revenue_by_day (self, df):
	    depositdays = df.createdAt.map (lambda x: datetime.strftime(x, "%Y-%m-%d"))
	    return df.groupby (depositdays)['total'].sum ()    

	def get_deposit_revenue_by_shift_in_day (self, df):
		if not len (df):
			return df

		middleHours = [12, 18]
		hours = df['createdAt'].dt.hour
		shifts = hours.map (lambda x: 'Shift 1' if (x < middleHours[0]) else ('Shift 2' if x >= middleHours[0] and x < middleHours[1] else 'Shift 3'))
		grouped = df.groupby (shifts)
		return grouped['total'].sum ()		


class Filter:
	def __init__ (self):
		self.occfilter = occreport.OccFilter ()

	def get_service_in_a_day (self, df, target_date=datetime.today().strftime("%Y-%m-%d")):
		return self.occfilter.get_by_date (df, target_date)

	def get_service_in_a_month (self, df, target_month=datetime.today().strftime("%Y-%m")):return self.occfilter.get_by_month (df, target_month)

	def get_order_in_a_day (self, df, targetDate=datetime.today().strftime("%Y-%m-%d")):
		if len (df):
			return df[(df['createdAt'] >= targetDate) & (df['createdAt'] < targetDate + ' 23:59:00')]
		else:
			return pd.DataFrame ()	

	def get_deposit_in_a_day (self, df, targetDate=datetime.today().strftime("%Y-%m-%d")):
		if len (df):
			return df[(df['createdAt'] >= targetDate) & (df['createdAt'] < targetDate + ' 23:59:00')]
		else:
			return pd.DataFrame ()