import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import Avatar from "../components/Avatar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const avatars = ["cat", "robot", "dog", "unicorn"];

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [loginExpression, setLoginExpression] = useState("normal");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const isDark = document.documentElement.classList.contains("dark");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);

      // SUCCESS
      setLoginExpression("success");

      setTimeout(() => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      // FAILURE
      setLoginExpression("sad");

      setTimeout(() => {
        setLoginExpression("normal");
      }, 2000);
    }
  };

  return (
    <div className="page-center">
      <div className="card login-card">
        {/* Avatar + Speech */}
        <div
          style={{
            position: "relative",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Speech bubble */}
          <div
            className="speech"
            style={{
              background:
                loginExpression === "success"
                  ? "#10b981"
                  : loginExpression === "sad"
                  ? "#ef4444"
                  : "#111",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "20px",
              fontWeight: "600",
              marginBottom: "10px",
              fontSize: "12px",
              transition: "0.3s",
            }}
          >
            {loginExpression === "success"
              ? "Login successful!"
              : loginExpression === "sad"
              ? "Invalid credentials"
              : "Welcome! Please log in."}
          </div>

          {/* Avatar */}
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              setAvatarIndex((prev) => (prev + 1) % avatars.length)
            }
          >
            <Avatar
              type={avatars[avatarIndex]}
              size={120}
              isTypingEmail={
                form.email.length > 0 && !isTypingPassword
              }
              isTypingPassword={isTypingPassword}
              expression={loginExpression}
            />
          </div>
        </div>

        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          {/* Password field with eye button */}
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onFocus={() => setIsTypingPassword(true)}
              onBlur={() => setIsTypingPassword(false)}
              onChange={handleChange}
              required
              style={{ paddingRight: "40px" }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "1px",
                top: "54%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: isDark ? "#fff" : "#000",
                fontSize: "14px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
