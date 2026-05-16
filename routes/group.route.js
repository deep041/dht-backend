const express = require('express');
const router = express.Router();
const group = require('../controllers').group;
const authenticateToken = require('../middleware/auth');

router.get('/', group.getGroup);
router.post('/', group.createGroup);

module.exports = router;