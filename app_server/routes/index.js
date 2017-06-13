var express = require("express");
var router = express.Router();
var passport = require('passport');
var jwt = require ('express-jwt');

var auth = jwt ({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload', // NOTICE
});

var CheckinCtrl = require("../controllers/checkin");
var checkoutCtrl = require("../controllers/checkout");
var BookingCtrl = require("../controllers/booking.ctrl");
var hrCtrl = require("../controllers/hr");
var biCtrl = require("../controllers/bi");
var assetsCtrl = require("../controllers/assets");
var CustomersCtrl = require("../controllers/customers");
// var finCtrl = require("../controllers/fin");
var companiesCtrl = require("../controllers/companies");
var OthersCtrl = require("../controllers/others");
var deptsCtrl = require("../controllers/depts");
var productsCtrl = require("../controllers/products");
var promoCodesCtrl = require ('../controllers/promoCodes.ctrl');
var OrdersCtrl = require ('../controllers/orders.ctrl'); 
var TransactionCtrl = require ('../controllers/transactions.ctrl');
var DepositsCtrl = require ('../controllers/deposits.ctrl');

var StorageCtrl = require ('../controllers/storage.ctrl');

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

// router.get('/', auth, OthersCtrl.angularApp); // TEST local authen
router.get('/', OthersCtrl.angularApp);

//Login page
router.get('/login', OthersCtrl.login);
router.get('/register', OthersCtrl.register);

router.get('/template/newCheckin', OthersCtrl.getNewCheckinTemplate);
router.get('/template/newOrders', OthersCtrl.getNewOrdersTemplate);
router.get('/template/newCustomers', OthersCtrl.getNewCustomersTemplate);
router.get('/template/newBookings', OthersCtrl.getNewBookingTemplate);
router.get('/template/deposit', OthersCtrl.getDepositTemplate);
router.get('/template/storage', OthersCtrl.getStorageTemplate);

// Checkin
router.get('/checkin', CheckinCtrl.readCheckinList);
router.post ('/checkin/cancel', CheckinCtrl.cancelCheckin);
router.post('/checkin/customer/:cusId', CheckinCtrl.checkin);
router.get ('/checkin/search-customers', CheckinCtrl.searchCheckingCustomers);
router.post('/checkin/customer/edit/:occId', CheckinCtrl.updateCheckin);
router.get ('/checkin/validate-promotion-code', CheckinCtrl.validatePromocodes);

router.get('/checkout/invoice/:occId', checkoutCtrl.createInvoice);
router.post('/checkout', checkoutCtrl.confirmCheckout);
router.get('/checkout/account/withdraw/:accId', checkoutCtrl.withdrawUsageHourAccount);

router.get ('/occupancies/', CheckinCtrl.readOccupancies);
// router.get ('/occupancies/occupancy/:occId', CheckinCtrl.readOneOccupancy);

router.get ('/orders/', OrdersCtrl.readOrders);
router.post ('/orders/confirm', OrdersCtrl.confirmCheckout);
router.post ('/orders/checkout', OrdersCtrl.checkout);
router.get ('/orders/order/:orderId', OrdersCtrl.readAnOrder);
router.post ('/orders/order/:orderId/edit', OrdersCtrl.updateAnOrder);
router.get ('/orders/search-customers', OrdersCtrl.searchCustomers);

router.get('/bookings/all', BookingCtrl.readAllBookings);
router.get('/bookings', BookingCtrl.readSomeBookings);
router.post('/bookings/create', BookingCtrl.booking);
router.post('/bookings/:bookingId/edit', BookingCtrl.updateBooking);
router.get('/bookings/booking/:bookingId', BookingCtrl.readOneBooking);

router.get('/hr', hrCtrl.readOverview);
router.get('/hr/employees/employee/:uId', hrCtrl.readOneUser);
router.post('/hr/employees/employee/:uId/edit', hrCtrl.editOneUser);
router.get('/angular/employees', hrCtrl.readAngularEmployees);

// router.get('/bi', biCtrl.readReport);

router.get('/assets', assetsCtrl.readSomeAsset);
router.get('/assets/asset/:assetId', assetsCtrl.readOneAssetById);
router.post('/assets/create', assetsCtrl.createOneAsset);
router.post('/assets/asset/:assetid/edit', assetsCtrl.updateOneAsset);
router.get('/angular/assets', assetsCtrl.readAngularAsset);

router.get('/customer-management', CustomersCtrl.readOverview);
router.get('/customers', CustomersCtrl.readSomeCustomers);
router.get('/customers/customer/:cusId', CustomersCtrl.readOneCustomerById);
router.post('/customers/create', CustomersCtrl.createOneCustomer);
router.post('/customers/customer/:cusId/edit', CustomersCtrl.updateOneCustomer);
router.get('/customers/exist', CustomersCtrl.checkExist);

// router.get('/fin/costs', finCtrl.readSomeCosts);
// router.post('/fin/costs/create', finCtrl.createOneCost);
// router.get('/fin/costs/cost/:costId', finCtrl.readOneCostById);
// router.post('/fin/costs/cost/:costId/edit', finCtrl.updateOneCost);

router.post ('/transactions/create', TransactionCtrl.createATrans);

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

router.get('/angular/attendances', OthersCtrl.readAngularAttendance);

router.get ('/promocodes', promoCodesCtrl.readSomeCodes);
router.get ('/promo-codes/code/:codeId', promoCodesCtrl.readOneCodeById);
router.post ('/promo-codes/create', promoCodesCtrl.createOneCode);
router.post ('/promo-codes/code/:codeId', promoCodesCtrl.updateOneCode);

router.post ('/deposits/create', DepositsCtrl.createOneDeposit);
router.post ('/deposits/deposit/:depositId/edit', DepositsCtrl.updateOneDeposit);
router.get ('/deposits/account/default', DepositsCtrl.readDefaultAccounts);
router.get ('/deposits/invoice', DepositsCtrl.readInvoice);

// Others
router.get ('/components/template/message', OthersCtrl.getMessageTemplate);
router.get ('/components/template/asset', OthersCtrl.getAssetTemplate);

module.exports = router;