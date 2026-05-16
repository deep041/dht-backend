const express = require('express');
const router = express.Router();
const supplier = require('../controllers').supplier;
const authenticateToken = require('../middleware/auth');

router.get('/', supplier.getSuppliers);
router.post('/', supplier.createSupplier);

module.exports = router;