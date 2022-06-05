const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models =require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User;

let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

//no check for password in LocalStrategy
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  },(username,password,callback) =>{
      console.log(username + ' ' + password);
      Users.findOne({username:username},(error,user)=>{
        if (error) {
        console.log(error);
        return callback(error);
        }
       if(!user) {
         console.log('incorrect username');
          return callback(null,false,{message:'Incorrect schema or password'});
       }
       if (!user) {
         console.log('incorrect username');
         return callback(null,false,{ message: 'Incorrect username.'})
       }
      console.log('finished');
      return callback(null,user);
    });
}));

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'your_jwt_secret'
  } ,(jwtPayload,callback) => {return Users.findById(jwtPayload._id)
    .then((user) =>{
      return callback(null,user)
    })
    .catch((error)=>{
      return callback(error)
    });
}));



