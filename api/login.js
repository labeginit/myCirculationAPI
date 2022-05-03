const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const hlp = require('../helper');

// get a single user by email address and password
// POST https://obscure-bayou-38424.herokuapp.com/login
router.post('/', function (req, res) {
  if (req.session.user == null) {
    User.findOne({ email: req.body.email }).then((result) => {
      if ((result != '') && (result != null)) {
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
router.get('/', function (req, res) {
  // if (hlp.isAuthenticated(req)) {
  res.status(200);
  res.send(req.session.user || { error: 'Not logged in' });
  /*  } else {
      res.status(401);
      res.send({ error: "Unauthorized" });
    }*/
});

//log out the user
//DELETE https://obscure-bayou-38424.herokuapp.com/login
router.delete('/', function (req, res) {
  //  if (hlp.isAuthenticated(req)) {
  delete req.session.user;
  res.status(200);
  res.send({ status: 'Logged out' });
  /*  } else {
      res.status(401);
      res.send({ error: "Unauthorized" });
    }*/
});

module.exports = router;