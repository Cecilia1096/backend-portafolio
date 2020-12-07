
const mongoose = require('mongoose');
const URI = process.env.MONGO_URI

mongoose.connect(URI,{
 useNewUrlParser:true,
 useCreateIndex:true,
 useUnifiedTopology:true,
 useFindAndModify: false
}).then(() =>{
    console.log('BD CONECTADA');

}).catch((err) => console.log("ERROR AL CONECTARSE A LA BASE DE DATOS."));


