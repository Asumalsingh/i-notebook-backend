const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fetchUser = require("../middleware/fetchuser");

// Create a user using post : "api/auth/createuser" . no login required
router.post(
  "/createuser",
  [
    body("name", "Name should contains at least 3 letters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password should contains 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    // this errors handling is for validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check whether user exist or not
      let user = await UserModel.findOne({ email: req.body.email });
      // if user exist, then send a bad request
      if (user) {
        return res.status(500).send({ success, error: "Email already exist" });
      }

      // password hashing
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);

      // Otherwise create new user
      user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      await user.save();

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      // this error handling if for unique email
      res.send({ errorMessage: error.message });
    }
  }
);

// Authenticate a user using post : "api/auth/login" . no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cann't be null").isLength({ min: 1 }),
  ],
  async (req, res) => {
    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    // this errors handling is for validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // check whether user exist or not
      let user = await UserModel.findOne({ email });
      // if user not exist, then send a bad request
      if (!user) {
        return res.status(400).json({
          success,
          error: "please try to login with correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log(passwordCompare);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "please try to login  with correct credentials",
        });
      }

      // if use exist
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Enternal server error");
    }
  }
);

// get user using post : "api/auth/getuser" . no login required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    //                                     by doint .select("-password") we exclude password
    const user = await UserModel.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    // console.log(error.message);
    res.status(500).send("Integernal server error");
  }
});

module.exports = router;
