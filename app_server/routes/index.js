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

router.get('/', othersCtrl.angularApp);

// Checkin
router.get('/angular/checkin', checkinCtrl.readAngularCheckin);
router.post('/checkin/:cusId', checkinCtrl.checkin);
router.post('/checkin/:cusId/edit', checkinCtrl.updateCheckin);//cusid is order id

router.get('/checkout/invoice/:orderId', checkoutCtrl.readInvoice);
router.post('/checkout/', checkoutCtrl.checkout);

router.get('/bookings', bookingCtrl.readBooking);
router.post('/bookings/:cusId', bookingCtrl.booking);
router.post('/bookings/:cusId/edit', bookingCtrl.updateBooking);

router.get('/hr', hrCtrl.readOverview);
router.get('/hr/employees/employee/:uId', hrCtrl.readOneUser);
router.post('/hr/employees/employee/:uId/edit', hrCtrl.editOneUser);
router.get('/angular/employees/search', hrCtrl.readSearchEmployee);
router.get('/angular/employees/create', hrCtrl.readCreateEmployee);
router.get('/angular/employees/edit', hrCtrl.readEditEmployee);
router.get('/angular/employees/profile', hrCtrl.readProfileEmployee);

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
router.get('/angular/readCreateCustomer', customersCtrl.readCreateCustomer);
router.get('/angular/readCustomers', customersCtrl.readCustomers);
router.get('/angular/readProfileCustomer', customersCtrl.readProfileCustomer);
router.get('/angular/readEditCustomer', customersCtrl.readEditCustomer);

router.get('/fin/costs', finCtrl.readSomeCosts);
router.post('/fin/costs/create', finCtrl.createOneCost);
router.get('/fin/costs/cost/:costId', finCtrl.readOneCostById);
router.post('/fin/costs/cost/:costId/edit', finCtrl.updateOneCost);

router.get('/company', companiesCtrl.readOneCompById);
router.get('/company/depts', deptsCtrl.readSomeDepts);
router.get('/company/depts/dept/:deptId', deptsCtrl.readOneDeptById);
router.post('/company/depts/create', deptsCtrl.createOneDept);
router.post('/company/depts/dept/:deptId/edit', deptsCtrl.updateOneDept);
router.get('/angular/depts/all', deptsCtrl.readAllDepts);
router.get('/angular/depts/create', deptsCtrl.readCreateDept);
router.get('/angular/depts/edit', deptsCtrl.readEditDept);
router.get('/angular/depts/profile', deptsCtrl.readProfileDept);

router.get('/products', productsCtrl.readSomeProducts);
router.post('/products/create', productsCtrl.createOneProduct);
router.get('/products/product/:productId', productsCtrl.readOneProductById);
router.post('/products/product/:productId/edit', productsCtrl.updateOneProduct);
router.get('/angular/products/search', productsCtrl.readSearchProduct);
router.get('/angular/products/create', productsCtrl.readCreateProduct);
router.get('/angular/products/edit', productsCtrl.readEditProduct);
router.get('/angular/products/profile', productsCtrl.readProfileProduct);

router.get('/angular/attendance', othersCtrl.readAttendance);

// Others
router.get ('/components/template/message', othersCtrl.getMessageTemplate);
router.get ('/components/template/asset', othersCtrl.getAssetTemplate);

// function isLoggedIn(req, res, next) {
// 	// if user is authenticated in the session, carry on
// 	if (req.isAuthenticated())
// 		return next();
// 	// if they aren't redirect them to the home page
// 	res.redirect('/');
// }
module.exports = router;