
const mongoose = require('mongoose');
const URI = process.env.MONGO_URI

mongoose.connect(URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
  mongoose.Promise = global.Promise
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB connection error: '))


