const express = require('express');
const router = express.Router();
const classification = require('../controllers').classification;
const authenticateToken = require('../middleware/auth');

router.get('/', classification.getClassification);
router.post('/', classification.createClassification);

module.exports = router;