//2.9 working in this file 5-June 2022
//database is locally available in mongod and mongoshell 
//database name is szaFlix 

const { join } = require('lodash');

// This is the server file for task 2.8 with mongoose with real database 
const express = require('express');
const res = require('express/lib/response');
const { v4 } = require('uuid');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
    
const mongoose = require('mongoose');
const Models = require('./models.js');
//const { update } = require('lodash');

const Movies = Models.Movie;
const Users = Models.User;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // serve static files
//app.use(morgan("common")); // log requests to terminal


let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


mongoose.connect('mongodb://localhost:27017/szaFlix', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res) => {
  res.send('<h1>Hello Movies server  </h1>')
})

//GET - documentation.html
app.get('/documentation',(req,res) => {
  res.sendFile('public/documentation.html',{root: __dirname});
});


//Secret Url
app.get('/secretUrl', (req,res) => { 
let responseText = 'Welcome to secrete URL';
let requestTime = Date.now();
responseText += '<small>Requested at: ' + req.requestTime + '<small>';
res.send(responseText);
});

//Add - Create user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if ((user)) {
        console.log(user, 'userID', user.id);
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            id: req.body.id,
            Email: req.body.Email,
            birthDay: req.body.birthDay
          })
          //callback takes document created as a parameter 
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error   ' + error);
    });
});


//Add - Create movies
app.post('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      if ((movie)) {
        console.log(movie, 'Title');
        return res.status(400).send(req.body.Title + ' already exists');
      } else {
        Movies
          .create({
            Title: req.body.Title,
            Plot: req.body.Plot
            //director.name
          })
          //callback takes document created as a parameter 
          .then((movie) => { res.status(201).json(movie) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error   ' + error);
    });
});


//PUT - Update movies - 
app.put('/movies/:Title',(req, res) => {
  Movies.findOneAndUpdate({ Title:req.params.Title },
    { $set:
      {
        Title: req.body.Title,
        Plot: req.body.Plot
        // Genre.name: req.body.Genre.name ??
        //actors: req.body.Actors ?/ 
      }
    },
    {new:true}, // This line makes sure that the updated document is returned
    (err,updateMovies) => {
      if(err) {
        console.error(err); 
        res.status(500).send('Error '+ err );
      } else {
        res.json(updateMovies);
      }
    });
});

//Update USER by Username
app.put('/users/:Username',passport.authenticate('jwt',{session:false}), (req,res) => { 
  Users.findOneAndUpdate({Username:req.params.Username},
    { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        id: req.body.id, 
        Email: req.body.Email,
        birthDay: req.body.birthDay
      }
    },
    {new:true}, // This line makes sure that the updated document is returned
    (err,updateUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error '+ err );
      } else {
        res.json(updateUser);
      }
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID',passport.authenticate('jwt',{session:false}),(req,res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
    { $push: 
      {favmovies: req.params.MovieID }
    },
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


// Get all users
app.get('/users', passport.authenticate('jwt',{session:false}),(req,res)=> {
  Users.find()
   .then((users) => {
    res.status(201).json(users);
    })
    .catch((err)=>{
      console.error(err);
      res.status(500).send('Error:' + err);
   });
});

//Get one user by Username
app.get('/users/:Username',passport.authenticate('jwt',{session:false}) ,(req,res) => {
  Users.findOne({Username : req.params.Username})
  .then((user) => {
    res.status(201).json(user);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Get one users by id
app.get('/users/id/:ID',passport.authenticate('jwt',{session:false}), (req,res) => {
  Users.findOne({id : req.params.ID})
  .then((id) => {
    res.json(id);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});


//T1.Get all movie
app.get('/movies',passport.authenticate('jwt',{session:false}), (req,res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Get one movie by Title
app.get('/movies/:Title',passport.authenticate('jwt',{session:false}), (req,res) => {
  Movies.findOne({Title : req.params.Title})
  .then((title) => {
    res.json(title);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Get all movies by Genre
app.get('/Genres/:Genre',passport.authenticate('jwt',{session:false}), (req,res) => {
  Movies.find({"Genre.Name" : req.params.Genre})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});


//Get all movies by Director Name
app.get('/movies/director/:name',passport.authenticate('jwt',{session:false}), (req,res) => {
  Movies.find({"director.name" : req.params.name})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Delete User by Username
app.delete('/users/:Username', passport.authenticate('jwt',{session:false}),(req,res)=> {
  Users.findOneAndRemove({Username: req.params.Username})
    .then((user)=>{
      if(!user){
        res.status(400).send(req.params.Username + 'Username not found');
      } else {
        res.status(200).send(req.params.Username + 'was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error' + err);
    });
});

//Delete User by id
app.delete('/users/id/:ID', passport.authenticate('jwt',{session:false}),(req,res)=> {
  Users.findOneAndRemove({id: req.params.ID})
    .then((id)=>{
      if(!id){
        res.status(400).send(req.params.ID + 'id not found');
      } else {
        res.status(200).send(req.params.ID + 'id was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error' + err);
    });
});

//Delete favmovies 
app.delete('/users/:Username/movies/:MovieID',passport.authenticate('jwt',{session:false}),(req,res)=>{
  Users.findOneAndUpdate({Username: req.params.Username},
    { $pull:{favmovies: req.params.MovieID}},
    {new: true},
    (err, updatedUser)  => {
      if (err){
        console.error(err);
        res.status(500).send('Error' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

app.listen(8080, () => console.log('listening on 8080'));   