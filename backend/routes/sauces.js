const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

//Declaration route
//Ajoute une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

//Renvoi le tableau des sauces
router.get('/',  sauceCtrl.getAllSauce);

// Renvoi la sauce avec l'id
//router.get('/:id', auth,  sauceCtrl.uniqueSauce);

//Met à jour la sauce avec l'id
//router.put('/:id', auth,  sauceCtrl.modifySauce);

//Supprime la sauce avec l'ID
//router.delete('/:id', auth,  sauceCtrl.deleteSauce);

//Exports module
module.exports = router;