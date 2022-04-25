const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 8;
module.exports = function loginAndRegisterApi(app) {

  //add a new user with password scrumble
  //axios.post('https://obscure-bayou-38424.herokuapp.com/users', user)
  // response: "62596360a3796f2fb417497b"
  app.post('/register', function (req, res) {
    let user = new User(req.body);
    user.validate(function (err) {  // validate the user object before sending it to MongoDB
      if (err) {
        res.status(500);
        res.json({ error: err });
      }
      else {
        User.find({ email: user.email }).then((result) => {
          if ((result == '') || (result == null)) {
            // hash the password, replace password in the object with its hashed value, save it in the DB
            encryptAndSave(user, res);
          } else {
            res.status(200);
            res.json({ error: 'User exists' });
          }
        })
      }
    });
  });

  // get a single user by email address and password
  // POST https://obscure-bayou-38424.herokuapp.com/login
  app.post('/login', function (req, res) {
    if (req.session.user == null) {
      User.findOne({ email: req.body.email }).then((result) => {
        if (result != '') {
          bcrypt.compare(req.body.password, result.password, function (err, result2) {
            if (result2 == true) {
              delete result.password; // deletion does not work
              result.password = '';
              req.session.user = result;  // saving the user info into the session
              res.status(200);
              res.send(result);
            } else {
              res.status(404);
              res.send({ error: 'User name or Password is incorrect' });
            }
          });
        } else {
          res.status(404);
          res.send({ error: 'User name or Password is incorrect' });
        }
      })
    } else {
      res.send({ error: "Already logged in" });
    }
  });

  // sends the object of the current logged in user or an error
  //GET https://obscure-bayou-38424.herokuapp.com/login
  app.get('/login', function (req, res) {
    if (isAuthenticated(req)) {
      res.status(200);
      res.send(req.session.user || { error: 'Not logged in' });
    } else {
      res.status(401);
      res.send({ error: "Unauthorized" });
    }
  });

  //log out the user
  //DELETE https://obscure-bayou-38424.herokuapp.com/login
  app.delete('/login', function (req, res) {
    if (isAuthenticated(req)) {
      delete req.session.user;
      res.status(200);
      res.send({ status: 'Logged out' });
    } else {
      res.status(401);
      res.send({ error: "Unauthorized" });
    }
  });

  function encryptAndSave(user, res) {
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      user.password = hash;

      user.save()
        .then((result) => {
          res.status(200);
          res.send({ _id: result._id });
        })
        .catch((e) => {
          res.status(500);
          res.send({ error: "Something went wrong" });
        });
    });
  }

  function isAuthenticated(request) {
    return (request.session.user == null) ? false : true;
  }
}