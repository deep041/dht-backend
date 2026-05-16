const express = require('express');
const router = express.Router();
const roles = require('../controllers').role;
const authenticateToken = require('../middleware/auth');

router.get('/', roles.getRoles);
router.post('/', roles.createRole);

module.exports = router;