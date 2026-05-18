// routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const { addNote, getNotes, updateNote, deleteNote } = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(getNotes).post(addNote);
router.route("/:id").put(updateNote).delete(deleteNote);

module.exports = router;
