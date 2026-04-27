const { streamText } = require("../services/ollamaService");

const generateProjects = async (req, res) => {
  const { role } = req.body;

  const prompt = `Generate 3 resume-worthy software projects for a ${role || "Software Engineer"}. 
For each project provide:
- Project title
- Short description
- Tech stack
- Impact
Respond in clear bullet points.`;

  try {
    // Set headers for streaming
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
        console.error("Stream error in projects controller:", err.message);
        if (!res.writableEnded) {
          res.write("\n\n[Note: AI service is currently slow or unavailable. Try again later.]");
          res.end();
        }
      }
    );
  } catch (error) {
    console.error("Controller error (Projects):", error.message);
    if (!res.headersSent) {
      res.status(200).send("AI Projects Service is temporarily unavailable.");
    } else if (!res.writableEnded) {
      res.end();
    }
  }
};

module.exports = { generateProjects };
