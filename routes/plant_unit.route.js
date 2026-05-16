const express = require('express');
const router = express.Router();
const plantUnit = require('../controllers').plantUnit;
const authenticateToken = require('../middleware/auth');

router.get('/', plantUnit.getPlantUnit);
router.post('/', plantUnit.createPlantUnit);

module.exports = router;