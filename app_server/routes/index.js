var express = require("express");
var router = express.Router();
var passport = require('passport');
var jwt = require ('express-jwt');

var auth = jwt ({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload', // NOTICE
});

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
var promoCodesCtrl = require ('../controllers/promoCodes.ctrl')
var combosCtrl = require ('../controllers/combos.ctrl');

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

// router.get('/', auth, othersCtrl.angularApp); // TEST local authen
router.get('/', othersCtrl.angularApp);

// Checkin
router.get('/angular/checkin', checkinCtrl.readAngularCheckin);
// router.get('/angular/checkin-list', checkinCtrl.readCheckinList);
router.get('/checkin', checkinCtrl.readCheckinList);
router.post ('/checkin/cancel', checkinCtrl.cancelCheckin);

router.post('/checkin/customer/:cusId', checkinCtrl.checkin);
router.get ('/checkin/search-customers', checkinCtrl.searchCheckingCustomers);
router.post('/checkin/customer/:cusId/edit/:orderId', checkinCtrl.updateCheckin); //cusid is order id
router.get ('/checkin/validate-promotion-code', checkinCtrl.validatePromocodes);

router.get('/checkout/invoice/:orderId', checkoutCtrl.createInvoice);
router.post('/checkout', checkoutCtrl.confirmCheckout);

router.get('/bookings', bookingCtrl.readBooking);
router.post('/bookings/:cusId', bookingCtrl.booking);
router.post('/bookings/:cusId/edit', bookingCtrl.updateBooking);
router.get('/angular/bookings', bookingCtrl.readAngularBooking)

router.get('/hr', hrCtrl.readOverview);
router.get('/hr/employees/employee/:uId', hrCtrl.readOneUser);
router.post('/hr/employees/employee/:uId/edit', hrCtrl.editOneUser);
router.get('/angular/employees', hrCtrl.readAngularEmployees);

// router.get('/angular/combo', combosCtrl.readAngularCombo);
// router.post ('/combos/buy', combosCtrl.buy)

// router.get('/bi', biCtrl.readReport);

// router.get('/assets', auth, assetsCtrl.readSomeAsset); // TEST local authen
router.get('/assets', assetsCtrl.readSomeAsset);
router.get('/assets/asset/:assetId', assetsCtrl.readOneAssetById);
router.post('/assets/create', assetsCtrl.createOneAsset);
router.post('/assets/asset/:assetid/edit', assetsCtrl.updateOneAsset);
router.get('/angular/assets', assetsCtrl.readAngularAsset);

router.get('/customer-management', customersCtrl.readOverview);
router.get('/customers', customersCtrl.readSomeCustomers);
router.get('/customers/customer/:cusId', customersCtrl.readOneCustomerById);
router.post('/customers/create', customersCtrl.createOneCustomer);
router.post('/customers/customer/:cusId/edit', customersCtrl.updateOneCustomer);
router.get('/angular/customers', customersCtrl.readAngularCustomers);

router.get('/fin/costs', finCtrl.readSomeCosts);
router.post('/fin/costs/create', finCtrl.createOneCost);
router.get('/fin/costs/cost/:costId', finCtrl.readOneCostById);
router.post('/fin/costs/cost/:costId/edit', finCtrl.updateOneCost);

router.get('/company', companiesCtrl.readOneCompById);
router.get('/company/depts', deptsCtrl.readSomeDepts);
router.get('/company/depts/dept/:deptId', deptsCtrl.readOneDeptById);
router.post('/company/depts/create', deptsCtrl.createOneDept);
router.post('/company/depts/dept/:deptId/edit', deptsCtrl.updateOneDept);
router.get('/angular/depts', deptsCtrl.readAngularDepts);

router.get('/products', productsCtrl.readSomeProducts);
router.post('/products/create', productsCtrl.createOneProduct);
router.get('/products/product/:productId', productsCtrl.readOneProductById);
router.post('/products/product/:productId/edit', productsCtrl.updateOneProduct);
router.get('/angular/products', productsCtrl.readAngularProducts);

router.get('/angular/attendances', othersCtrl.readAngularAttendance);

router.get ('/promo-codes', promoCodesCtrl.readSomeCodes);
router.get ('/promo-codes/code/:codeId', promoCodesCtrl.readOneCodeById);
router.post ('/promo-codes/create', promoCodesCtrl.createOneCode);
router.post ('/promo-codes/code/:codeId', promoCodesCtrl.updateOneCode);

// router.post ('/combos/customer/:customerId', combosCtrl.purchaseCombos);

// Others
router.get ('/components/template/message', othersCtrl.getMessageTemplate);
router.get ('/components/template/asset', othersCtrl.getAssetTemplate);

//Login page
router.get('/login', othersCtrl.login);
router.get('/register', othersCtrl.register);

// function isLoggedIn(req, res, next) {
// 	// if user is authenticated in the session, carry on
// 	if (req.isAuthenticated())
// 		return next();
// 	// if they aren't redirect them to the home page
// 	res.redirect('/');
// }
module.exports = router;