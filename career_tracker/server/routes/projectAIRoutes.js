const express = require("express");
const router = express.Router();
const { generateText } = require("../services/ollamaService");

router.post("/projects", async (req, res) => {
  const { role } = req.body;
  console.log("Project route hit");
  console.log("Role received:", role);

  const prompt = `
Suggest 5 strong portfolio projects for a ${role}.
Each project should:
- Be practical
- Be resume-worthy
- Include modern technologies

Respond ONLY in bullet points.
`;

  try {
    console.log("Sending request to Ollama...");
    const reply = await generateText(prompt);
    console.log("Ollama responded");
    res.json({ reply });
  } catch (error) {
    console.error("Project AI error:", error.message);
    res.status(500).json({
      reply: "Project generation failed.",
    });
  }
});

module.exports = router;
