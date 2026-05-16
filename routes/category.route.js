const express = require('express');
const router = express.Router();
const category = require('../controllers').category;
const authenticateToken = require('../middleware/auth');

router.get('/', category.getCategories);
router.post('/', category.createCategory);

module.exports = router;