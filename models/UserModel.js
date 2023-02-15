const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: [true, "Email already exist"] },
  password: { type: String, require: true },
  googleId: { type: String },
  emailVerified: { type: Boolean, default: false },
  picture: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("users", userSchema);
