const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createInterview,
  getInterviews,
  deleteInterview,
} = require("../controllers/interviewController");

router.post("/", auth, createInterview);
router.get("/", auth, getInterviews);
router.delete("/:id", auth, deleteInterview);

module.exports = router;
