require('dotenv').config()
const PORT = process.env.PORT || 5000
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const userRouter = require('./middlewares/user')
const cors = require('cors')
const sanitize = require('express-sanitizer')
const bodyParser = require('body-parser')
require('./database')
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(sanitize())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/api/login', userRouter)
app.post('/api/register', userRouter)
app.post('/api/tokenisvalid', userRouter)
app.post('/api/forgot-password', userRouter)
app.post('/api/reset-password', userRouter)

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`)
})

module.exports = app
