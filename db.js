const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.ATLAS_URI;
console.log(uri);

mongoose.connect(uri);
