from datetime import datetime
from pymongo import MongoClient

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from pandas.tseries.offsets import MonthEnd

class OccFilter:
    def __init__ (self, df=pd.DataFrame ()):
        self.df = df
        self.ultil = OccUtil ()
        self.preprocess ()

    def preprocess (self):
        if len (self.df):
            self.df['createdAt'] = self.df['createdAt'] + pd.DateOffset (hours=7)
            self.df['checkinTime'] = self.df['checkinTime'] + pd.DateOffset (hours=7)
            self.df['checkoutTime'] = self.df['checkoutTime'] + pd.DateOffset (hours=7)
                 
    def get_common (self, df=pd.DataFrame ()):
        df = self.df if df.empty else df
        serviceName = df.service.map (lambda x: x['name'])
        pattern = r'common'
        common = df[serviceName.str.contains (pattern)] 
        return common
    
    def get_private (self):
        serviceName = self.df.service.map (lambda x: x['name'])
        pattern = r'private'
        private = self.df[serviceName.str.contains (pattern)] 
        return private
    
    def get_leader_private (self):
        serviceName = self.df.service.map (lambda x: x['name'])
        privateNamePattern = r'private'
        privateOcc = self.df[serviceName.str.contains (privateNamePattern) & self.df.parent.isnull ()] 
        return privateOcc   

    def get_free_common (self, df=pd.DataFrame ()):
        df = self.df if df.empty else df
        common = self.get_common (df)
        hasFree = common['promocodes'].map (lambda x: self.ultil.check_free_code (x))
        return common [hasFree]            

    def get_no_free_common (self, df=pd.DataFrame ()):
        df = self.df if df.empty else df
        common = self.get_common (df)
        hasFree = common['promocodes'].map (lambda x: self.ultil.check_free_code (x))
        return common [~hasFree]

    def get_combo_common (self):
        no_free_common = self.get_no_free_common ()
        hasCommbo = no_free_common['paymentMethod'].map (lambda x: True if len (x) else False)
        no_free_and_has_combo_common = no_free_common [hasCommbo]
        return no_free_common [hasCommbo]

    def get_plain_common (self):
        no_free_common = self.get_no_free_common ()
        hasCommbo = no_free_common['paymentMethod'].map (lambda x: True if len (x) else False)
        no_free_and_has_combo_common = no_free_common [hasCommbo]
        return no_free_common [~hasCommbo]     

    def get_by_month (self, df, target_month=datetime.today().strftime("%Y-%m")):
        grouped = self.groupby_month (df)
        return grouped.get_group (target_month)

    def get_by_date (self, df, target_date=datetime.today().strftime("%Y-%m-%d")):
        grouped = self.groupby_date (df)
        return grouped.get_group (target_date)    

    def groupby_codes (self, df):
        codes = df['promocodes'].map (lambda x: self.get_free_code_list (x)[0])
        return df.groupby (codes).size () 

    def groupby_month (self, df):
        months = df['checkinTime'].map (lambda x: datetime.strftime (x, '%Y-%m'))
        return df.groupby (months)

    def groupby_date (self, df):
        dates = df['checkinTime'].map (lambda x: datetime.strftime (x, '%Y-%m-%d'))
        return df.groupby (dates)                               

class OccUtil:
    def __ini__ (self): pass

    def check_free_code (self, codes):
        codeList = [c['name'] for c in codes]
        for c in codeList:
            if 'FREE' in c:
                return True
        return False    

    def get_free_codes (self, df):
        def _get_free_code_list (codes):
            return [c['name'] for c in codes if 'FREE' in c['name']] 
        codes = df['promocodes'].map (lambda x: _get_free_code_list (x)[0])
        return codes


class OccAna:
    def __init__ (self, occ):
        self.sf = OccFilter (occ)
        self.occ = self.sf.df
        
    # count number of common usage by whether customers are new or current ones 
    def count_common_by_isnew (self, cus):
        common = self.sf.get_common ()
        cusId = common['customer'].map (lambda x: x['_id'])
        merged = common.merge (cus[['_id', 'fullname']], left_on=cusId, right_on='_id', how='left', suffixes=['', '_cus'])
        isNew = ~ merged['fullname'].isnull ()
        count = merged.groupby (isNew)['_id'].count ()
        count.index.name = 'Status'
        count.rename ({True: 'New', False: 'Current'}, inplace=True)
        return count

    def get_usage_number_by_customer (self, targetOcc):
        cusId = self.occ['customer'].map (lambda x: x['_id'])
        targetCusId = targetOcc['customer'].map (lambda x: x['_id']).drop_duplicates ()
        counts = cusId[cusId.isin (targetCusId)].value_counts ()
        return counts


class CodeAna:
    def __init__ (self): pass

    def get_free_code_list (self, codes):
        return [c['name'] for c in codes if 'FREE' in c['name']]    

    def get_free_code_count (self, df):
        codes = df['promocodes'].map (lambda x: self.get_free_code_list (x)[0])
        return df.groupby (codes).size ()        