require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter = require('./middlewares/user');
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended:false
    })
)


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', userRouter);


module.exports = app;

