const express = require('express');
const router = express.Router();
const purchaseOrder = require('../controllers').purchaseOrder;

router.get('/', purchaseOrder.getPurchaseOrders);
router.get('/:id', purchaseOrder.getPurchaseOrderById);
router.post('/', purchaseOrder.createPurchaseOrder);
router.put('/:id', purchaseOrder.updatePurchaseOrder);
router.delete('/:id', purchaseOrder.deletePurchaseOrder);

module.exports = router;
