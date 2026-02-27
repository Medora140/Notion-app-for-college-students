import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import Avatar from "../components/Avatar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const avatars = ["cat", "robot", "dog", "unicorn"];

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [expression, setExpression] = useState("normal");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();
  const isDark = document.documentElement.classList.contains("dark");

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const getPasswordStrength = (password) => {
  let score = 0;
  let tips = [];

  if (password.length >= 6) score++;
  else tips.push("Use at least 6 characters");

  if (/[A-Z]/.test(password)) score++;
  else tips.push("Add an uppercase letter");

  if (/[0-9]/.test(password)) score++;
  else tips.push("Include a number");

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else tips.push("Add a special character");

  if (score <= 1)
    return { label: "Weak", color: "#ef4444", width: "25%", tips };
  if (score === 2)
    return { label: "Medium", color: "#f59e0b", width: "50%", tips };
  if (score === 3)
    return { label: "Strong", color: "#3b82f6", width: "75%", tips };
  return { label: "Very Strong", color: "#10b981", width: "100%", tips: [] };
};


  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      setEmailError("Please enter a valid email");
      setExpression("sad");
      return;
    }

    try {
      await registerUser({
        ...form,
        avatar: avatars[avatarIndex],
      });

      // SUCCESS
      setExpression("success");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      // FAILURE
      setExpression("sad");

      setTimeout(() => {
        setExpression("normal");
      }, 2000);
    }
  };

  return (
    <div className="page-center">
      <div className="card login-card">
        {/* Avatar + speech */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              background:
                expression === "success"
                  ? "#10b981"
                  : expression === "sad"
                  ? "#ef4444"
                  : "#111",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "20px",
              fontWeight: "600",
              marginBottom: "10px",
              fontSize: "14px",
              maxWidth: "90%",
              textAlign: "center",
            }}
          >
            {expression === "success"
              ? "Registration successful!"
              : expression === "sad"
              ? "Registered already or invalid input"
              : "Create your account"}
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              setAvatarIndex((prev) => (prev + 1) % avatars.length)
            }
          >
            <Avatar
              type={avatars[avatarIndex]}
              size={120}
              expression={expression}
            />
          </div>
        </div>

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          {emailError && (
            <div style={{ color: "#ef4444", fontSize: "13px" }}>
              {emailError}
            </div>
          )}

          {/* Password field */}
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
              style={{ paddingRight: "40px" }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: isDark ? "#fff" : "#000",
                fontSize: "18px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Password strength meter */}
          {form.password && (
  <div style={{ marginTop: "8px" }}>
    <div
      style={{
        height: "6px",
        background: "#e5e7eb",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: strength.width,
          height: "100%",
          background: strength.color,
          transition: "0.3s",
        }}
      />
    </div>

    <div
      style={{
        fontSize: "12px",
        marginTop: "4px",
        color: strength.color,
        fontWeight: "600",
      }}
    >
      {strength.label} password
    </div>

    {/* Animated tips */}
    {strength.tips.length > 0 && (
      <ul
        style={{
          marginTop: "6px",
          paddingLeft: "16px",
          fontSize: "12px",
          color: "#ef4444",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {strength.tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    )}
  </div>
)}


          <button type="submit">Register</button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
