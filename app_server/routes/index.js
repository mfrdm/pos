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
var productsCtrl = require("../controllers/products");

router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/auth/google/callback', 
	passport.authenticate(
		'google', 
		{
			successRedirect : '/',
			failureRedirect : '/login'
		}
	)
);

router.get('/', othersCtrl.readHome);

router.get('/angular/readSomeCusCheckin', checkinCtrl.readSomeCusCheckin);
router.get('/angular/readOneCusCheckin', checkinCtrl.readOneCusCheckin);
router.get('/angular/readOneCusCheckout', checkinCtrl.readOneCusCheckout);
router.get('/angular/readOneCusEdit', checkinCtrl.readOneCusEdit);
router.get('/angular/readMainCheckin', checkinCtrl.readMainCheckin);
router.post('/checkin/:cusId', checkinCtrl.checkin);
router.post('/checkin/:cusId/edit', checkinCtrl.updateCheckin);//cusid is order id

router.get('/checkout/invoice/:orderId', checkoutCtrl.readInvoice);
router.post('/checkout/', checkoutCtrl.checkout);

router.get('/bookings', bookingCtrl.readBooking);
router.post('/bookings/:cusId', bookingCtrl.booking);
router.post('/bookings/:cusId/edit', bookingCtrl.updateBooking);

router.get('/hr', hrCtrl.readOverview);
router.get('/search/hr', hrCtrl.searchHr);
router.get('/hr/employees/employee/:uId', hrCtrl.readOneUser);
router.post('/hr/employees/employee/:uId/edit', hrCtrl.editOneUser);

router.get('/bi', biCtrl.readReport);

router.get('/assets', assetsCtrl.readSomeAsset);
router.get('/assets/asset/:assetId', assetsCtrl.readOneAssetById);
router.post('/assets/create', assetsCtrl.createOneAsset);
router.post('/assets/asset/:assetid/edit', assetsCtrl.updateOneAsset);

router.get('/customer-management', customersCtrl.readOverview);
router.get('/customers', customersCtrl.readSomeCustomers);
router.get('/customers/customer/:cusId', customersCtrl.readOneCustomerById);
router.post('/customers/create', customersCtrl.createOneCustomer);
router.post('/customers/customer/:cusId/edit', customersCtrl.updateOneCustomer);
router.get('/readCreateCustomer', customersCtrl.readCreateCustomer);

router.get('/fin/costs', finCtrl.readSomeCosts);
router.post('/fin/costs/create', finCtrl.createOneCost);
router.get('/fin/costs/cost/:costId', finCtrl.readOneCostById);
router.post('/fin/costs/cost/:costId/edit', finCtrl.updateOneCost);

router.get('/company', companiesCtrl.readOneCompById);
router.get('/company/depts', deptsCtrl.readSomeDepts);
router.get('/company/depts/dept/:deptId', deptsCtrl.readOneDeptById);
router.post('/company/depts/create', deptsCtrl.createOneDept);
router.post('/company/depts/dept/:deptId/edit', deptsCtrl.updateOneDept);

router.get('/products', productsCtrl.readSomeProducts);
router.post('/products/create', productsCtrl.createOneProduct);
router.get('/products/product/:productId', productsCtrl.readOneProductById);
router.post('/products/product/:productId/edit', productsCtrl.updateOneProduct);

// function isLoggedIn(req, res, next) {
// 	// if user is authenticated in the session, carry on
// 	if (req.isAuthenticated())
// 		return next();
// 	// if they aren't redirect them to the home page
// 	res.redirect('/');
// }
module.exports = router;