const axios = require("axios");

async function generateText(prompt) {
  try {
    console.log("Ollama service called (generateText)");
    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "llama3.2",
        prompt: prompt,
        stream: false,
        options: {
          num_predict: 300,
          temperature: 0.5,
          num_ctx: 1024,
          num_thread: 4
        }
      },
      { timeout: 60000 }
    );
    console.log("Ollama finished generating");
    return response.data.response;
  } catch (err) {
    console.error("Ollama error:", err.response?.data || err.message);
    throw err;
  }
}

async function streamText(prompt, onChunk, onEnd, onError) {
  try {
    console.log("Ollama service called (streamText)");
    const response = await axios({
      method: "post",
      url: "http://127.0.0.1:11434/api/generate",
      data: {
        model: "llama3.2",
        prompt: prompt,
        stream: true,
        options: {
          num_predict: 500,
          temperature: 0.7,
          num_ctx: 2048,
        }
      },
      responseType: "stream",
      timeout: 120000,
    });

    response.data.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      const lines = chunkStr.split("\n");
      
      lines.forEach((line) => {
        if (!line.trim()) return;
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            onChunk(parsed.response);
          }
          if (parsed.done) {
            onEnd && onEnd();
          }
        } catch (e) {
          // Sometimes chunks are split across JSON lines, so we ignore parse errors
        }
      });
    });

    response.data.on("error", (err) => {
      console.error("Axios stream error:", err.message);
      onError && onError(err);
    });

  } catch (err) {
    console.error("StreamText request failed:", err.message);
    onError && onError(err);
  }
}

module.exports = { generateText, streamText };
