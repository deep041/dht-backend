const express = require('express');
const router = express.Router();
const rawMaterial = require('../controllers').rawMaterial;
const authenticateToken = require('../middleware/auth');

router.get('/', rawMaterial.getRawMaterial);
router.post('/', rawMaterial.createRawMaterial);

module.exports = router;