const express = require("express");
const router = express.Router();
const { analyzeResumeAI } = require("../controllers/resumeAIController");

router.post("/analyze-ai", analyzeResumeAI);

module.exports = router;
