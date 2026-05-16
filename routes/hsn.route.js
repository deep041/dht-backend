const express = require('express');
const router = express.Router();
const hsn = require('../controllers').hsn;
const authenticateToken = require('../middleware/auth');

router.get('/', hsn.getHSN);
router.post('/', hsn.createHSN);

module.exports = router;