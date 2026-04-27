const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Use environment variable or fallback to a supported stable model
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

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
      model: MODEL,
      temperature: 0.5,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (err) {
    console.error(`Groq generateText error (${MODEL}):`, err.message);
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
      model: MODEL,
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
    console.error(`Groq streamText error (${MODEL}):`, err.message);
    if (onError) {
      onError(err);
    } else {
      onChunk("AI streaming service is currently unavailable.");
      if (onEnd) onEnd();
    }
  }
}

module.exports = { generateText, streamText };
