const port = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');  //ODM (object document mapping) lib
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const loginAndRegisterApi = require('./api/login');
const recordManipulationApi = require('./api/records');

const db = 'mongodb+srv://circularuser:3y3w7sSAsCTeBVQ@circulation.6n7mu.mongodb.net/circ?retryWrites=true&w=majority';

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('DB connection established'))
    .then(app.listen(port))
    .catch((e) => console.log(e));

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

loginAndRegisterApi(app);
recordManipulationApi(app);

// get a list of users
// for testing purpose
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

function isAuthenticated(request) {
    return (request.session.user == null) ? false : true;
}
