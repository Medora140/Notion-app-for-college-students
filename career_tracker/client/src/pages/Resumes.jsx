import { useEffect, useState } from "react";
import {
  getResumes,
  uploadResume,
  deleteResume,
} from "../services/resumeService";
import Avatar from "../components/Avatar";

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const [tips, setTips] = useState([]);
  const [score, setScore] = useState(null);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const [weakSentence, setWeakSentence] = useState("");
  const [rewritten, setRewritten] = useState("");

  const [selectedRole, setSelectedRole] = useState("Backend Developer");
  const [templateTips, setTemplateTips] = useState([]);

  const [questions, setQuestions] = useState("");

  const [loading, setLoading] = useState(false);
  const [avatarExpression, setAvatarExpression] = useState("normal");

  const [displayedTips, setDisplayedTips] = useState([]);

  const [projectRole, setProjectRole] = useState("Backend Developer");
const [projectIdeas, setProjectIdeas] = useState([]);
const [loadingProjects, setLoadingProjects] = useState(false);


  // Typing animation
  const typeTips = (tipsArray) => {
    setDisplayedTips([]);
    let i = 0;

    const interval = setInterval(() => {
      setDisplayedTips((prev) => [...prev, tipsArray[i]]);
      i++;
      if (i >= tipsArray.length) clearInterval(interval);
    }, 400);
  };

  const handleProjectSuggestions = async () => {
    console.log("Project button clicked");
    setLoadingProjects(true);
    setProjectIdeas(""); // Now treating it as a string for streaming

    try {
      console.log("Sending project request to backend...");
      const res = await fetch("http://localhost:5000/api/ai/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: projectRole }),
      });

      await readStream(res, (text) => {
        setProjectIdeas(text);
      });
    } catch {
      setProjectIdeas("Failed to generate projects.");
    }

    setLoadingProjects(false);
  };


  // ================= ANALYZE =================
  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;

      console.log("Analyze button clicked");

    setLoading(true);
    setAvatarExpression("thinking");
    setDisplayedTips([]);
    setScore(null);

    try {
      console.log("Sending request to backend...");
      const res = await fetch(
        "http://localhost:5000/api/ai/analyze-ai",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: resumeText,
            role: "Software Developer",
          }),
        }
      );

      const data = await res.json();
      console.log("Response received from backend:", data);

      const allTips = [
        ...(data.suggestions || []),
        ...(data.missingKeywords || []).map(
          (k) => `Add keyword: ${k}`
        ),
      ];

      setScore(data.score);
      setTips(allTips);
      typeTips(allTips);
      setAvatarExpression("success");
    } catch (err) {
      console.error("Frontend error:", err);
      setDisplayedTips(["AI analysis failed. Try again."]);
      setAvatarExpression("sad");
    }

    setLoading(false);
  };

  // ================= HELPER FOR STREAMING =================
  const readStream = async (res, onUpdate) => {
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onUpdate(fullText);
      }
    } catch (err) {
      console.error("Stream error:", err);
    }
  };

  // ================= CHAT =================
  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);

    const messageToSend = chatInput;
    setChatInput("");
    setIsThinking(true);

    // Add empty AI message for streaming
    setChatMessages((prev) => [...prev, { role: "ai", text: "" }]);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          resumeText,
        }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      await readStream(res, (text) => {
        setChatMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = { role: "ai", text };
          }
          return updated;
        });
      });

    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "ai", text: "AI failed to respond." };
        return updated;
      });
    }
    setIsThinking(false);
  };

  // ================= REWRITE =================
  const handleRewrite = async () => {
    if (!weakSentence) return;

    try {
      const res = await fetch("http://localhost:5000/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: weakSentence,
          role: "Software Developer",
        }),
      });

      const data = await res.json();
      setRewritten(data.result);
    } catch {
      setRewritten("Rewrite failed.");
    }
  };

  // ================= TEMPLATE =================
  const handleTemplate = async () => {
    setTemplateTips(["Generating template..."]);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Give a resume structure, key skills, and 3 project ideas for a ${selectedRole}. Respond in bullet points.`,
        }),
      });

      await readStream(res, (text) => {
        setTemplateTips([text]);
      });
    } catch {
      setTemplateTips(["Failed to load template."]);
    }
  };

  // ================= INTERVIEW QUESTIONS =================
  const handleInterviewQuestions = async () => {
    setQuestions("Generating interview questions...");
    try {
      const res = await fetch("http://localhost:5000/api/ai/interview-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
        }),
      });

      await readStream(res, (text) => {
        setQuestions(text);
      });
    } catch {
      setQuestions("Failed to generate questions.");
    }
  };



  // ================= FILE OPERATIONS =================
  const loadResumes = async () => {
    const data = await getResumes();
    setResumes(data);
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    await uploadResume(file);
    setFile(null);
    loadResumes();
  };

  const handleDelete = async (id) => {
    await deleteResume(id);
    loadResumes();
  };

  // ================= UI =================
  return (
    <div className="dashboard">
      <h2>Resume Manager</h2>

      {/* Upload */}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload Resume</button>
      </form>

      {/* AI Analysis */}
      <div className="app-card" style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <Avatar
            type="robot"
            size={60}
            expression={avatarExpression}
          />
          <h3>AI Resume Coach</h3>
        </div>

        <textarea
          placeholder="Paste your resume content here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={{ width: "100%", height: "120px" }}
        />

        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {score !== null && (
          <div style={{ marginTop: "10px" }}>
            ATS Score: {score}/100
          </div>
        )}

        {displayedTips.length > 0 && (
          <ul>
            {displayedTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Auto Project Suggestions */}
<div className="app-card" style={{ marginTop: "20px" }}>
  <h3>Auto Project Suggestions</h3>

  <select
    value={projectRole}
    onChange={(e) => setProjectRole(e.target.value)}
  >
    <option>Backend Developer</option>
    <option>Frontend Developer</option>
    <option>AI/ML Engineer</option>
    <option>Data Analyst</option>
  </select>

  <button
    onClick={handleProjectSuggestions}
    style={{ marginLeft: "10px" }}
  >
    {loadingProjects ? "Generating..." : "Suggest Projects"}
  </button>

  {projectIdeas && (
    <div style={{ marginTop: "15px", whiteSpace: "pre-wrap" }}>
      {projectIdeas}
    </div>
  )}
</div>


      {/* Chat */}
      <div className="app-card" style={{ marginTop: "20px" }}>
        <h3>AI Chat Coach</h3>

        <div style={{ height: "300px", overflowY: "auto", marginBottom: "15px" }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <strong>{msg.role === "user" ? "You" : "AI Coach"}:</strong>
              <div style={{ marginTop: "4px", whiteSpace: "pre-wrap", fontSize: "14px" }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div style={{ fontSize: "12px", fontStyle: "italic", color: "#64748b" }}>
              AI is typing...
            </div>
          )}
        </div>

        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleChat}>Send</button>
      </div>

      {/* Rewrite */}
      <div className="app-card" style={{ marginTop: "20px" }}>
        <h3>Auto-Rewrite Weak Sentence</h3>

        <input
          value={weakSentence}
          onChange={(e) => setWeakSentence(e.target.value)}
          placeholder="Paste weak sentence..."
        />
        <button onClick={handleRewrite}>Rewrite</button>

        {rewritten && <div>{rewritten}</div>}
      </div>

      {/* Template */}
      <div className="app-card" style={{ marginTop: "20px" }}>
        <h3>Role-Based Template</h3>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option>Backend Developer</option>
          <option>Frontend Developer</option>
          <option>AI/ML Engineer</option>
          <option>Data Analyst</option>
        </select>

        <button onClick={handleTemplate}>
          Generate Template
        </button>

        {templateTips.length > 0 && (
          <div style={{ whiteSpace: "pre-wrap" }}>
            {templateTips[0]}
          </div>
        )}
      </div>

      {/* Interview Questions */}
      <div className="app-card" style={{ marginTop: "20px" }}>
        <h3>Interview Question Generator</h3>

        <button onClick={handleInterviewQuestions}>
          Generate Questions
        </button>

        {questions && (
          <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
            {questions}
          </div>
        )}
      </div>

      {/* Resume List */}
      <div style={{ marginTop: "20px" }}>
        {resumes.map((r) => (
          <div key={r._id} className="app-card">
            <strong>{r.originalName}</strong>
            <a
              href={`http://localhost:5000/uploads/${r.filename}`}
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
            <button onClick={() => handleDelete(r._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resumes;
