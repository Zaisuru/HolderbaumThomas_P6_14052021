//Importation
const mongoose = require('mongoose');
const User = require ('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Creation d'un compte
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email:req.body.email,
                password:hash
            })
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé ! '}) )
                .catch(error => res.status(400).json({message : 'Erreur de création'}))
        })
        .catch(error =>  res.status(500).json({error}))
}

//Connexion via compte existant
exports.login = (req, res, next) => {
    User.findOne({
        email : req.body.email
    })
        .then(user  => {
            //verifie si l'utilisateur existe dans la base
            if (!user) {
                return res.status(401).json({error : 'Utilisateur non trouvé ! '});
            }
            //verifie que le mdp correspond
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({message : 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId : user._id,
                        token: jwt.sign(
                            {userId : user._id},
                            process.env.TOKEN,
                            {expiresIn:'24h'})
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error =>res.status(500).json({error}));
};