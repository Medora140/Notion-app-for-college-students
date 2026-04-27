const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates a full text response using Groq.
 */
async function generateText(prompt) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (err) {
    console.error("Groq generateText error:", err.message);
    return "AI service is currently unavailable. (Offline Fallback)";
  }
}

/**
 * Streams a text response using Groq.
 */
async function streamText(prompt, onChunk, onEnd, onError) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }

    const stream = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) onChunk(content);
    }

    if (onEnd) onEnd();
  } catch (err) {
    console.error("Groq streamText error:", err.message);
    if (onError) {
      onError(err);
    } else {
      onChunk("AI streaming service is currently unavailable.");
      if (onEnd) onEnd();
    }
  }
}

module.exports = { generateText, streamText };
