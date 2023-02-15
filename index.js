require("dotenv").config();
const express = require("express");
let cors = require("cors");
const connectDb = require("./db");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home page");
});

// available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

connectDb().then(() => {
  console.log("db connected");
  app.listen(5000, () => {
    console.log("listening for requests");
  });
});
