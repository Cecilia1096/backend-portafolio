const { Schema, model} = require('mongoose');

const userSchema = new Schema({
  
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    minlength:10  
  },
  displayName:{
    type:String
  },
  resetToken:String,
  expireToken:Date,
},{
    timestamps:true
})

module.exports = model('user', userSchema);
