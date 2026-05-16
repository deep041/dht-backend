const express = require('express');
const router = express.Router();
const salesOrder = require('../controllers').salesOrder;

router.get('/', salesOrder.getSalesOrders);
router.get('/customer/:customerId', salesOrder.getSalesOrdersByCustomer);
router.get('/:id', salesOrder.getSalesOrderById);
router.post('/', salesOrder.createSalesOrder);
router.put('/:id', salesOrder.updateSalesOrder);
router.delete('/:id', salesOrder.deleteSalesOrder);

module.exports = router;
