const mongoose = require('mongoose')

const { MONGODB_ATLAS_URI } = process.env

exports.connect = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(MONGODB_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {})
  .catch((err) => {
    console.log(`DB connection FAILED`);
    console.log(err);
    process.exit(1)
  })
}