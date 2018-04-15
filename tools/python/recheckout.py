'''
Checkout again an occupancy with new data about any of checkintime, checkouttime, 
    codes, and payment method 
'''
import argparse
import datetime

from bson.objectid import ObjectId
import pymongo
import requests

SERVER_URL = 'localhost'


def handle_date_params(start_date, end_date):
    if not start_date:
	    start_date = datetime.datetime.today().replace(hour=0, minute=0)
    else:
	    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')

    if not end_date:
	    end_date = datetime.datetime.today()
    else:
	    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')
    return start_date, end_date


def handle_customername_params(customername):
    if not customername:
        raise Exception('Must provide customer name.')
    return customername	


def handle_mode(mode):
    if mode:
        mode = list(mode)
        for m in mode:
            if m not in '12345':
                msg = 'mode {} does not exist.'.format(m)
                raise Exception(msg)
    else:
        mode = '4'
    return mode


def find_occ(db, customername, start_date, end_date):
    condition = {'customer.fullname': {'$regex': customername, '$options': 'i'},
        'createdAt': {'$gte': start_date, '$lte': end_date}}
    cursor = db.occupancies.find(condition)
    foundOcc = [o for o in cursor]
    num = len(foundOcc)
    if num == 0:
        msg = 'Not found occupancies with cusotmer {}, from {} to {}'.format(
            customername, start_date, end_date)
        raise Exception(msg)
    elif num > 1:
        for i, occ in enumerate (foundOcc):
            print('{}.'.format(i), occ)
            print('------------------')
        occi = int(input('Pick one occ by index: '))
        if not occi:
            raise Exception('No index being specified.')
        foundOcc = foundOcc[occi]
    return foundOcc


def undo_checkout(db, occ):
    reset_checkout(db, occ)
    reset_reward(db, occ)
    reset_account(db, occ)


def reset_checkout(db, occ):
    '''
    Reset status as 1. Unset paid, total, usage, origusage, paymentmethod.
    Not reset checkin time or checkout time, and thus keep the original usage.
    '''	
    _id = ObjectId(occ['_id'])
    condition = {'_id': _id} 
    update = {'$set': {'status': 1}, '$unset': {'paid': 1, 'total': 1, 
        'usage': 1, 'oriUsage': 1, 'paymentMethod': 1}}
    db.occupancies.update(condition, update)


def reset_account(db, occ):
    '''
    Deposite back the amount being used when checking out.
    Assume only one payment method was used.
    '''
    num = len(occ['paymentMethod'])
    if num > 0:
        print('# List of paymentmethods')
        for i, pm in enumerate(occ['paymentmethod']):
            print('{}.'.format(i), pm)
        pi = 0
        confirm = input('Reset method {}? (y/n)'.format(pi))
        if confirm in ['y', 'Y']:
            acc_id = ObjectId(occ['paymentmethod'][pi]['_id'])
            amount = occ['paymentmethod'][pi]['paidAmount']
            condition = {'_id': acc_id}
            update = {'inc': {'amount': amount}}
            db.accounts.update(condition, update)


def reset_reward(db, occ):
    '''
    Remove reward if being set because of the checkout.
    '''
    customerid = ObjectId(occ['customer']['_id'])
    foundReward = db.rewards.find_one({'customer._id': customerid})
    if not foundReward:
        raise Exception('Each customer must have one reward.')

    sourcenum = len(foundReward['source'])
    if sourcenum > 0:
        print('# Reward history:')
        for i, asource in enumerate(foundReward['source']):
            print('{}.'.format(i), asource)
            si = input('Enter index of source to be removed: ')
            if not si:
                raise Exception('Not index provided. Exit.')
            removedSource = foundReward['source'].pop(si)
            condition = {'_id': ObjectId(foundReward['_id'])}
            update = {'$set': {'source': foundReward['source']}, 
                '$inc': {'amount': -removedSource['amount']}}
            db.rewards.update(condition, update)
    else:
        print('No reward history found.')


def checkout(db, occ):
    '''
    Call api. Set up all data before call.
    '''
    invoiceurl = '{}/{}/{}'.format(SERVER_URL, 'checkout/invoice')
    rewardurl = '{}/{}'.format (SERVER_URL, 'rewards/prepareWithdraw')
    accurl = '{}/{}/{}'.format(SERVER_URL, 'checkout/account/withdraw')
    checkouturl = '{}/{}'.format(SERVER_URL, 'checkout')

    if occ['status'] not in ['1', 1]:
        msg = 'Occupancy has been checkout. Reset it before recheckout.'
        raise Exception(msg)
    occid = occ['_id']
    invoice_result = requests.get(invoiceurl.format (occid))
    invoice = invoice_result.json()
    if not invoice:
        raise Exception('Not found occupancy with such id.')
    occ = invoice['occ']
    acc = invoice['acc']
    reward = invoice['reward']



def set_checkinTime(db, occ):
    d = input('Enter checkin time: ')
    if not d:
        raise Exception('No date time being provided.')
    condition = ObjectId(occ['_id'])
    update = {'$set': {'checkinTime': d}}
    db.occupancies.update(condition, update)


def set_checkoutTime(db, occ):
    d = input('Enter checkout time: ')
    if not d:
        raise Exception('No date time being provided.')
    condition = ObjectId(occ['_id'])
    update = {'$set': {'checkoutTime': d}}
    db.occupancies.update(condition, update)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('customername', help='Name of customer associated with the occupancy')
    parser.add_argument('-m', '--mode', help='''
        Enter the following number (or combination of numbers) to specify a mode.
        1: Add new checkin time.
        2: Add new checkout time.
        3: Add promocode.
        4: Undo checkout. Reset status, unset paid, total, usage, oriusage, 
            payment method. Remove reward if any. Reset account if being used. 
        5: Checkout an occupancy.
    ''')
    parser.add_argument('-s', '--start_date', help='Start date time at which occupancies \
        occurred. Format yyyy-mm-dd')
    parser.add_argument('-e', '--end_date', help='End date time at which occupancies occurred. \
        Format yyyy-mm-dd')
    args = parser.parse_args()

    mode = handle_mode(args.mode)
    start_date, end_date = handle_date_params(args.start_date, args.end_date)
    customername = handle_customername_params(args.customername)

    ####### Processing ######
    dbname = 'pos'
    db = pymongo.MongoClient()[dbname]
    occ = find_occ(db, customername, start_date, end_date)

    if '1' in mode:
        print('Add new checkin time.')
    if '2' in mode:
        print('Add new checkout time.')
    if '3' in mode:
        print('Add a promocode.')	
    if '4' in mode:
        print('Undo checkout.')
        undo_checkout(db, occ)
    if '5' in mode:
        print('Checkout an occupancy. NOT implemented.')
        checkout(db, occ)








