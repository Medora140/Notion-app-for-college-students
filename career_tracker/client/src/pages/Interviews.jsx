import { useEffect, useState } from "react";
import {
  getInterviews,
  createInterview,
  deleteInterview,
} from "../services/interviewService";

function Interviews() {
  const [interviews, setInterviews] = useState([]);

  const [form, setForm] = useState({
    company: "",
    round: "",
    questions: "",
    result: "Pending",
  });

  // Analytics logic (MOVED ABOVE usage)
  const getAnalytics = (interviews) => {
    if (!interviews.length) {
      return {
        total: 0,
        offers: 0,
        rate: 0,
        advice: "Start tracking your interviews to see insights.",
      };
    }

    const total = interviews.length;
    const offers = interviews.filter(
      (i) => i.result === "Selected"
    ).length;

    const rate = Math.round((offers / total) * 100);

    let advice = "";

    if (rate >= 50) {
      advice = "Great job! Your interview performance is strong.";
    } else if (rate >= 20) {
      advice =
        "You’re close! Focus on system design and behavioral questions.";
    } else {
      advice =
        "Consider more mock interviews and revising core DSA topics.";
    }

    return { total, offers, rate, advice };
  };

  const analytics = getAnalytics(interviews);

  const loadInterviews = async () => {
    const data = await getInterviews();
    setInterviews(data);
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createInterview(form);
    setForm({
      company: "",
      round: "",
      questions: "",
      result: "Pending",
    });
    loadInterviews();
  };

  const handleDelete = async (id) => {
    await deleteInterview(id);
    loadInterviews();
  };

  return (
    <div className="dashboard">
      <h2>Interview Notes</h2>

      {/* Analytics card */}
      <div className="app-card" style={{ marginBottom: "20px" }}>
        <h3>Interview Performance</h3>

        <p>
          <strong>Total Interviews:</strong> {analytics.total}
        </p>
        <p>
          <strong>Offers:</strong> {analytics.offers}
        </p>
        <p>
          <strong>Success Rate:</strong> {analytics.rate}%
        </p>

        <div
          className="advice-box"
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "var(--advice-bg, #f1f5f9)",
            borderRadius: "8px",
            color: "var(--advice-text, #1e293b)",
          }}
        >
          {analytics.advice}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          required
        />

        <input
          name="round"
          placeholder="Round (Technical, HR...)"
          value={form.round}
          onChange={handleChange}
          required
        />

        <input
          name="questions"
          placeholder="Questions asked"
          value={form.questions}
          onChange={handleChange}
        />

        <select
          name="result"
          value={form.result}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button type="submit">Add Interview</button>
      </form>

      {/* Interview list */}
      <div style={{ marginTop: "20px" }}>
        {interviews.map((i) => (
          <div key={i._id} className="app-card">
            <strong>{i.company}</strong> – {i.round}

            <div style={{ marginTop: "5px" }}>
              Questions: {i.questions || "N/A"}
            </div>

            <div>
              Result: <strong>{i.result}</strong>
            </div>

            <button
              onClick={() => handleDelete(i._id)}
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

export default Interviews;
