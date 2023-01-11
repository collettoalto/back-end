const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const robotController = require('../controllers/robot');
const tokenChecker = require('../middleware/tokenChecker');
// 3.

router.post('/robot', tokenChecker, robotController.createRobot);

router.get('/robot/:id', tokenChecker, robotController.getRobotById);

router.put('/robot', tokenChecker, robotController.updateRobot);

// 4.
module.exports = router; // export to use in server.js