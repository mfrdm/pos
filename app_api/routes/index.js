var express = require("express");

var router = express.Router();

var usersCtrl = require("../controllers/users");
var customersCtrl = require("../controllers/customers");
var companiesCtrl = require("../controllers/companies");
var deptsCtrl = require("../controllers/depts");
var productsCtrl = require("../controllers/products");
var ordersCtrl = require("../controllers/orders");
var costsCtrl = require("../controllers/costs");
var bookingCtrl = require("../controllers/bookings");
var assetsCtrl = require("../controllers/assets");

router.get('/users', usersCtrl.readSomeUsers);
router.get('/users/user/:uid', usersCtrl.readOneUserById);
router.post('/users/create', usersCtrl.createOneUser);
router.post('/users/user/:uid/edit', usersCtrl.updateOneUserById);

router.get('/customers/', customersCtrl.readSomeCustomers);
router.get('/customers/customer/:cusid', customersCtrl.readOneCustomerById);
router.post('/customers/create', customersCtrl.createOneCustomer);
router.post('/customers/customer/:cusid/edit', customersCtrl.updateOneCustomerById);

router.get('/companies/', companiesCtrl.readSomeComps);
router.get('/companies/company/:compid', companiesCtrl.readOneCompById);
router.post('/companies/create', companiesCtrl.createOneComp);
router.post('/companies/company/:compid/edit', companiesCtrl.updateOneCompById);

router.get('/companies/depts/', deptsCtrl.readSomeDepts);
router.get('/depts/dept/:deptid', deptsCtrl.readOneDeptById);
router.post('/depts/create', deptsCtrl.createOneDept);
router.post('/depts/dept/:deptid/edit', deptsCtrl.updateOneDeptById);

router.get('/products/', productsCtrl.readSomeProducts);
router.get('/products/product/:productid', productsCtrl.readOneProductById);
router.post('/products/create', productsCtrl.createOneProduct);
router.post('/products/product/:productid/edit', productsCtrl.updateOneProductById);

router.get('/orders/', ordersCtrl.readSomeOrders);
router.get('/orders/order/:orderid', ordersCtrl.readOneOrderById);
router.post('/orders/create', ordersCtrl.createOneOrder);
router.post('/orders/order/:orderid/edit', ordersCtrl.updateOneOrderById);

router.get('/costs/', costsCtrl.readSomeCosts);
router.get('/costs/cost/:costId', costsCtrl.readOneCostById);
router.post('/costs/create', costsCtrl.createOneCost);
router.post('/costs/cost/:costId/edit', costsCtrl.updateOneCostById);

router.get('/bookings/', bookingCtrl.readSomeBookings);
router.get('/bookings/booking/:bookingId', bookingCtrl.readOneBookingById);
router.post('/bookings/create', bookingCtrl.createOneBooking);
router.post('/bookings/booking/:bookingId/edit', bookingCtrl.updateOneBookingById);

router.get('/assets/', assetsCtrl.readSomeAssets);
router.get('/assets/asset/:assetId', assetsCtrl.readOneAssetById);
router.post('/assets/create', assetsCtrl.createOneAsset);
router.post('/assets/asset/:assetId/edit', assetsCtrl.updateOneAssetById);

module.exports = router;