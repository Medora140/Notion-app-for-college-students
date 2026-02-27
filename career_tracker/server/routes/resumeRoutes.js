const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");

const {
  uploadResume,
  getResumes,
  deleteResume,
} = require("../controllers/resumeController");

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", auth, upload.single("resume"), uploadResume);
router.get("/", auth, getResumes);
router.delete("/:id", auth, deleteResume);

module.exports = router;
