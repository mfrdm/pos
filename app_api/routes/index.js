var express = require("express");

var router = express.Router();

var authCtrl = require ('../controllers/authentication');
var usersCtrl = require("../controllers/users");
var customersCtrl = require("../controllers/customers");
var companiesCtrl = require("../controllers/companies");
var deptsCtrl = require("../controllers/depts");
var productsCtrl = require("../controllers/products");
var ordersCtrl = require("../controllers/orders");
var transCtrl = require("../controllers/transactions.ctrl");
var bookingCtrl = require("../controllers/bookings");
var assetsCtrl = require("../controllers/assets");
var attendancesCtrl = require("../controllers/attendances");
var OccupanciesCtrl = require ("../controllers/occupancies.ctrl");
var depositCtrl = require ('../controllers/deposits.ctrl');
var accountCtrl = require ('../controllers/accounts');
var checkinCtrl = require ('../controllers/checkin');
var promocodeCtrl = require ('../controllers/promocodes');

router.post ('/register', authCtrl.register);
router.post ('/login', authCtrl.login);
router.post ('/changePwd', authCtrl.changePwd);

router.get('/users', usersCtrl.readSomeUsers);
router.get('/users/user/:uId', usersCtrl.readOneUserById);
router.post('/users/create', usersCtrl.createOneUser);
router.post('/users/user/:uId/edit', usersCtrl.updateOneUserById);

router.get('/customers/', customersCtrl.readSomeCustomers);
router.get('/customers/customer/:cusId', customersCtrl.readOneCustomerById);
router.post('/customers/create', customersCtrl.createOneCustomer);
router.post('/customers/customer/:cusId/edit', customersCtrl.updateOneCustomerById);
router.post('/customers/createMany', customersCtrl.createManyCustomers);

router.get('/companies/', companiesCtrl.readSomeComps);
router.get('/companies/company/:compId', companiesCtrl.readOneCompById);
router.post('/companies/.,mnbvcxz/create', companiesCtrl.createOneComp);
router.post('/companies/company/:compId/edit', companiesCtrl.updateOneCompById);

router.get('/companies/depts/', deptsCtrl.readSomeDepts);
router.get('/depts/dept/:deptId', deptsCtrl.readOneDeptById);
router.post('/depts/create', deptsCtrl.createOneDept);
router.post('/depts/dept/:deptId/edit', deptsCtrl.updateOneDeptById);

router.get('/products/', productsCtrl.readSomeProducts);
router.get('/products/product/:productId', productsCtrl.readOneProductById);
router.post('/products/create', productsCtrl.createOneProduct);
router.post('/products/product/:productId/edit', productsCtrl.updateOneProductById);

router.get('/attendances/', attendancesCtrl.readSomeAttendances);
router.get('/attendances/attendance/:attendanceId', attendancesCtrl.readOneAttendanceById);
router.post('/attendances/create', attendancesCtrl.createOneAttendance);
router.post('/attendances/attendance/:attendanceId/edit', attendancesCtrl.updateOneAttendanceById);

router.get('/orders/', ordersCtrl.readSomeOrders);
router.get('/orders/order/:orderId', ordersCtrl.readOneOrderById);
router.post('/orders/create', ordersCtrl.createOneOrder);
router.post('/orders/order/:orderId/edit', ordersCtrl.updateOneOrderById);

router.get('/orders/total', ordersCtrl.readTotal);
router.get('/orders/transactions', ordersCtrl.readTransactions);

// router.get('/transs/', transCtrl.readSomeTrans);
// router.get('/transs/trans/:transId', transCtrl.readOneTransById);
// router.post('/transs/create', transCtrl.createOneTrans);
// router.post('/transs/trans/:transId/edit', transCtrl.updateOneTransById);


router.get ('/occupancies/totalCash', OccupanciesCtrl.readTotalCash);
router.get ('/occupancies/transactions', OccupanciesCtrl.readTransactions);
router.get ('/occupancies/customer', OccupanciesCtrl.readSomeByOneCustomer);

router.get('/bookings/', bookingCtrl.readSomeBookings);
router.get('/bookings/booking/:bookingId', bookingCtrl.readOneBookingById);
router.post('/bookings/create', bookingCtrl.createOneBooking);
router.post('/bookings/booking/:bookingId/edit', bookingCtrl.updateOneBookingById);

router.get('/assets/', assetsCtrl.readSomeAssets);
router.get('/assets/asset/:assetId', assetsCtrl.readOneAssetById);
router.post('/assets/create', assetsCtrl.createOneAsset);
router.post('/assets/asset/:assetId/edit', assetsCtrl.updateOneAssetById);

router.get ('/deposit/totalDeposit', depositCtrl.readTotalDeposit); // FIX later. Should be "/deposits/total"
router.get ('/deposits/totalCost', depositCtrl.readTotalCost);
router.get ('/deposits/customer', depositCtrl.readSomeByOneCustomer);

router.get ('/accounts/customer', accountCtrl.readSomeByOneCustomer);
router.post ('/accounts/depositCash', accountCtrl.depositCash);

router.post ('/checkin', checkinCtrl.checkin);
router.get ('/checkin', checkinCtrl.readSome);

router.get ('/promocodes/create', promocodeCtrl.createOne);
router.get ('/promocodes/create-private', promocodeCtrl.createPrivate);
router.get ('/promocodes/create-common', promocodeCtrl.createCommon);

module.exports = router;