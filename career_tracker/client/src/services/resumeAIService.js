import api from "./api";

export const analyzeResumeAI = async (text, role) => {
  const res = await api.post("/ai/analyze-ai", {
    text,
    role,
  });
  return res.data;
};
