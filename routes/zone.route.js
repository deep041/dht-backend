const express = require('express');
const router = express.Router();
const zone = require('../controllers').zone;
const authenticateToken = require('../middleware/auth');

router.get('/', zone.getZones);
router.get('/region/:regionId', zone.getZoneByRegion);
router.post('/', zone.createZone);

module.exports = router;