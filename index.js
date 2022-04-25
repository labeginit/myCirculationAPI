const port = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');  //ODM (object document mapping) lib
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

const db = 'mongodb+srv://circularuser:3y3w7sSAsCTeBVQ@circulation.6n7mu.mongodb.net/circ?retryWrites=true&w=majority';
const saltRounds = 8;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('DB connection established'))
    .then(app.listen(port))
    .catch((e) => console.log(e));

const Record = require('./models/record');
const User = require('./models/user');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: "625f088260800ba7daa61038",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto' }
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((_error, req, res, next) => {
    if (_error) {
        let result = {
            error: _error + ''
        };
        res.json(result);
    }
    else {
        next();
    }
});

// End points
app.get('/', (req, res) => {
    res.status(404);
    res.send({ error: 'No default root available' });
});

// get a list of users
// for testing purpose, not supposed to be released in production
app.get('/users', function (req, res) {
    if (isAuthenticated(req)) {
        User.find()
            .then((result) => {
                res.status(200);
                res.send(result);
            }).catch((e) => {
                res.status(500);
                res.send(e);
            });
    } else {
        res.status(401);
        res.send({ error: "Unauthorized" });
    }
});

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

// adds a record for a specified user ID. All properties are required
//POST https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b
app.post('/records/:userID', function (req, res) {
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
                                let age = Math.round(Math.floor(postDate - birth) / (1000 * 60 * 60 * 24 * 365));
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
                        res.send({ error: e });
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
app.get('/records/:userID', function (req, res) {
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
app.delete('/records/:userID', function (req, res) {
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


function encryptAndSave(user, res) {
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        user.password = hash;

        user.save()
            .then((result) => {
                res.status(200);
                res.send({ _id: result._id });   // it didnt work to delete the password from the object, hence sending only the object id
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
