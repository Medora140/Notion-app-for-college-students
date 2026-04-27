const { generateText, streamText } = require("../services/ollamaService");

// ================= CHAT =================
const chatWithAI = async (req, res) => {
  try {
    const { message, resumeText } = req.body;
    const prompt = `
You are an AI career coach.
User message: ${message}
Resume: ${resumeText || "Not provided"}
Respond in short bullet points. Clear, practical, actionable advice. No paragraphs.
`;
    const response = await generateText(prompt);
    // Ensure we always return an object with 'reply'
    res.json({ reply: response || "AI failed to generate a response." });
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.json({ reply: "I'm having trouble connecting to the AI coach right now." });
  }
};

const streamChatWithAI = async (req, res) => {
  try {
    const { message, resumeText } = req.body;
    const prompt = `
You are an AI career coach.
User message: ${message}
Resume: ${resumeText || "Not provided"}
Respond in short bullet points. Clear, practical, actionable advice. No paragraphs.
`;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    await streamText(
      prompt,
      (chunk) => {
        if (!res.writableEnded) res.write(chunk);
      },
      () => {
        if (!res.writableEnded) res.end();
      },
      (err) => {
        console.error("Stream Chat Error:", err.message);
        if (!res.writableEnded) {
          res.write(" (AI Coach is temporarily disconnected)");
          res.end();
        }
      }
    );
  } catch (error) {
    console.error("Stream Chat Controller Error:", error.message);
    if (!res.writableEnded) {
      res.end("AI service encountered an error.");
    }
  }
};

// ================= REWRITE =================
const rewriteSentence = async (req, res) => {
  try {
    const { sentence, role } = req.body;
    if (!sentence) {
      return res.json({ result: "Please provide a sentence to rewrite." });
    }
    const prompt = `Rewrite the following sentence for a ${role || "software engineering"} role to be more impactful. Return only the improved sentence: ${sentence}`;
    const response = await generateText(prompt);
    res.json({ result: response || sentence });
  } catch (error) {
    console.error("Rewrite Error:", error.message);
    res.json({ result: req.body.sentence }); // Return original on error
  }
};

// ================= INTERVIEW QUESTIONS =================
const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const prompt = `Generate 5 technical and 3 HR interview questions based on this resume. Respond only in short bullet points: ${resumeText || "Not provided"}`;
    
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    await streamText(
      prompt,
      (chunk) => {
        if (!res.writableEnded) res.write(chunk);
      },
      () => {
        if (!res.writableEnded) res.end();
      },
      (err) => {
        console.error("Interview Stream Error:", err.message);
        if (!res.writableEnded) {
          res.write("\n\n[Error generating questions]");
          res.end();
        }
      }
    );
  } catch (error) {
    console.error("Interview Controller Error:", error.message);
    if (!res.writableEnded) res.end("Service error.");
  }
};

module.exports = {
  chatWithAI,
  streamChatWithAI,
  rewriteSentence,
  generateInterviewQuestions,
};
