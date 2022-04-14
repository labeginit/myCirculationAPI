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

app.get('/users', function(req, res) { 
    User.find()
    .then((result) => {
        res.status(200);
        res.send(result);
    }).catch((e) => console.log(e));
});

app.post('/users', function(req, res) {
    const user = new User({
        email: req.query.email,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        birthDate: req.query.birthDate
    });
    user.save()
    .then((result) => {res.status(200)})
    .catch((e) => {
    console.log;
    res.status(500)});
})

 /*const user = new User({
        email: 'lili@gmail.com',
        firstName: 'Liliia',
        lastName: 'Allans',
        birthDate: '10/12/1900'});*/