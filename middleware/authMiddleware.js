const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const authToken = req.headers.authorization;

    if(authToken){
        const token = authToken.split(" ")[1];

        jwt.verify(token, 'help desk secret', (err, user) => {
            if(err){
                return res.status(403).json(err);
            }else{
                req.user = user;
                next();
            }
        })
    }else{
        res.status(401).json({ message: "you are not authenticated" });
    }
}

const checkUser = (req, res, next) => {
    const authToken = req.headers.authorization;
    if(authToken){
        const token = authToken.split(" ")[1];

        jwt.verify(token, 'help desk secret', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                // console.log(decodedToken)
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