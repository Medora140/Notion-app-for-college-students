import { useEffect, useState } from "react";
import {
  getProblems,
  createProblem,
  deleteProblem,
} from "../services/dsaService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function DsaTracker() {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    topic: "",
    difficulty: "Easy",
    platform: "LeetCode",
  });

  const chartData = ["Easy", "Medium", "Hard"].map((level) => ({
  name: level,
  value: problems.filter((p) => p.difficulty === level).length,
}));



  const loadProblems = async () => {
    const data = await getProblems();
    setProblems(data);
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProblem(form);
    setForm({
      title: "",
      topic: "",
      difficulty: "Easy",
      platform: "LeetCode",
    });
    loadProblems();
  };

  const handleDelete = async (id) => {
    await deleteProblem(id);
    loadProblems();
  };

  const [isDark, setIsDark] = useState(
  document.documentElement.classList.contains("dark")
);

useEffect(() => {
  const observer = new MutationObserver(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}, []);

const axisColor = isDark ? "#e2e8f0" : "#1e293b";
const labelColor = isDark ? "#e2e8f0" : "#111827";
const barColor = "#6366f1";



  return (
    <div className="dashboard">
      <h2>DSA Tracker</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Problem title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="topic"
          placeholder="Topic (Arrays, DP, Graphs...)"
          value={form.topic}
          onChange={handleChange}
          required
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          name="platform"
          placeholder="Platform"
          value={form.platform}
          onChange={handleChange}
        />

        <button type="submit">Add Problem</button>
      </form>
     <div className="app-card" style={{ marginTop: "20px" }}>
  <h3>Difficulty Breakdown</h3>
  <div style={{ width: "100%", height: 250 }}>
    <ResponsiveContainer>
      <BarChart data={chartData}>
  <XAxis dataKey="name" stroke={axisColor} />
  <YAxis stroke={axisColor} />
  <Tooltip
    contentStyle={{
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
      border: "none",
      color: isDark ? "#e2e8f0" : "#111",
    }}
  />
  <Bar
    dataKey="value"
    fill={barColor}
    label={{
      position: "top",
      fill: labelColor,
      fontSize: 14,
      fontWeight: "bold",
    }}
  />
</BarChart>


    </ResponsiveContainer>
  </div>
</div>

      <div style={{ marginTop: "20px" }}>
        {problems.map((p) => (
          <div
            key={p._id}
            className="app-card"
          >
            <strong>{p.title}</strong>
            <div>
              {p.topic} | {p.difficulty} | {p.platform}
            </div>

            <button
              onClick={() => handleDelete(p._id)}
              style={{ marginTop: "8px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DsaTracker;
