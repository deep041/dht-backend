const express = require('express');
const router = express.Router();
const customer = require('../controllers').customer;
const authenticateToken = require('../middleware/auth');

router.get('/', customer.getCustomers);
router.post('/', customer.createCustomer);

module.exports = router;