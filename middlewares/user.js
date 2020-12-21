const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.post(
  'https://me-portfolio-api.herokuapp.com/register',
  async (req, res) => {
    try {
      let { email, password, passwordCheck, displayName } = req.body
      if (!email || !password || !passwordCheck)
        return res.status(400).json({ msg: 'No all fields have been entered.' })
      if (password.length < 10)
        return res
          .status(400)
          .json({
            msg: 'The password needs to be at least 10 charactres long.'
          })
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
  }
)

router.post(
  'https://me-portfolio-api.herokuapp.com/login',
  async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password)
        return res
          .status(400)
          .json({ msg: 'Not all fields have been entered.' })

      const user = await User.findOne({ email: email })
      if (!user)
        return res
          .status(400)
          .json({ msg: 'This email account does not exist.' })

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
  }
)

router.post(
  'https://me-portfolio-api.herokuapp.com/tokenisvalid',
  async (req, res) => {
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
  }
)

module.exports = router
