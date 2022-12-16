const express = require("express");
var cors = require("cors");
require("./db");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home page");
});

// available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(5000, () => {
  console.log("Running on port 5000...");
});
