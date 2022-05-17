const express = require('express');
const router = express.Router();
const Record = require('../models/record');
const User = require('../models/user');
const hlp = require('../helper');

// adds a record for a specified user ID. All properties are required
//POST https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b
router.post('/:userID', function (req, res) {
  // we want to make sure the user can only create his/her own records
  //if (hlp.isAuthenticated(req) && (req.params.userID == req.session.user._id)) {
  let record = new Record(req.body);
  record.userID = req.params.userID;
  record.validate(function (err) {  // validate the record object before sending it to MongoDB
    if (err) {
      res.status(500);
      res.json({ error: err });
    }
    else {
      record.save()
        .then((result) => {
          res.status(200);
          //calculate the age of user and answer how good the health condition is
          User.findById(req.params.userID).then((result2) => {
            if (result2 != null) {
              const birth = new Date(result2.birthDate);
              const postDate = result.createdAt;
              const age = Math.round(Math.floor(postDate - birth) / (1000 * 60 * 60 * 24 * 365));

              res.send({
                _id: result._id,
                verdict: hlp.estimateRisk(age, req.body.systolic, req.body.diastolic)
              });
            } else {
              res.status(404);
              res.send({ error: 'User does not exist' });
            }
          })
        })
        .catch((e) => {
          res.status(500);
          res.send({ error: 'Something went wrong ' + e });
        });
    }
  })
  /* } else {
     res.status(401);
     res.send({ error: "Unauthorized" });
   }*/
});


// get a list of records by user ID
//GET https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b
router.get('/:userID', function (req, res) {
  // we want to make sure the user can only view his/her own records
  //if (hlp.isAuthenticated(req) && (req.params.userID == req.session.user._id)) {
  Record.find({ userID: req.params.userID }).then((result) => {
    if ((result != '') && (result != null)) {
      res.status(200);
      res.send(result);
    } else {
      res.status(200);
      res.send({ error: 'No records found' });
    }
  })
  /*  } else {
      res.status(401);
      res.send({ error: "Unauthorized" });
    }*/
});

// get a list of records by user ID
//GET https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b + object ({"_id": "625ff7cad615a9120d648300"})
router.delete('/:userID', function (req, res) {
  // we want to make sure the user can only delete his/her own records
  //if (hlp.isAuthenticated(req) && (req.params.userID == req.session.user._id)) {
  Record.findByIdAndDelete(req.body._id).then((result) => {
    res.status(200);
    res.send(result);
  })
  /* } else {
     res.status(401);
     res.send({ error: "Unauthorized" });
   }*/
});



module.exports = router;
