const Sauce = require('../models/Sauce.js');
const fs = require('fs');

// configuration route

//Ajoute une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Objet enregistré'}))
        .catch(error => res.status(400).json({error}));
};

//Renvoi le tableau des sauces
exports.getAllSauce = (req,res,next) => {
    Sauce.find()
        .then((sauce) => {res.status(200).json(sauce);})
        .catch(error => res.status(400).json({error}));
};

// Renvoi la sauce avec l'id
exports.uniqueSauce = (req,res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

//Met à jour la sauce avec l'id
exports.modifySauce = (req,res,next) => {
    const sauceObject = req.file? // si existe
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, id: req.params.id})
        .then(() => res.status(200).json({message:'Objet modifé !'}))
        .catch(error => res.status(400).json({error}));
};

//Supprime la sauce avec l'ID
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id : req.params.id})
                    .then(() => res.status(200).json({message:'Objet Supprimé'}))
                    .catch(error => res.status(400).json({error}));
            })
        })
        .catch(error => res.status(500).json({error}))
};