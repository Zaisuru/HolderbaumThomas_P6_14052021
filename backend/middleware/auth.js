const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res,next) => {
    try{
        console.log('Test token');
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        }
        else{
            next();
        }
    }
    catch{ res.status(401).json({error : new Error ('Message erreur auth')});}
    // catch(error){
    //
    //     //res.status(401).json({error: error | 'Bad request'});
    //     console.log('Test token 3');
    // }
};