const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const mailgun = require('mailgun-js')
const DOMAIN = 'sandboxdc3fcece8fe7470b9493d6a7aa7b3da0.mailgun.org'
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN })

router.post('/register', async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: 'No all fields have been entered.' })
    if (password.length < 10)
      return res
        .status(400)
        .json({ msg: 'The password needs to be at least 10 charactres long.' })
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: 'Enter the same password twice for verification.' })

    const existingUser = await User.findOne({ email: email })
    if (existingUser)
      return res
        .status(400)
        .json({ msg: 'An account with email already exists.' })

    if (!displayName) displayName = email

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
      email,
      password: passwordHash,
      displayName
    })
    const savedUser = await newUser.save()
    res.json(savedUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ msg: 'Not all fields have been entered.' })

    const user = await User.findOne({ email: email })
    if (!user)
      return res.status(400).json({ msg: 'This email account does not exist.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid email or password.' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/tokenisvalid', async (req, res) => {
  try {
    const token = req.header('x-auth-token')
    if (!token) return res.json(false)

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (!verified) return res.json(false)

    const user = await User.findById(verified.id)
    if (!user) return res.json(false)

    return res.json(true)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/forgot-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: 'There is no user with this email' })
      }
      user.resetToken = token
      user.expireToken = Date.now() + 60000
      user.save().then((result) => {
        const data = {
          to: user.email,
          from: 'no-replay@clickit.com',
          subject: 'Restablecimiento de contraseña',
          html: `
                 <p>Solicitaste restablecer tu contraseña,</p>
                 <h5>click here:<a href="http://localhost:3000/reset-password/${token}">link</a>to reset password</h5>
                 `
        }
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({ error: 'Link error when resetting password' })
          }
        })
        res.json({ message: 'Check your email' })
      })
    })
  })
})

router.post('/reset-password', (req, res) => {
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: 'Please try again, session expired' })
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then((saveduser) => {
          res.json({ message: 'Password updated successfully' })
        })
      })
    })
    .catch((error) => {
      console.log(error)
    })
})

module.exports = router
