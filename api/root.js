const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Record = require('../models/record');
const bcrypt = require('bcrypt');
const saltRounds = 8;
const hlp = require('../helper');

// End points
router.get('/', (req, res) => {
  res.status(404);
  res.send({ error: 'No default root available' });
});

//add a new user with password scrumble
//axios.post('https://obscure-bayou-38424.herokuapp.com/users', user)
// response: "62596360a3796f2fb417497b"
router.post('/register', function (req, res) {
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

// get a list of users
// for testing purpose
router.get('/users', function (req, res) {
  //if (hlp.isAuthenticated(req)) {
  User.find()
    .then((result) => {
      res.status(200);
      res.send(result);
    }).catch((e) => {
      res.status(500);
      res.send(e);
    });
  /* } else {
     res.status(401);
     res.send({ error: "Unauthorized" });
   }*/
});

router.get('/stats/:userID', function (req, res) {
  // if (hlp.isAuthenticated(req)) {
  let totalRecordsCount;
  let userRecordsCount;
  Record.find().then((result) => {
    totalRecordsCount = result.length;
    Record.find({ userID: req.params.userID }).then((result) => {
      userRecordsCount = result.length;
      res.send({ totalRecordsCount, userRecordsCount });
    })
  })
  /* } else {
     res.status(401);
     res.send({ error: "Unauthorized" });
   }*/
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

module.exports = router;