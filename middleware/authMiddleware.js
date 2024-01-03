const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const authToken =  req.cookies.access_token;

    if(authToken){
        jwt.verify(authToken, 'help desk secret', (err, user) => {
            if(err){
                return res.status(403).json(err);
            }else{
                req.user = user;
                next();
            }
        })
    }else{
        res.status(401).json({ message: "You are not authenticated, Invalid cookie." });
    }
}

const checkUser = (req, res, next) => {
    const authToken =  req.cookies.access_token;

    if(authToken){
        jwt.verify(authToken, 'help desk secret', async (err, decodedToken) => {
            if(err){
                res.locals.user = null;
                next();
            }else{
                let user = await User.findById(decodedToken.id);

                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser  }