const express = require('express');
const router = express.Router();
const lead = require('../controllers').lead;
const authenticateToken = require('../middleware/auth');

router.get('/', lead.getLeads);
router.post('/', lead.createLead);

module.exports = router;