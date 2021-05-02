//Importation
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauceRoute = require('./routes/sauces');
const usersRoute = require('./routes/user');
const app = express();


mongoose.connect('mongodb+srv://admin:A88fd91cd62@cluster0.qtepw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology : true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



//Correction erreur CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Connexion mongoDB

app.use(bodyParser.json());

//Declaration des routes
app.use('/api/sauces', sauceRoute);

app.use('/api/auth', usersRoute);

//Exports
module.exports = app;