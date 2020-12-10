var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const user = require("../models/user");


router.post("/register", async (req,res)=> {
  try{
  let {email, password, passwordCheck, displayName} = req.body;
  
  if(!email || !password || !passwordCheck)
    return res
     .status(400)
       .json({msg:"No all fields have been entered."});
  if(password.length < 10)
    return res
     .status(400)
       .json({msg:"The password needs to be at least 10 charactres long."});
  if(password !== passwordCheck)
    return res
      .status(400)
       .json({ msg:"Enter the same password twice for verification."});
  
    const existingUser = await user.findOne({email:email})
    if(existingUser)
      return res
       .status(400)
        .json({msg:"An account with email already exists."});
  
  if(!displayName) displayName = email;
  
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password,salt);
  
  const newUser = new user({
      email,
      password:passwordHash,
      displayName
  });
  const savedUser = await newUser.save();
  res.json(savedUser);
  }catch(error){
          res.status(500).json({error:error.message});
  }
  });
  

module.exports = router;