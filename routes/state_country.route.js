const express = require('express');
const router = express.Router();
const stateCountry = require('../controllers').stateCountry;
const authenticateToken = require('../middleware/auth');

router.get('/states', stateCountry.getStates);
router.get('/country', stateCountry.getCountries);

module.exports = router;