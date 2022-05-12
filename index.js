const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
const mongoose = require('mongoose');  //ODM (object document mapping) lib
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const recordsRoute = require('./api/records');
const rootRoute = require('./api/root');
const loginRoute = require('./api/login');

require('dotenv/config');
DB_URL = 'mongodb+srv://circularuser:3y3w7sSAsCTeBVQ@circulation.6n7mu.mongodb.net/circ?retryWrites=true&w=majority'

mongoose.connect(DB_URL, { useUnifiedTopology: true })
    .then((result) => console.log('DB connection established'))
    .then(app.listen(port))
    .catch((e) => console.log(e));

app.use(express.json());
//app.use(cors());
app.use(
    cors({
        //      origin: "https://calm-badlands-26710.herokuapp.com",
        credentials: true
    })
);
app.use(cookieParser());
app.use(session({
    secret: "625f088260800ba7daa61038",
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: 'auto' }  // do not change to anything else! Session stops working
    /*   cookie: {
           maxAge: 24 * 1000 * 60 * 60,
           sameSite: 'none',
           secure: true
       },*/
    store: MongoStore.create({
        mongoUrl: DB_URL,
        ttl: 24 * 3600,  // 1 day
        touchAfter: 24 * 3600,
        autoRemove: 'native'
    })
})
);

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



