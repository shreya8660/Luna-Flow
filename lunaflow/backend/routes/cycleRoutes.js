// routes/cycleRoutes.js
const express = require("express");
const router = express.Router();
const { addCycle, getCycles, getCycleById, updateCycle, deleteCycle } = require("../controllers/cycleController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All cycle routes require auth

router.route("/").get(getCycles).post(addCycle);
router.route("/:id").get(getCycleById).put(updateCycle).delete(deleteCycle);

module.exports = router;
