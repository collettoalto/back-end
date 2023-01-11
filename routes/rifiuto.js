const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const rifiutoController = require('../controllers/rifiuto');
const tokenChecker = require('../middleware/tokenChecker');
// 3.

router.post('/rifiuto', tokenChecker, rifiutoController.riconoscimentoRifiuto);

router.get('/rifiuto/info/:id', tokenChecker, rifiutoController.getDettagliRifiuto);

router.get('/rifiuto/tocollect', tokenChecker, rifiutoController.getTrashToCollect);

router.get('/rifiuto/toclassify', tokenChecker, rifiutoController.getTrashToClassify);

router.delete('/rifiuto/:id', tokenChecker, rifiutoController.deleteRifiuto);

router.patch('/rifiuto/:id', tokenChecker, rifiutoController.classificaRifiuto);





module.exports = router;