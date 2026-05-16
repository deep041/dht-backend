const express = require('express');
const router = express.Router();
const menus = require('../controllers').menu;
const authenticateToken = require('../middleware/auth');

router.get('/', menus.getMenus);
router.post('/', menus.createMenu);

module.exports = router;