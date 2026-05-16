const express = require('express');
const router = express.Router();
const users = require('../controllers').users;
const authenticateToken = require('../middleware/auth');

router.get('/', users.getUsers);
router.get('/auth-users', users.getAuthUsers);
router.post('/', users.createUser);

module.exports = router;