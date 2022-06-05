//2.9 working in this file 
//database is locally available 

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
app.post('/users',(req,res) => {
   Users.findOne({ username: req.body.username, userid:req.body.id})
   .then((user)=> {
      if ((user)) {
        console.log(user,'userID', user.id);
        return res.status(401).send(req.body.username + ' already exists')
      } else {
        Users
          .create({
            username: req.body.username,
            password: req.body.password,
            id:req.body.id, 
            email: req.body.email,
            birthDay: req.body.birthDay
          })
          //callback takes document created as a parameter 
          .then((user) => {res.status(201).json(user) })
           .catch((error) => {
             console.error(error);
             res.status(500).send('Error'+error);
            })
      }
    })
  .catch((error)=>{
    console.error(error);
    res.status(500).send('Error    '+ error);
  });
});


//Update USER by username
app.put('/users/:Username', (req,res) => { 
  Users.findOneAndUpdate({username:req.params.Username},
    { $set:
      {
        id: req.body.id, 
        username: req.body.username,
        password: req.body.Password,
        mail: req.body.Email,
        birthDay: req.body.Birthday
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
app.post('/users/:Username/movies/:MovieID',(req,res) => {
  Users.findOneAndUpdate({username: req.params.Username},
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
app.get('/users',(req,res)=> {
  Users.find()
   .then((users) => {
    res.status(201).json(users);
    })
    .catch((err)=>{
      console.error(err);
      res.status(500).send('Error:' + err);
   });
});

//Get one user by username
app.get('/users/:Username', (req,res) => {
  Users.findOne({username : req.params.Username})
  .then((user) => {
    res.json(user);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Get one users by id
app.get('/users/id/:ID', (req,res) => {
  Users.findOne({id : req.params.ID})
  .then((id) => {
    res.json(id);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});


//Get all movie
app.get('/movies', (req,res) => {
  Movies.find()
  .then((movies) => {
    res.json(movies);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Get one movie by Title
app.get('/movies/:Title', (req,res) => {
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
app.get('/Genres/:Genre', (req,res) => {
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
app.get('/movies/director/:name', (req,res) => {
  Movies.find({"director.name" : req.params.name})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Delete User by username
app.delete('/users/:Username', (req,res)=> {
  Users.findOneAndRemove({username: req.params.Username})
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
app.delete('/users/id/:ID', (req,res)=> {
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
app.delete('/users/:Username/movies/:MovieID',(req,res)=>{
  Users.findOneAndUpdate({username: req.params.Username},
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