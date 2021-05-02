//Importation
const express = require('express');
const router = express.Router();
const userCtrl = require ('../controllers/user');

//Declaration routes
// enregistrement
router.post('/signup', userCtrl.signup);
//connexion
router.post('/login', userCtrl.login);

//Exportation
module.exports = router;
