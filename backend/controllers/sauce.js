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

exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        Sauce.updateOne({_id: req.params.id}, {
            $push: {usersLiked: req.body.userId},
            $inc: {likes: +1}},
        )
            .then(() => res.status(200).json({message: "j'aime ajouté !"}))
            .catch(error =>res.status(400).json({error}));
    };
    // S'il s'agit d'un dislike
    // On push l'utilisateur et on incrémente le compteur de 1
    if (req.body.like === -1) {
        Sauce.updateOne({_id: req.params.id},{
            $push: {usersDisliked: req.body.userId},
            $inc: {dislikes: +1}},
            )
            .then(() => {res.status(200).json({message: 'Dislike ajouté !'})})
            .catch(error =>res.status(400).json({error}))};
    // Si il s'agit d'annuler un like ou un dislike
    // Si il s'agit d'annuler un like
    // On pull l'utilisateur et on incrémente le compteur de -1
    if (req.body.like === 0) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id},{
                        $pull: {usersLiked: req.body.userId},
                        $inc: {likes: -1}})
                        .then(() =>res.status(200).json({message: 'Like retiré !'}))
                        .catch(error =>res.status(400).json({error}))}
                // Si il s'agit d'annuler un dislike
                // On pull l'utilisateur et on incrémente le compteur de -1
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id},{
                        $pull: {usersDisliked: req.body.userId},
                        $inc: {dislikes: -1}})
                        .then(() =>res.status(200).json({message: 'Dislike retiré !'}))
                        .catch(error =>res.status(400).json({error}))}
            })
            .catch(error =>res.status(404).json({error}))}
};