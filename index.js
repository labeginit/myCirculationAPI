const port = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');  //ODM (object document mapping) lib

const app = express();

const db = 'mongodb+srv://circularuser:3y3w7sSAsCTeBVQ@circulation.6n7mu.mongodb.net/circ?retryWrites=true&w=majority';

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => console.log('DB connection established'))
.then(app.listen(port))
.catch((e) => console.log(e));

const Record = require('./models/record');
const User = require('./models/user');

app.get('/', (req, res) => {
    res.redirect('/records/:userID');
});

// get a list of users
app.get('/users', function(req, res) { 
    User.find()
    .then((result) => {
        res.status(200);
        res.send(result);
    }).catch((e) => console.log(e));
});

// add a new user with a check for duplicates
app.post('/users', function(req, res) {
    User.find({email:req.query.email}).then((result) =>{
        if (result == ''){
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
app.get('/users/:email', function(req, res){  
    User.find({email:req.params.email, password:req.query.password}).then((result) =>{
        if (result != ''){
            res.status(200);
            res.send(result[0]);
        } else {
            res.status(404);
            res.send('User name of Password is incorrect');
        }
    })
});

// add a new user with a check for duplicates
//localhost:3000/users?email=mail@gmail.com&firstName=Liliia&lastName=Allansson&birthDate=1998-12-10&password=mypass
// response: "62596360a3796f2fb417497b"
app.post('/records', function(req, res) {
    User.find({email:req.query.email}).then((result) =>{
        if (result == ''){
            const user = new Record({
                userID: req.query.userID,
                systolic: req.query.systolic,
                diastolic: req.query.diastolic,
                heartRate: req.query.heartRate,
            });
            
            user.save()
            .then((result) => {
                res.status(200);
                res.send(result);
            })
            .catch((e) => {
            res.status(500)});
        } else {
            res.status(500);
            res.send('User exists');
        }
    })
});