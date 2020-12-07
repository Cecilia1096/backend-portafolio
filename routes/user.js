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
       .json({msg:"No se han introducido todos los campos."});
  if(password.length < 10)
    return res
     .status(400)
       .json({msg:"La contraseña debe tener al menos 10 caracteres."});
  if(password !== passwordCheck)
    return res
      .status(400)
       .json({ msg:"Ingrese la misma contraseña dos veces para verificación."});
  
    const existingUser = await user.findOne({email:email})
    if(existingUser)
      return res
       .status(400)
        .json({msg:"Ya existe una cuenta con correo electrónico."});
  
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
          res.status(500).json({error:err.message});
  }
  });






module.exports = router;


