const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.ATLAS_URI;
console.log(uri);

const connectDb = async () => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
