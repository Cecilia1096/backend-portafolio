require('dotenv').config()
const PORT = process.env.PORT || 5000
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var userRouter = require('./middlewares/user')
var app = express()
const cors = require('cors')
const sanitize = require('express-sanitizer')
const bodyParser = require('body-parser')
require('./database')

app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended:false
    })
)
app.use(sanitize())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/login', userRouter);
app.use("/forgot-password", userRouter);
app.use("/reset-password", userRouter);


app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`)
  })

module.exports = app;

