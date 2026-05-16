const express = require('express');
const router = express.Router();
const purchaseIndent = require('../controllers').purchaseIndent;

router.get('/', purchaseIndent.getPurchaseIndents);
router.get('/:id', purchaseIndent.getPurchaseIndentById);
router.post('/', purchaseIndent.createPurchaseIndent);
router.put('/:id', purchaseIndent.updatePurchaseIndent);
router.delete('/:id', purchaseIndent.deletePurchaseIndent);

module.exports = router;
