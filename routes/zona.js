const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const zoneController = require('../controllers/zona');
const tokenChecker = require('../middleware/tokenChecker');
// 3.

router.post('/zone', tokenChecker, zoneController.createZone);

router.get('/zone/position/:id', tokenChecker, zoneController.getZonePosition);

router.get('/zone/containers/:id', tokenChecker, zoneController.getZoneContainers);
// 4.
module.exports = router; // export to use in server.js