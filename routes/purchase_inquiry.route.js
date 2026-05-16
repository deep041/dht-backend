const express = require('express');
const router = express.Router();
const purchaseInquiry = require('../controllers').purchaseInquiry;

router.get('/', purchaseInquiry.getPurchaseInquiries);
router.get('/:id', purchaseInquiry.getPurchaseInquiryById);
router.post('/', purchaseInquiry.createPurchaseInquiry);
router.put('/:id', purchaseInquiry.updatePurchaseInquiry);
router.delete('/:id', purchaseInquiry.deletePurchaseInquiry);

module.exports = router;
