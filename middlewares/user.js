var express = require('express')
var router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const user = require("../models/user")


router.post("/register", async (req,res)=> {
  try{
  let {email, password, passwordCheck, displayName} = req.body
  if(!email || !password || !passwordCheck)
    return res
     .status(400)
       .json({msg:"No all fields have been entered."})
  if(password.length < 10)
    return res
     .status(400)
       .json({msg:"The password needs to be at least 10 charactres long."})
  if(password !== passwordCheck)
    return res
      .status(400)
       .json({ msg:"Enter the same password twice for verification."})
  
    const existingUser = await user.findOne({email:email})
    if(existingUser)
      return res
       .status(400)
        .json({msg:"An account with email already exists."})
  
      if(!displayName) displayName = email;
  
       const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt)
  
       const newUser = new user({
        email,
        password:passwordHash,
        displayName
        });
        const savedUser = await newUser.save();
        res.json(savedUser)
        }catch(error){
                res.status(500).json({error:error.message})
        }
        });

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password)
        return res
        .status(400)
         .json({ msg: "Not all fields have been entered." })
  
      const User = await user.findOne({ email: email });
      if (!User)
        return res
          .status(400)
          .json({ msg: "This email account does not exist." })
  
      const isMatch = await bcrypt.compare(password,User.password)
      if (!isMatch)
         return res
         .status(400)
          .json({ msg: "Invalid email or password." });
  
        const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET)
        res.json({
          token,
          user: {
            id: User._id,
            displayName: User.displayName,
            email: User.email,
          },
        });
      } catch (err) {
        res.status(500).json({ error: error.message })
      }
    });
  
  
module.exports = router;