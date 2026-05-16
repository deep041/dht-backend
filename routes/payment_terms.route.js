const express = require('express');
const router = express.Router();
const paymentTerms = require('../controllers').paymentTerms;
const authenticateToken = require('../middleware/auth');

router.get('/', paymentTerms.getPaymentTerms);
router.post('/', paymentTerms.createPaymentTerms);

module.exports = router;