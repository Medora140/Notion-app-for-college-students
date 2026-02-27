import { useEffect, useState } from "react";
import {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
} from "../services/applicationService";



function Applications() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
  company: "",
  role: "",
  status: "Applied",
});

  const loadApps = async () => {
    const data = await getApplications();
    setApps(data);
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createApplication(form);
    setForm({ company: "", role: "", status: "Applied" });
    loadApps();
  };

  const handleDelete = async (id) => {
    await deleteApplication(id);
    loadApps();
  };

  const handleStatusChange = async (id, newStatus) => {
  await updateApplication(id, { status: newStatus });
  loadApps();
};


  return (
    <div className="dashboard">
      <h2>Applications</h2>

      <form onSubmit={handleSubmit}>
  <input
    name="company"
    placeholder="Company"
    value={form.company}
    onChange={handleChange}
    required
  />

  <input
    name="role"
    placeholder="Role"
    value={form.role}
    onChange={handleChange}
    required
  />

  <select
    name="status"
    value={form.status || "Applied"}
    onChange={handleChange}
  >
    <option value="Applied">Applied</option>
    <option value="OA">OA</option>
    <option value="Interview">Interview</option>
    <option value="Offer">Offer</option>
    <option value="Rejected">Rejected</option>
  </select>

  <button type="submit">Add Application</button>
</form>


      <div style={{ marginTop: "20px" }}>
  {apps.map((app) => (
    <div key={app._id} className="app-card">
  <strong>{app.company}</strong> – {app.role}



      <div style={{ marginTop: "8px" }}>
        <select
          value={app.status}
          onChange={(e) =>
            handleStatusChange(app._id, e.target.value)
          }
        >
          <option value="Applied">Applied</option>
          <option value="OA">OA</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={() => handleDelete(app._id)}
          style={{ marginLeft: "10px" }}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default Applications;
