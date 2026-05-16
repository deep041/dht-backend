const express = require('express');
const router = express.Router();
const partyGroups = require('../controllers').partyGroups;
const authenticateToken = require('../middleware/auth');

router.get('/', partyGroups.getPartyGroups);
router.post('/', partyGroups.createPartyGroups);

module.exports = router;