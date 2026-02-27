import { useEffect, useState } from "react";
import { getStats } from "../services/dashboardService";
import Avatar from "../components/Avatar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getApplications } from "../services/applicationService";
import { getProblems } from "../services/dsaService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";


function Dashboard() {
  const [stats, setStats] = useState({
    applications: 0,
    dsaProblems: 0,
    interviews: 0,
    resumes: 0,
  });

  const [applications, setApplications] = useState([]);
  const [user] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [problems, setProblems] = useState([]);
const [streak, setStreak] = useState(0);


  useEffect(() => {
  const loadData = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);

      const apps = await getApplications();
      setApplications(apps);

      const dsaData = await getProblems();
      setProblems(dsaData);

      calculateStreak(dsaData);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  loadData();
}, []);


  const statusCounts = {
    Applied: 0,
    OA: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  applications.forEach((app) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
  });

  const pieData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  const COLORS = [
    "#6366f1", // Applied
    "#f59e0b", // OA
    "#3b82f6", // Interview
    "#10b981", // Offer
    "#ef4444", // Rejected
  ];

  const calculateStreak = (data) => {
  const dates = data.map((p) =>
    new Date(p.createdAt).toDateString()
  );

  const uniqueDates = [...new Set(dates)].sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let count = 0;
  let today = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i]);
    const diff =
      (today - d) / (1000 * 60 * 60 * 24);

    if (Math.floor(diff) === i) count++;
    else break;
  }

  setStreak(count);
};

const getWeeklyData = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const counts = new Array(7).fill(0);

  problems.forEach((p) => {
    const day = new Date(p.createdAt).getDay();
    counts[day]++;
  });

  return days.map((d, i) => ({
    name: d,
    value: counts[i],
  }));
};

const weeklyData = getWeeklyData();

const getQuote = () => {
  if (streak >= 5)
    return "🔥 Amazing consistency! Keep it up!";
  if (streak >= 3)
    return "💪 You’re building momentum!";
  if (streak >= 1)
    return "🚀 Good start! Stay consistent!";
  return "Start solving today—future you will thank you!";
};

const quote = getQuote();


  return (
    <div className="dashboard">
      {/* Main heading */}
      <h1>Dashboard</h1>

      {/* Welcome card */}
      <div
        className="app-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <Avatar
          type={user?.avatar}
          url={user?.avatarUrl}
          size={70}
          expression="success"
        />

        <div>
          <h3 style={{ margin: 0 }}>
            Welcome back, {user?.name || "User"}!
          </h3>
          <p style={{ margin: 0, opacity: 0.7 }}>
            Let’s continue your career journey 🚀
          </p>
        </div>
      </div>

      {/* Streak + Quote */}
<div
  className="app-card"
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <div>
    <h3 style={{ margin: 0 }}>DSA Streak</h3>
    <p style={{ fontSize: "22px", margin: 0 }}>
      {streak} day{streak !== 1 && "s"} 🔥
    </p>
  </div>

  <div style={{ textAlign: "right", maxWidth: "60%" }}>
    <p style={{ margin: 0, fontWeight: "500" }}>
      {quote}
    </p>
  </div>
</div>


      {/* Stats cards */}
      <div className="stats-grid" style={{ marginTop: "20px" }}>
        <div className="stat-card">
          <h3>Applications</h3>
          <p>{stats.applications}</p>
        </div>

        <div className="stat-card">
          <h3>DSA Problems</h3>
          <p>{stats.dsaProblems}</p>
        </div>

        <div className="stat-card">
          <h3>Interviews</h3>
          <p>{stats.interviews}</p>
        </div>

        <div className="stat-card">
          <h3>Resumes</h3>
          <p>{stats.resumes}</p>
        </div>
      </div>
      {/* Weekly progress chart */}
<div className="app-card" style={{ marginTop: "30px" }}>
  <h3>Weekly DSA Progress</h3>
  <div style={{ width: "100%", height: 250 }}>
    <ResponsiveContainer>
      <LineChart data={weeklyData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#6366f1"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>


      {/* Pie chart */}
      <div className="app-card" style={{ marginTop: "30px" }}>
        <h3>Application Status Breakdown</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
