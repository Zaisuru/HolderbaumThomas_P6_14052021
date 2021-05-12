const Sauce = require('../models/Sauce.js');
const fs = require('fs');

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

//Ajout un like ou dislike à la sauce
exports.likeSauce = (req, res, next) => {
    //ajout d'un like
    if (req.body.like === 1) {
        //On vérifie la présence de l'user et on update le like
        Sauce.updateOne({_id: req.params.id}, {
            $push: {usersLiked: req.body.userId},
            $inc: {likes: +1}},
        )
            .then(() => res.status(200).json({message: "j'aime ajouté !"}))
            .catch(error =>res.status(400).json({error}));
    };
    // Ajout d'un dislike
    if (req.body.like === -1) {
        //On vérifie la présence de l'user et on update le dislike
        Sauce.updateOne({_id: req.params.id},{
            $push: {usersDisliked: req.body.userId},
            $inc: {dislikes: +1}},
            )
            .then(() => {res.status(200).json({message: 'Dislike ajouté !'})})
            .catch(error =>res.status(400).json({error}))};
    //Suppr le like ou dislike déjà sélectionné

    if (req.body.like === 0) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                //suppr le like
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id},{
                        $pull: {usersLiked: req.body.userId},
                        $inc: {likes: -1}})
                        .then(() =>res.status(200).json({message: 'Like retiré !'}))
                        .catch(error =>res.status(400).json({error}))}
                //suppr le dislike
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id},{
                        $pull: {usersDisliked: req.body.userId},
                        $inc: {dislikes: -1}})
                        .then(() =>res.status(200).json({message: 'Dislike retiré !'}))
                        .catch(error =>res.status(400).json({error}))}
            })
            .catch(error =>res.status(404).json({error}))}
};