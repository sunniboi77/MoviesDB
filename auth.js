const jwtSecret ='your_jwt_secret'; // This has to be the same key used in the JWTStrategy
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport'); //local passport file 

let generateJWTToken = (user) => {
    return jwt.sign(user,jwtSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/*POST Login */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session:false}, (error,user,info) => {
            if (error || !user) {
                return res.status(400).json({
                    message : 'something is not ok',
                    user:user
                });
            }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user,token});
            });
        }) (req,res);
    });
}

