// This file needs to be double checked

//start work on 2.10  Authentication
// const { join } = require('lodash');

// const express = require('express');
// const res = require('express/lib/response');
// const { v4 } = require('uuid');
// const app = express();
// const bodyParser = require('body-parser');
// const uuid = require('uuid');
// const { check, validationResult } = require('express-validator');

// const mongoose = require('mongoose');
// const Models = require('./models.js');
// //const { update } = require('lodash');



// const Movies = Models.Movie;
// const Users = Models.User;


// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static("public")); // serve static files
// //app.use(morgan("common")); // log requests to terminal

// const passport = require('passport');
// require('./passport');

// app.use(passport.initialize());

// const cors = require('cors');
// app.use(cors());
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         let message = ' The CORS policy for this app does not allow access from origin' + origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     }
//   }));


// //Old connect
// mongoose.connect('mongodb://localhost:27017/szaFlix', { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log('connected to db'))
// .catch( (err) => console.log(err));

// //mongodb+srv://sza:test123@runflix.khvbcgv.mongodb.net/szaFlixDB/?retryWrites=true&w=majority

// //NEW COONECT 
// // mongoose.connect('process.env.CONNECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('connected to db'))
// //   .catch( (err) => console.log(err));

// app.get('/', (req, res) => {
//   res.send('<h1>Hello Movies server  </h1>')
// })

// //GET - documentation.html
// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname });
// });


// //Secret Url
// app.get('/secretUrl', (req, res) => {
//   let responseText = 'Welcome to secrete URL';
//   let requestTime = Date.now();
//   responseText += '<small>Requested at: ' + req.requestTime + '<small>';
//   res.send(responseText);
// });

// //Add - Create user
// /* We’ll expect JSON in this format
// {
//   id: Integer,
//   name: String,
//   password: String,
//   email: String,
//   birthday: Date,
//   favmovies: [String]
// }*/
// app.post('/users',
//   [
//     check('username', 'Username is required').isLength({ min: 5 }),
//     check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
//     check('password', 'Password is required').not().isEmpty(),
//     check('email', 'Email does not appear to be valid').isEmail()
//   ], passport.authenticate('jwt', { session: false }), (req, res) => {
//     let errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ errors: errors() });
//     }
//     let hashedPassword = Users.hashPassword(req.body.password);
//     Users.findOne({ username: req.body.USERNAME })
//       .then((user) => {
//         if ((user)) {
//           console.log(user, 'userID', user.id);
//           return res.status(401).send(req.body.USERNAME + ' already exists')
//         } else {
//           Users
//             .create({
//               username: req.body.USERNAME,
//               password: req.body.hashedPassword,
//               id: req.body.id,
//               email: req.body.email,
//               birthDay: req.body.birthDay
//             })
//             //callback takes document created as a parameter 
//             .then((user) => { res.status(201).json(user) })
//             .catch((error) => {
//               console.error(error);
//               res.status(500).send('Error' + error);
//             })
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         res.status(500).send('Error    ' + error);
//       });
//   });

// //Add - Create Movie is OK 
// app.post('/movies/add', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Movies.findOne({ Title: req.body.Title })
//     .then((movie) => {
//       if ((movie)) {
//         console.log(movie, 'Title');
//         return res.status(401).send(req.body.Title + ' already exists')
//       } else {
//         Movies
//           .create({
//             Title: req.body.Title,
//             Year: req.body.Year,
//             Rated: req.body.Rated,
//             Runtime: req.body.Runtime,
//             Plot: req.body.Plot,
//             Awards: req.body.Awards
//           })
//           //callback takes document created as a parameter 
//           .then((movie) => { res.status(201).json(movie) })
//           .catch((error) => {
//             console.error(error);
//             res.status(500).send('Error' + error);
//           })
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send('Error    ' + error);
//     });
// });


// //Update USER by username
// app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOneAndUpdate({ username: req.params.Username },
//     {
//       $set:
//       {
//         id: req.body.id,
//         username: req.body.username,
//         password: req.body.Password,
//         email: req.body.Email,
//         birthDay: req.body.Birthday
//       }
//     },
//     { new: true }, // This line makes sure that the updated document is returned
//     (err, updateUser) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error ' + err);
//       } else {
//         res.json(updateUser);
//       }
//     });
// });

// // Add a movie to a user's list of favorites
// app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOneAndUpdate({ username: req.params.Username },
//     {
//       $push:
//         { favmovies: req.params.MovieID }
//     },
//     { new: true },
//     (err, updatedUser) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error' + err);
//       } else {
//         res.json(updatedUser);
//       }
//     });
// });


// // Get all users
// app.get('/users', (req, res) => {
//   Users.find()
//     .then((users) => {
//       res.status(201).json(users);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error:' + err);
//     });
// });

// //Get one user by username
// app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOne({ username: req.params.Username })
//     .then((user) => {
//       res.json(user);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error' + err);
//     });
// });

// //Get one users by id
// app.get('/users/id/:ID', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOne({ id: req.params.ID })
//     .then((id) => {
//       res.json(id);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error' + err);
//     });
// });


// //Get all movies
// app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Movies.find()
//     .then((Movies) => {
//       res.json(Movies);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error' + err);
//     });
// });

// //Get one movie by Title
// app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Movies.findOne({ Title: req.params.Title })
//     .then((title) => {
//       res.json(title);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error' + err);
//     });
// });

// //Get all movies by Genre
// app.get('/Genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Movies.find({ "Genre.name": req.params.Genre })
//     .then((movie) => {
//       res.json(movie);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error' + err);
//     });
// });


// //Get all movies by Director Name - test 
// //Title:req.params.title
// app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Movies.find({ "director.name": req.params.name }).select({ Title: 1, Plot: 1, _id: 1,"director.name" :1  })
//     .then((movie) => {
//       res.json(movie);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error' + err);
//     });
// });

// //Delete User by username
// app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOneAndRemove({ username: req.params.Username })
//     .then((user) => {
//       if (!user) {
//         res.status(400).send(req.params.Username + 'Username not found');
//       } else {
//         res.status(200).send(req.params.Username + 'was deleted');
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('error' + err);
//     });
// });

// //Delete User by id
// app.delete('/users/id/:ID', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOneAndRemove({ id: req.params.ID })
//     .then((id) => {
//       if (!id) {
//         res.status(400).send(req.params.ID + 'id not found');
//       } else {
//         res.status(200).send(req.params.ID + 'id was deleted');
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('error' + err);
//     });
// });

// //Delete favmovies 
// app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOneAndUpdate({ username: req.params.Username },
//     { $pull: { favmovies: req.params.MovieID } },
//     { new: true },
//     (err, updatedUser) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error' + err);
//       } else {
//         res.json(updatedUser);
//       }
//     });
// });

// //localport disabled
// app.listen(8080, () => console.log('listening on 8080'));   

// // const port = process.env.PORT || 8080;
// // app.listen(port, '0.0.0.0', () => {
// //   console.log('Listening on Port ' + port);
// // });

