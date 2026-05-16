const express = require('express');
const router = express.Router();
const quotation = require('../controllers').quotation;
const authenticateToken = require('../middleware/auth');

// Get all quotations
router.get('/', quotation.getQuotations);

// Get quotation by ID
router.get('/:id', quotation.getQuotationById);

// Get quotations by customer
router.get('/customer/:customerId', quotation.getQuotationsByCustomer);

// Create quotation
router.post('/', quotation.createQuotation);

// Update quotation
router.put('/:id', quotation.updateQuotation);

// Delete quotation
router.delete('/:id', quotation.deleteQuotation);

module.exports = router;
