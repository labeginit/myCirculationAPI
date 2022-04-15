const port = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');  //ODM (object document mapping) lib

const app = express();

const db = 'mongodb+srv://circularuser:3y3w7sSAsCTeBVQ@circulation.6n7mu.mongodb.net/circ?retryWrites=true&w=majority';

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('DB connection established'))
    .then(app.listen(port))
    .catch((e) => console.log(e));

const Record = require('./models/record');
const User = require('./models/user');

app.get('/', (req, res) => {
    res.status(404);
    res.send('Page does not exist');
});

// get a list of users
app.get('/users', function (req, res) {
    User.find()
        .then((result) => {
            res.status(200);
            res.send(result);
        }).catch((e) => console.log(e));
});

// add a new user with a check for duplicates
//localhost:3000/users?email=mail@gmail.com&firstName=Liliia&lastName=Allansson&birthDate=1998-12-10&password=mypass
// response: "62596360a3796f2fb417497b"
app.post('/users', function (req, res) {
    User.find({ email: req.query.email }).then((result) => {
        if (result == '') {
            const user = new User({
                email: req.query.email,
                firstName: req.query.firstName,
                lastName: req.query.lastName,
                birthDate: req.query.birthDate,
                password: req.query.password
            });

            user.save()
                .then((result) => {
                    res.status(200);
                    res.send(result._id);   // it didnt work to delete the password from the object, hence sending only the object id
                })
                .catch((e) => {
                    res.status(500);
                    res.send(e);
                });
        } else {
            res.status(500);
            res.send('User exists');
        }
    })
});

// get a single user by email address and password
// localhost:3000/users/liliyameister@gmail.com?password=mypass
app.get('/users/:email', function (req, res) {
    User.find({ email: req.params.email, password: req.query.password }).then((result) => {
        if (result != '') {
            res.status(200);
            res.send(result[0]);
        } else {
            res.status(404);
            res.send('User name or Password is incorrect');
        }
    })
});


// adds a record for a specified user ID. All properties are required
//localhost:3000/records/62596360a3796f2fb417497b?systolic=60&diastolic=90&heartRate=65
app.post('/records/:userID', function (req, res) {
    const record = new Record({
        userID: req.params.userID,
        systolic: req.query.systolic,
        diastolic: req.query.diastolic,
        heartRate: req.query.heartRate,
    });

    record.save()
        .then((result) => {
            res.status(200);
            //calculate the age of user and answer how good the health condition is
            User.findById(req.params.userID).then((result2) => {
                if (result2 != null) {
                    console.log(result2);
                    const birth = new Date(result2.birthDate);
                    const postDate = result.createdAt;
                    let age = Math.round(Math.floor(postDate - birth) / (1000 * 60 * 60 * 24 * 365));
                    res.send(estimateRisk(age, req.query.systolic, req.query.diastolic));
                } else {
                    res.status(404);
                    res.send('User does not exist');
                }
            })
        })
        .catch((e) => {
            res.status(500)
        });
});

// get a list of records by user ID
//localhost:3000/records/62596360a3796f2fb417497b
app.get('/records/:userID', function (req, res) {
    Record.find({ userID: req.params.userID }).then((result) => {
        if (result != '') {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);
            res.send('No records found');
        }
    })
});

// Source https://pressbooks.library.ryerson.ca/vitalsign/chapter/blood-pressure-ranges/
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