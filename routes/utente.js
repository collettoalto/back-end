const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const utenteController = require('../controllers/utente');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker
// 3.

router.post('/utente/signup', utenteController.signup);

router.post('/utente/login', utenteController.login);

router.get('/utente/logout', tokenChecker, utenteController.logout);

router.get('/utente/organisations', tokenChecker, utenteController.getOrganisations);

router.get('/utente/profile', tokenChecker, utenteController.getProfile);



module.exports = router; // export to use in server.js