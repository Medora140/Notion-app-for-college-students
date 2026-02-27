const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createProblem,
  getProblems,
  deleteProblem,
} = require("../controllers/dsaController");

router.post("/", auth, createProblem);
router.get("/", auth, getProblems);
router.delete("/:id", auth, deleteProblem);

module.exports = router;
