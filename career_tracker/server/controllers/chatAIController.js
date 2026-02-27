const { generateText, streamText } = require("../services/ollamaService");

// ================= CHAT =================
const chatWithAI = async (req, res) => {
  const { message, resumeText } = req.body;

  try {
    const prompt = `
You are an AI career coach.
User message: ${message}
Resume: ${resumeText || "Not provided"}
Respond in short bullet points. Clear, practical, actionable advice. No paragraphs.
`;
    const response = await generateText(prompt);
    res.json({ reply: response });
  } catch (error) {
    res.status(500).json({ message: "AI chat failed" });
  }
};

const streamChatWithAI = async (req, res) => {
  const { message, resumeText } = req.body;
  const prompt = `
You are an AI career coach.
User message: ${message}
Resume: ${resumeText || "Not provided"}
Respond in short bullet points. Clear, practical, actionable advice. No paragraphs.
`;

  res.setHeader("Content-Type", "text/plain");
  await streamText(
    prompt,
    (chunk) => res.write(chunk),
    () => res.end(),
    (err) => {
      console.error(err);
      res.status(500).end("AI stream failed");
    }
  );
};

// ================= REWRITE =================
const rewriteSentence = async (req, res) => {
  const { sentence, role } = req.body;
  try {
    const prompt = `Rewrite the following sentence for a ${role || "software engineering"} role to be more impactful. Return only the improved sentence: ${sentence}`;
    const response = await generateText(prompt);
    res.json({ result: response });
  } catch (error) {
    res.status(500).json({ message: "Rewrite failed" });
  }
};

// ================= INTERVIEW QUESTIONS =================
const generateInterviewQuestions = async (req, res) => {
  const { resumeText } = req.body;
  const prompt = `Generate 5 technical and 3 HR interview questions based on this resume. Respond only in short bullet points: ${resumeText || "Not provided"}`;
  
  res.setHeader("Content-Type", "text/plain");
  await streamText(
    prompt,
    (chunk) => res.write(chunk),
    () => res.end(),
    (err) => {
      console.error(err);
      res.status(500).end("Interview generation failed");
    }
  );
};

module.exports = {
  chatWithAI,
  streamChatWithAI,
  rewriteSentence,
  generateInterviewQuestions,
};
