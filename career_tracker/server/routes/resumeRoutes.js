const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");

const {
  uploadResume,
  getResumes,
  deleteResume,
} = require("../controllers/resumeController");

// Multer config - Use memory storage to get the buffer for parsing
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
});

router.post("/", auth, upload.single("resume"), uploadResume);
router.get("/", auth, getResumes);
router.delete("/:id", auth, deleteResume);

module.exports = router;
