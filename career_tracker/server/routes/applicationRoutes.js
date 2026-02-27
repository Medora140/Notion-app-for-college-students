const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

router.post("/", auth, createApplication);
router.get("/", auth, getApplications);
router.put("/:id", auth, updateApplication);
router.delete("/:id", auth, deleteApplication);

module.exports = router;
