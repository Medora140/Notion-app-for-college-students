const { streamText } = require("../services/ollamaService");

const generateProjects = async (req, res) => {
  const { role } = req.body;

  const prompt = `Generate 3 resume-worthy software projects for a ${role}. 
For each project provide:
- Project title
- Short description
- Tech stack
- Impact
Respond in clear bullet points.`;

  try {
    res.setHeader("Content-Type", "text/plain");
    await streamText(
      prompt,
      (chunk) => res.write(chunk),
      () => res.end(),
      (err) => {
        console.error("Project generation error:", err);
        res.status(500).end("Failed to generate projects");
      }
    );
  } catch (error) {
    console.error("Controller error:", error.message);
    res.status(500).end("Internal server error");
  }
};

module.exports = { generateProjects };
