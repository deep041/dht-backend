const express = require('express');
const router = express.Router();
const supplier = require('../controllers').supplier;
const supplierContactPerson = require('../controllers/supplierContactPerson.controller');
const authenticateToken = require('../middleware/auth');

router.get('/:supplierId/contact-persons', supplierContactPerson.getContactPersonsBySupplierId);
router.get('/', supplier.getSuppliers);
router.post('/', supplier.createSupplier);

module.exports = router;