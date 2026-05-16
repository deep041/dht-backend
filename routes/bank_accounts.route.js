const express = require('express');
const router = express.Router();
const bankAccounts = require('../controllers').bankAccounts;
const authenticateToken = require('../middleware/auth');

router.get('/', bankAccounts.getBankAccounts);
router.post('/', bankAccounts.createBankAccounts);

module.exports = router;