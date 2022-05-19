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

const whitelist = ["https://desolate-stream-78141.herokuapp.com"]
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(session({
    secret: "625f088260800ba7daa61038",
    resave: false,
    saveUninitialized: false,
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



