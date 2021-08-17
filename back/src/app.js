const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const favicon = require('serve-favicon');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
 
const IS_PRODUCTION = app.get('env') === 'production';

if (IS_PRODUCTION) {
    app.set('trust proxy', 1)
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: 'keyboard cat',
    cookie: { secure: IS_PRODUCTION },
    resave: true,
    saveUninitialized: true
}))

module.exports = app;