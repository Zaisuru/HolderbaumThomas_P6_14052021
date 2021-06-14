//Importation
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoute = require('./routes/sauces');
const usersRoute = require('./routes/user');
const app = express();
const helmet = require('helmet');
require('dotenv').config();


mongoose.connect(process.env.mongodb,
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

app.use(helmet);
app.use(bodyParser.json());

//Declaration middleware
app.use('/images', express.static(path.join(__dirname, 'images')));

//Declaration des routes
app.use('/api/auth', usersRoute);
app.use('/api/sauces', sauceRoute);

//Exports
module.exports = app;