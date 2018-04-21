'''

'''

import argparse
import datetime

from bson.objectid import ObjectId
import pymongo
import requests

HOST = 'http://localhost:3000'

def query():
	print('Query a code')

def expire():
    print('Expire a code.')


def create():
    # code to give free x hours.

    private_create_url = '{}/api/promocodes/create-private'.format(HOST)
    common_create_url = '{}/api/promocodes/create-common'.format(HOST)

    print('''Listing of codes:
    1. Code to give discount within a period of time. After, apply normal price.
    2. Code to charge with a fix amount.
    3. Code to give free x hours.
    4. Code to charge with a new price.
    ''')
    codeindex = input('Enter index of code being created: ')

    start_date = input('Start at (YYYY-MM-DD): ')
    end_date = input('End at (YYYY-MM-DD): ')
    codename = input('Name of code: ')
    service_type = input('Service type, c(ommon) or p(rivate): ')
    if service_type == 'c':
        url = common_create_url
        service = None
    elif service_type == 'p':
        url = private_create_url
        service = input('Service, s(mall)/m(edium)/l(arge): ')

    if not start_date:
    	print('No start date provided. Today is selected.')
    	start_date = datetime.datetime.now ().replace(hour=0, minute=0, second=0)
    if not end_date:
    	print('No end date provided. Three month from today is selected.')
    	end_date = datetime.datetime.now () + datetime.timedelta(3*30)
    if not codename:
    	raise Exception('No code name provided.')
    if not service_type or (service_type == 'p' and not service):
    	raise Exception('No service type or service provided.')
    
    payload = {
       'start': start_date, 'end': end_date, 
        'codename': codename, 'service': service,
        'code': codeindex
    }

    if codeindex == '1':
        max_usage = int(input('Maximum usage in minute: '))
        max_usage = max_usage / 60
        min_total = input('Minimum total: ')
        payload['maxUsage'] = max_usage
        payload['minTotal'] = min_total
    elif codeindex == '2':
        pass
    elif codeindex == '3':
        free_usage = int(input('Free usage in hour: '))
        payload['freeUsage'] = free_usage
    elif codeindex == '4':
    	special_price = int(input('Special price: '))
    	payload['specialPrice'] = special_price
    else:
    	raise Exception('Not valid selection.')

    r = requests.get(url, params=payload)
    if r.status_code == 200:
    	print('Complete create code')
    else:
    	msg = 'Something broken. Code is not created.'
    	raise Exception(msg)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument('-c', '--create', help="Create a new promocode.", action='store_true')
    group.add_argument('-e', '--expire', help="Expire an account.", action='store_true')
    group.add_argument('-q', '--query', help="Query promocode given its name.", action='store_true')
    args = parser.parse_args()
    
    if args.create:
    	create()
    elif args.expire:
    	expire()
    elif args.query:
    	query()
    else:
    	print('Call command with option -h to get help.')
    