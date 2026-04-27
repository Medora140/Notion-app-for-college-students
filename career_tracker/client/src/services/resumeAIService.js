import API from "./api";

export const analyzeResumeAI = async (text, role) => {
  const res = await API.post("/ai/analyze-ai", {
    text,
    role,
  });
  return res.data;
};
