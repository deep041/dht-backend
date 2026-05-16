const express = require('express');
const router = express.Router();
const item = require('../controllers').item;
const authenticateToken = require('../middleware/auth');

router.get('/', item.getItems);
router.post('/', item.createItem);

module.exports = router;