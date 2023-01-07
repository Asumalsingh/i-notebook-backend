const mongoose = require("mongoose");
const uri = process.env.ATLAS_URI;

const connectDb = async () => {
  try {
   const conn =  await mongoose.connect(uri);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
