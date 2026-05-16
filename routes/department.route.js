const express = require('express');
const router = express.Router();
const department = require('../controllers').department;
const authenticateToken = require('../middleware/auth');

router.get('/', department.getDepartment);
router.post('/', department.createDepartment);

module.exports = router;