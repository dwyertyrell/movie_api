const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

// the local passport.js file
    require('./passport'); 

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username, 
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/* POST Login for generating a jwt token for existing users already in the 
    database but not authenticated */
module.exports = (router) => {
    router.post('/login', (req, res)=> {
        passport.authenticate('local', {session: false}, 
    (error, user, info) => {
        if(error || !user) {
            return res.status(400).json({
                message: 'something is not right',
                user: user
            });
        }
        req.login(user, {session: false}, (error) => {
            if(error) {
                res.send(error);
            }
            let token = generateJWTToken(user.toJSON());
            return res.json({user, token});
        });
    })(req, res); 
    });
}

/* my hashed password in the (user-input field) req.body does not work while i 
try to login with existing user- i must use their un-hashed password. it does, 
however, work in the parms header of postman. username jeff123 password: raw98 
 
 problem- previously added monooge users cannot follow through with endpoing and
 generate token. but newly created mongoose users can.
   "username": "immarn123",
    "password": "lyal123"
    although it is stored on mongoosh shell terminal, as a hased password, i cannot
    use the hashed password in postman not find the original after it being hashed 
    */
