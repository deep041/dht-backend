const express = require('express');
const router = express.Router();
const region = require('../controllers').region;
const authenticateToken = require('../middleware/auth');

router.get('/', region.getRegions);
router.post('/', region.createRegion);

module.exports = router;