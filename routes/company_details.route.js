const express = require('express');
const router = express.Router();
const companyDetails = require('../controllers').companyDetails;
const authenticateToken = require('../middleware/auth');

router.get('/', companyDetails.getCompanyDetails);
router.post('/', companyDetails.createCompanyDetails);

module.exports = router;