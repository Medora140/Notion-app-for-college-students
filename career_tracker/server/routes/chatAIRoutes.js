const express = require("express");
const router = express.Router();

const {
  chatWithAI,
  streamChatWithAI,
  rewriteSentence,
  generateInterviewQuestions,
} = require("../controllers/chatAIController");

router.post("/chat", chatWithAI);          // normal JSON
router.post("/chat-stream", streamChatWithAI); // streaming
router.post("/rewrite", rewriteSentence);
router.post("/interview-stream", generateInterviewQuestions); // streaming

module.exports = router;
