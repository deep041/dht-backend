const express = require('express');
const router = express.Router();
const subGroup = require('../controllers').subGroup;
const authenticateToken = require('../middleware/auth');

router.get('/', subGroup.getSubGroups);
router.post('/', subGroup.createSubGroup);
router.get('/:groupId', subGroup.getSubGroupsByGroupId);

module.exports = router;