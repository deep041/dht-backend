const express = require('express');
const router = express.Router();
const itemTransaction = require('../controllers').itemTransaction;

router.get('/', itemTransaction.getItemTransactions);
router.get('/item/:itemId', itemTransaction.getItemTransactionsByItemId);

module.exports = router;
