const express = require('express');
const router = express.Router();
const customer = require('../controllers').customer;
const customerContactPerson = require('../controllers/customerContactPerson.controller');

// Must be registered before GET / to avoid route conflicts
router.get('/:customerId/contact-persons', customerContactPerson.getContactPersonsByCustomerId);
router.get('/', customer.getCustomers);
router.post('/', customer.createCustomer);

module.exports = router;