const express = require("express");
const router = express.Router();
const NotesModel = require("../models/NotesModel");
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Get note using get
router.get("/getnote", fetchUser, async (req, res) => {
  const page = parseInt(req.query.page);
  const query = req.query.q;
  const limit = 10;
  try {
    const notes = await NotesModel.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        // filter using query
      ],
    });

    // Pagination
    let totalPage;
    if (notes.length % limit === 0) {
      totalPage = Math.floor(notes.length / limit);
    } else {
      totalPage = Math.floor(notes.length / limit) + 1;
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    res.send({ totalPage, notes: notes.slice(startIndex, endIndex) });
  } catch (error) {
    res.status(500).send("Integernal server error");
  }
});

// Add note using add
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    // this errors handling is for validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;
    try {
      const note = await NotesModel({
        userId: req.user.id,
        title,
        description,
        tag,
      });
      const savedNotes = await note.save();
      res.send(savedNotes);
    } catch (error) {
      res.status(500).send("Integernal server error");
    }
  }
);

// Update an existing note use put
router.put(
  "/updatenote/:id",
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchUser,
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    // this errors handling is for validation
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, description, tag } = req.body;
    // Create a newNote object and add field into it that user updates
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    try {
      // Find the note to be updated
      let note = await NotesModel.findById(req.params.id);
      // if note not exist
      if (!note) return res.status(401).send("Not found");

      // if user is not owener of this note
      if (note.userId.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      // finally update note
      note = await NotesModel.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true } // by using this true note return after update
      );

      res.send(note);
    } catch (error) {
      res.status(500).send("Integernal server error");
    }
  }
);

// Delete an existing note use delete
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    // Find the note to be deleted
    let note = await NotesModel.findById(req.params.id);
    // if note not exist
    if (!note) return res.status(401).send("Not found");

    // if user is not owener of this note
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    // delet note
    note = await NotesModel.findByIdAndDelete(req.params.id);
    res.send(note);
  } catch (error) {
    res.status(500).send("Integernal server error");
  }
});
module.exports = router;
