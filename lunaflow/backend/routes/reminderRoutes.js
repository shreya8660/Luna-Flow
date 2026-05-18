// routes/reminderRoutes.js
const express = require("express");
const router = express.Router();
const { addReminder, getReminders, toggleReminder, deleteReminder } = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(getReminders).post(addReminder);
router.route("/:id/toggle").patch(toggleReminder);
router.route("/:id").delete(deleteReminder);

module.exports = router;
