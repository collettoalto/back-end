const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const organisationController = require('../controllers/organisation');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker
// 3.

router.post('/organisation', tokenChecker, organisationController.newOrganisation);

router.delete('/organisation/:name', tokenChecker, organisationController.deleteOrganisation);

router.get('/organisation/:name/info', tokenChecker, organisationController.getOrganisation);

router.get('/organisation/:name/robots', tokenChecker,  organisationController.getAllRobots);

router.patch('/organisation/:name/robots', tokenChecker, organisationController.addRobotToOrganisation);

module.exports = router; // export to use in server.js