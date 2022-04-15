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
                birthDate: req.query.birthDate
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

// get a single user by email address
app.get('/users/:email', function(req, res){  
    User.find({email:req.params.email}).then((result) =>{
        if (result != ''){
            res.status(200);
            res.send(result[0]);
        } else {
            res.status(404);
            res.send('No such user');
        }
    })
});

 /*const user = new User({
        email: 'lili@gmail.com',
        firstName: 'Liliia',
        lastName: 'Allans',
        birthDate: '10/12/1900'});*/