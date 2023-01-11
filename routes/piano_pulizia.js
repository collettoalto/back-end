const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const piano_puliziaController = require('../controllers/piano_pulizia');
const tokenChecker = require('../middleware/tokenChecker');
// 3.

router.post('/piano_pulizia', tokenChecker, piano_puliziaController.createPianoPulizia);

router.get('/piano_pulizia/list', tokenChecker, piano_puliziaController.getPianoPuliziaList);

router.get('/piano_pulizia/organization/:id', tokenChecker, piano_puliziaController.getPianoPuliziaInfoForOrg);

router.get('/piano_pulizia/robot', tokenChecker, piano_puliziaController.getPianoPuliziaInfoForRobot);

router.patch('/piano_pulizia', tokenChecker, piano_puliziaController.assegnaPianoPulizia);


module.exports = router; // export to use in server.js