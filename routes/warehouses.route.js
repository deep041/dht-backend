const express = require('express');
const router = express.Router();
const warehouses = require('../controllers').warehouses;
const authenticateToken = require('../middleware/auth');

router.get('/', warehouses.getWarehouses);
router.post('/', warehouses.createWarehouse);

module.exports = router;