var express = require("express");

var router = express.Router();

var usersCtrl = require("../controllers/users");
var customersCtrl = require("../controllers/customers");
var companiesCtrl = require("../controllers/companies");
var deptsCtrl = require("../controllers/depts");
var productsCtrl = require("../controllers/products");
var ordersCtrl = require("../controllers/orders");
var costsCtrl = require("../controllers/costs");
var bookingCtrl = require("../controllers/booking");
var assetsCtrl = require("../controllers/assets");


router.get('/api/users', usersCtrl.readSomeUsers);
router.get('/api/users/user/:uid', usersCtrl.readOneUserById);
router.post('/api/users/create', usersCtrl.createOneUser);
router.post('/api/users/user/:uid/edit', usersCtrl.updateOneUserById);

router.get('/api/customers/', customersCtrl.readSomeCustomers);
router.get('/api/customers/customer/:uid', customersCtrl.readOneCustomerById);
router.post('/api/customers/create', customersCtrl.createOneCustomer);
router.post('/api/customers/customer/:cusid/edit', customersCtrl.updateOneCustomerById);

router.get('/api/companies/', companiesCtrl.readSomeComps);
router.get('/api/companies/company/:compid', companiesCtrl.readOneCompById);
router.post('/api/companies/create', companiesCtrl.createOneComp);
router.post('/api/companies/company/:compid/edit', companiesCtrl.updateOneCompById);

router.get('/api/companies/depts/', deptsCtrl.readSomeDepts);
router.get('/api/depts/dept/:deptid', deptsCtrl.readOneDeptById);
router.post('/api/depts/create', deptsCtrl.createOneDept);
router.post('/api/depts/dept/:deptid/edit', deptsCtrl.updateOneDeptById);

router.get('/api/products/', productsCtrl.readSomeProducts);
router.get('/api/products/product/:productid', productsCtrl.readOneProductById);
router.post('/api/products/create', productsCtrl.createOneProduct);
router.post('/api/products/product/:productid/edit', productsCtrl.updateOneProductById);

router.get('/api/orders/', ordersCtrl.readSomeOrders);
router.get('/api/orders/order/:orderid', ordersCtrl.readOneOrderById);
router.post('/api/orders/create', ordersCtrl.createOneOrder);
router.post('/api/orders/order/:orderid/edit', ordersCtrl.updateOneOrderById);

router.get('/api/costs/', costsCtrl.readSomeCosts);
router.get('/api/costs/cost/:costid', costsCtrl.readOneCostById);
router.post('/api/costs/create', costsCtrl.createOneCost);
router.post('/api/costs/cost/:costid/edit', costsCtrl.updateOneCostById);

router.get('/api/bookings/', bookingCtrl.readSomeBookings);
router.get('/api/bookings/booking/:bookingid', bookingCtrl.readOneBookingById);
router.post('/api/bookings/create', bookingCtrl.createOneBooking);
router.post('/api/bookings/booking/:bookingid/edit', bookingCtrl.updateOneBookingById);

router.get('/api/assets/', assetsCtrl.readSomeAssets);
router.get('/api/assets/asset/:assetid', assetsCtrl.readOneAssetById);
router.post('/api/assets/create', assetsCtrl.createOneAsset);
router.post('/api/assets/asset/:assetid/edit', assetsCtrl.updateOneAssetById);

module.exports = router;