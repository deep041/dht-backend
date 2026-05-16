const express = require('express');
const router = express.Router();
const subZone = require('../controllers').subZone;
const authenticateToken = require('../middleware/auth');

router.get('/', subZone.getSubZones);
router.get('/zone/:zoneId', subZone.getSubZoneByZone);
router.post('/', subZone.createSubZone);

module.exports = router;