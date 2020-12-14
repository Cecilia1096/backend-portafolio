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

router.post("/tokenisvalid", async (req, res) => {
      try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
    
        const User = await user.findById(verified.id);
        if (!User) return res.json(false);
    
        return res.json(true);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    
router.post('/forgot-password', (req,res)=>{
      crypto.randomBytes(32,(err,buffer)=> {
          if(err){
              console.log(err)
          }
          const token = buffer.toString("hex")
          user.findOne({email:req.body.email})
          .then(User => {
             if(!User){
                return res.status(422).json({error:"There is no user with this email"})
             }
           User.resetToken = token
           User.expireToken = Date.now() + 60000
           User.save().then((result)=>{
               const data = {
                 to:User.email,
                 from:"no-replay@clickit.com",
                 subject:"Restablecimiento de contraseña",
                 html:`
                 <p>Solicitaste restablecer tu contraseña,</p>
                 <h5>click here:<a href="http://localhost:3000/reset-password/${token}">link</a>to reset password</h5>
                 `
               }
               mg.messages().send(data, function (error,body){
                  if(error){
                    return res.json({error:"Link error when resetting password"})
                  }
               })
               res.json({message:"Check your email"})
           })
          })
      })
 })
 
router.post('/reset-password',(req,res) => {
   const newPassword = req.body.password
   const sentToken = req.body.token
   user.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
   .then(User=>{
       if(!User){
           return res.status(422).json({error:"Please try again, session expired"})
       }
       bcrypt.hash(newPassword,12).then(hashedpassword=>{
          User.password = hashedpassword
          User.resetToken = undefined
          User.expireToken = undefined
          User.save().then((saveduser)=>{
              res.json({message:"Password updated successfully"})
          })
       })
   }).catch(err=>{
       console.log(err)
   })
 })
  
  
module.exports = router;