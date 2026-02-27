console.log("resumeAIController loaded");

const axios = require("axios");

const analyzeResumeAI = async (req, res) => {
  const { text, role } = req.body;

  if (!text) {
    return res.status(400).json({ message: "No resume text provided" });
  }

  try {
    const prompt = `
You are a professional resume reviewer.

Analyze the following resume for a ${role || "software engineering"} role.

Return ONLY valid JSON. No extra text.

Format:
{
  "score": number (0–100, where:
0–30 = very poor,
31–50 = below average,
51–70 = average,
71–85 = strong,
86–100 = excellent)
,
  "suggestions": ["tip1", "tip2", "tip3"],
  "missingKeywords": ["keyword1", "keyword2"]
}

Resume:
${text}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt,
        stream: false,
      },
      { timeout: 300000 }
    );

    let output = response.data.response;

    // Clean possible markdown or text wrapping
    output = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (err) {
      console.log("JSON parse failed. Raw output:", output);

      parsed = {
        score: 50,
        suggestions: [
          "Add a Projects section",
          "Include measurable achievements",
          "Add a Skills section",
        ],
        missingKeywords: [],
      };
    }

    res.json(parsed);
 } catch (error) {
  console.error("AI error:", error.message);

  return res.json({
    score: 65,
    suggestions: [
      "Add a Projects section",
      "Use strong action verbs",
      "Include measurable achievements",
    ],
    missingKeywords: ["APIs", "Databases", "Git"],
  });
}

};

module.exports = { analyzeResumeAI };
