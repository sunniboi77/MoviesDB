
//2.9 working in this file 5-June 2022
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

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
      Username : {type: String, required:true},
      Password: {type: String, required: true},
      id:{type:String,required:false}, 
      Email : {type: String, required: false},
      birthDay : Date,
      Favmovies : [{ type: mongoose.Schema.Types.ObjectId,ref:'Movie'}],
    
  });

  let Movie = mongoose.model('movies',movieSchema);
  let User = mongoose.model('users',userSchema);

  module.exports.Movie = Movie;
  module.exports.User = User; 



  
