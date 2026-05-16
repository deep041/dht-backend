const express = require('express');
const router = express.Router();
const taxInvoice = require('../controllers').taxInvoice;

router.get('/', taxInvoice.getTaxInvoices);
router.get('/:id', taxInvoice.getTaxInvoiceById);
router.post('/', taxInvoice.createTaxInvoice);
router.put('/:id', taxInvoice.updateTaxInvoice);
router.delete('/:id', taxInvoice.deleteTaxInvoice);

module.exports = router;
