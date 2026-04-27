const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates a full text response using Groq.
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
async function generateText(prompt) {
  try {
    console.log("Groq service called (generateText)");
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
    });

    console.log("Groq finished generating");
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (err) {
    console.error("Groq generateText error:", err.message);
    // Return a fallback message so the frontend doesn't crash
    return "The AI service is temporarily unavailable. Please try again later.";
  }
}

/**
 * Streams a text response using Groq.
 * @param {string} prompt 
 * @param {function} onChunk 
 * @param {function} onEnd 
 * @param {function} onError 
 */
async function streamText(prompt, onChunk, onEnd, onError) {
  try {
    console.log("Groq service called (streamText)");
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onChunk(content);
      }
    }

    if (onEnd) onEnd();
    console.log("Groq stream finished");
  } catch (err) {
    console.error("Groq streamText error:", err.message);
    if (onError) onError(err);
  }
}

module.exports = { generateText, streamText };
