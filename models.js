const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Plot: {type: String, required: true},
    Type: String,
    Genre: {
      name: String,
      Description: String
    },
    director: {
      name: String,
      bio: String    
    },
    actors: [String],
    ImagePath: String,
    Featured: Boolean,
    Year: Number,
    Rated: String,
    Runtime: String,
    Awards :String, 

  });

  let userSchema = mongoose.Schema({
      username : {type: String, required:true},
      password: {type: String, required: true},
      id:{type:String,required:false}, 
      email : {type: String, required: true},
      birthDay : Date,
      favmovies : [{ type: mongoose.Schema.Types.ObjectId,ref:'Movie'}]
  });

  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };

  let Movie = mongoose.model('movies',movieSchema);
  let User = mongoose.model('users',userSchema);

  module.exports.Movie = Movie;
  module.exports.User = User; 