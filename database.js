const mongoose = require('mongoose')
const URI = process.env.MONGO_URI

mongoose
  .connect(URI, {
    dbName: 'portafolio',
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB is connected')
  })
  .catch((error) => {
    console.log(error)
  })
