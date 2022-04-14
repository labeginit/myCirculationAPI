const port = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const db = '';
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => console.log('DB connection established'))
.then(app.listen(port))
.catch((e) => console.log(e));

const setupRESTapi = require('./rest-api');
setupRESTapi(app);

