const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Declaration route
//Ajoute une sauce
router.post('/',auth, sauceCtrl.createSauce);

//Renvoi le tableau des sauces
router.get('/',  sauceCtrl.getAllSauce);

// Renvoi la sauce avec l'id
//router.get('/api/sauces/:id', auth,  sauceCtrl.uniqueSauce);

//Met à jour la sauce avec l'id
//router.put('/api/sauces/:id', auth,  sauceCtrl.modifySauce);

//Supprime la sauce avec l'ID
//router.delete('/api/sauces/:id', auth,  sauceCtrl.deleteSauce);

//Exports module
module.exports = router;