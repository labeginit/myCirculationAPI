const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
const mongoose = require('mongoose');  //ODM (object document mapping) lib
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const recordsRoute = require('./api/records');
const rootRoute = require('./api/root');
const loginRoute = require('./api/login');

require('dotenv/config');

mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true })
    .then((result) => console.log('DB connection established'))
    .then(app.listen(port))
    .catch((e) => console.log(e));

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: "625f088260800ba7daa61038",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto' }  // do not change to anything else! Session stops working
}));

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

app.use('/', rootRoute);  // roots to '/', '/register', '/users'
app.use('/records', recordsRoute);
app.use('/login', loginRoute);



