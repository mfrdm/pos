var express = require("express");
var router = express.Router();
var passport = require('passport');
var checkinCtrl = require("../controllers/checkin");
var checkoutCtrl = require("../controllers/checkout");
var bookingCtrl = require("../controllers/bookings");
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

router.get('/checkin', checkinCtrl.readCheckin);
router.post('/checkin/:cusid', checkinCtrl.checkin);
router.post('/checkin/:cusid/edit', checkinCtrl.updateCheckin);//cusid is order id
router.get('/checkout/invoice/:cusid', checkoutCtrl.readInvoice);
router.post('/checkout/', checkoutCtrl.checkout);

router.get('/bookings', bookingCtrl.readBooking);
router.post('/bookings/:cusid', bookingCtrl.booking);
router.post('/bookings/:cusid/edit', bookingCtrl.updateBooking);

router.get('/hr', hrCtrl.readOverview);
router.get('/search/hr', hrCtrl.searchHr);
router.get('/hr/employees/employee/:uid', hrCtrl.readOneUser);
router.post('/hr/employees/employee/:uid/edit', hrCtrl.editOneUser);

router.get('/bi', biCtrl.readReport);

router.get('/assets', assetsCtrl.readSomeAsset);
router.get('/assets/asset/:assetid', assetsCtrl.readOneAssetById);
router.post('/assets/create', assetsCtrl.createOneAsset);
router.post('/assets/asset/:assetid/edit', assetsCtrl.updateOneAsset);

router.get('/customer-management', customersCtrl.readOverview);
router.get('/customers', customersCtrl.readSomeCustomers);
router.get('/customers/customer/:cusid', customersCtrl.readOneCustomerById);
router.post('/customers/create', customersCtrl.createOneCustomer);
router.post('/customers/customer/:cusid/edit', customersCtrl.updateOneCustomer);
router.get('/fin/costs', finCtrl.readSomeCosts);
router.post('/fin/cost/create', finCtrl.createOneCost);
router.get('/fin/costs/cost/:costid', finCtrl.readOneCostById);
router.post('/find/costs/cost/:costid/edit', finCtrl.updateOneCost);

router.get('/company', companiesCtrl.readOneCompById);
router.get('/company/depts', deptsCtrl.readSomeDepts);
router.get('/company/depts/dept/:deptid', deptsCtrl.readOneDeptById);
router.post('/company/depts/create', deptsCtrl.createOneDept);
router.post('/company/depts/dept/:deptid/edit', deptsCtrl.updateOneDept);

// function isLoggedIn(req, res, next) {
// 	// if user is authenticated in the session, carry on
// 	if (req.isAuthenticated())
// 		return next();
// 	// if they aren't redirect them to the home page
// 	res.redirect('/');
// }
module.exports = router;