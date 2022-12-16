const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  // this userId is like a foreign key
  // it make realation of this table with user table
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
  title: { type: String, require: true },
  description: { type: String },
  tag: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notes", notesSchema);
