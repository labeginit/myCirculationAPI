const express = require('express');
const router = express.Router();
const Record = require('../models/record');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 8;

// adds a record for a specified user ID. All properties are required
//POST https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b
router.post('/:userID', function (req, res) {

  console.log(req.params.userID == req.session.user._id);

  // we want to make sure the user can only create his/her own records
  if (isAuthenticated(req) && (req.params.userID == req.session.user._id)) {
    const record = new Record(req.body);
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
                  _id: result2._id,
                  verdict: estimateRisk(age, req.body.systolic, req.body.diastolic)
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
  } else {
    res.status(401);
    res.send({ error: "Unauthorized" });
  }
});


// get a list of records by user ID
//GET https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b
router.get('/:userID', function (req, res) {
  // we want to make sure the user can only view his/her own records
  if (isAuthenticated(req) && (req.params.userID == req.session.user._id)) {
    Record.find({ userID: req.params.userID }).then((result) => {
      if (result != '') {
        res.status(200);
        res.send(result);
      } else {
        res.status(404);
        res.send({ error: 'No records found' });
      }
    })
  } else {
    res.status(401);
    res.send({ error: "Unauthorized" });
  }
});

// get a list of records by user ID
//GET https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b + object ({"_id": "625ff7cad615a9120d648300"})
router.delete('/:userID', function (req, res) {
  // we want to make sure the user can only delete his/her own records
  if (isAuthenticated(req) && (req.params.userID == req.session.user._id)) {
    Record.findByIdAndDelete(req.body._id).then((result) => {
      res.status(200);
      res.send(result);
    })
  } else {
    res.status(401);
    res.send({ error: "Unauthorized" });
  }
});

// Analysis is based on data from https://pressbooks.library.ryerson.ca/vitalsign/chapter/blood-pressure-ranges/
function estimateRisk(age, systolic, diastolic) {
  let verdict = 'Your preassure is ubnormal. Try to calm down and test again.';
  if ((2 < age) && (age <= 13)) {
    if (((80 <= systolic) && (systolic <= 120)) && ((40 <= diastolic) && (diastolic <= 80))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 125) || (diastolic > 85)) {
      verdict = 'You might need to contact a doctor';
    }
  }
  else if ((13 < age) && (age <= 18)) {
    if (((90 <= systolic) && (systolic <= 120)) && ((50 <= diastolic) && (diastolic <= 80))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 125) || (diastolic > 85)) {
      verdict = 'You might need to contact a doctor';
    }
  }
  else if (age <= 40) {
    if ((95 <= systolic) && (systolic <= 135) && (60 <= diastolic) && (diastolic <= 80)) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 140) || (diastolic > 85)) {
      verdict = 'You might need to contact a doctor';
    }
  }
  else if (age <= 60) {
    if (((110 <= systolic) && (systolic <= 145)) && ((70 <= diastolic) && (diastolic <= 90))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 145) || (diastolic > 90)) {
      verdict = 'You might need to call an ambulance';
    }
  }
  else if (age <= 130) {
    if (((95 <= systolic) && (systolic <= 145)) && ((70 <= diastolic) && (diastolic <= 90))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 145) || (diastolic > 90)) {
      verdict = 'You might need to call an ambulance';
    }
  }
  return verdict;
}

function isAuthenticated(request) {
  return (request.session.user == null) ? false : true;
}

module.exports = router;
