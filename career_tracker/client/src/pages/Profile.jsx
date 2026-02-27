import { useEffect, useState } from "react";
import { getApplications } from "../services/applicationService";
import Avatar from "../components/Avatar";

const avatars = ["cat", "robot", "dog", "unicorn"];

function Profile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [applications, setApplications] = useState([]);
  const [customAvatar, setCustomAvatar] = useState(
    user?.avatarUrl || ""
  );

  useEffect(() => {
    const loadApps = async () => {
      const data = await getApplications();
      setApplications(data);
    };
    loadApps();
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const updatedUser = { ...user, avatarUrl: url };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCustomAvatar(url);
  };

  const changeAvatar = (avatar) => {
    const updatedUser = { ...user, avatar, avatarUrl: "" };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCustomAvatar("");
  };

  return (
    <div className="dashboard">
      <h2>Profile</h2>

      <div className="app-card">
        <Avatar
          type={user?.avatar}
          url={user?.avatarUrl}
          size={80}
        />

        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <h3 style={{ marginTop: "20px" }}>Choose Avatar</h3>

      <div className="avatar-grid">
        {avatars.map((a) => (
          <div
            key={a}
            className="avatar-choice"
            onClick={() => changeAvatar(a)}
          >
            <Avatar type={a} size={60} />
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "20px" }}>Upload Custom Avatar</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      <h3 style={{ marginTop: "30px" }}>Applied Companies</h3>

      {applications.map((app) => (
        <div key={app._id} className="app-card">
          <strong>{app.company}</strong> – {app.role}
          <div>Status: {app.status}</div>
        </div>
      ))}
    </div>
  );
}

export default Profile;
