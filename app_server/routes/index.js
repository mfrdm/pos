var express = require("express");
var router = express.Router();
var passport = require('passport');
var checkinCtrl = require("../controllers/checkin");
var checkoutCtrl = require("../controllers/checkout");
var bookingCtrl = require("../controllers/booking");
var hrCtrl = require("../controllers/hr");
var biCtrl = require("../controllers/bi");
var assetsCtrl = require("../controllers/assets");
var customersCtrl = require("../controllers/customers");
var finCtrl = require("../controllers/fin");
var companiesCtrl = require("../controllers/companies");
var othersCtrl = require("../controllers/others");
var deptsCtrl = require("../controllers/depts");


router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect : '/',
		failureRedirect : '/login'
	}));
router.get('/', othersCtrl.readHome);
router.get('/auth/google', passport.authenticate);
router.get('/auth/google/callback', passport.authenticate);

router.get('/checkin', checkinCtrl.readCheckin);
router.post('/checkin/:cusid', checkinCtrl.checkin);
router.post('/checkin/:cusid/edit', checkinCtrl.updateCheckin);
router.get('/checkout/invoice', checkoutCtrl.readInvoice);
router.post('/checkout/', checkoutCtrl.checkout);
router.get('/booking', bookingCtrl.readBooking);
router.post('/booking/:cusid', bookingCtrl.booking);
router.post('/booking/:cusid/edit', bookingCtrl.updateBooking);
router.get('/hr', hrCtrl.readOverview);

router.get('/search/hr', hrCtrl.searchHr);
router.get('/hr/employees/employee/:uid', hrCtrl.readOneUser);
router.get('/bi', biCtrl.readReport);
router.get('/assets', assetsCtrl.readSomeAsset);
router.get('/assets/asset/:assetid', assetsCtrl.readOneAssetById);
router.post('/assets/create', assetsCtrl.createOneAsset);
router.post('/assets/asset/:assetid/edit', assetsCtrl.updateOneAsset);
router.get('/customer-management', customersCtrl.readOverview);
router.get('/search/customer', customersCtrl.readSomeCustomers);
router.get('/customers/customer/:cusid', customersCtrl.readOneCustomerById);
router.post('/customers/create', customersCtrl.createOneCustomer);
router.post('/customers/customer/:cusid/edit', customersCtrl.updateOneCustomer);
router.get('/fin/costs', finCtrl.readSomeCosts);
router.post('/fin/cost/create', finCtrl.createOneCost);
router.get('/fin/costs/cost/:costid', finCtrl.readOneCostById);
router.post('/find/costs/cost/:costid/edit', finCtrl.updateOneCost);
router.get('/company', companiesCtrl.readOneCompById);
router.get('/company/depts', deptsCtrl.readSomeDepts);
router.post('/company/depts/dept/:deptid', deptsCtrl.readOneDeptById);

module.exports = router;