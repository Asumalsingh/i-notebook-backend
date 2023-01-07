const mongoose = require("mongoose");

const d = new Date();
const hour = d.getHours();
const min = d.getMinutes();
const day = d.getDate();
const month = d.toLocaleString("default", { month: "long" }).substring(0, 3);

const time =
  (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min);

const date = (day < 10 ? "0" + day : day) + " " + month + "," + d.getFullYear();

const notesSchema = new mongoose.Schema({
  // this userId is like a foreign key
  // it make realation of this table with user table
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: { type: String, require: true },
  description: { type: String },
  tag: { type: String },
  date: { type: String, default: time + " | " + date },
  sharedWith: [{}],
});

module.exports = mongoose.model("notes", notesSchema);
