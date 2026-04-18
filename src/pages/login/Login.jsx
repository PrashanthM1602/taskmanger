import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.scss";
import propic from "./propic.jpg";

// ==============================
// 🌐 BASE URL (PRODUCTION READY)
// ==============================

const AUTH_URL =
  process.env.REACT_APP_API_URL ||
  "https://taskmanager-backend-quuh.onrender.com";

const Login = () => {
  // ==============================
  // 🔹 STATE
  // ==============================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==============================
  // 🔹 HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==============================
  // 🔹 HANDLE LOGIN
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // ✅ VALIDATION
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      // ==============================
      // ✅ STORE TOKEN
      // ==============================

      localStorage.setItem("token", data.access_token);

      // ==============================
      // ✅ REDIRECT
      // ==============================

      navigate("/home");

    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // 🔹 UI
  // ==============================

  return (
    <div className="login">
      {/* ============================== */}
      {/* RIGHT SIDE IMAGE */}
      {/* ============================== */}
      <div className="right">
        <img src={propic} alt="Login Visual" />
      </div>

      {/* ============================== */}
      {/* LEFT SIDE FORM */}
      {/* ============================== */}
      <div className="left">
        <form onSubmit={handleSubmit}>
          <div className="wrapper">

            <h1>Sign In</h1>

            {/* ============================== */}
            {/* EMAIL */}
            {/* ============================== */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            {/* ============================== */}
            {/* PASSWORD */}
            {/* ============================== */}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            {/* ============================== */}
            {/* BUTTON */}
            {/* ============================== */}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* ============================== */}
            {/* ERROR MESSAGE */}
            {/* ============================== */}
            {error && (
              <div
                style={{
                  backgroundColor: "#ffe0e0",
                  color: "#d8000c",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* ============================== */}
            {/* REGISTER LINK */}
            {/* ============================== */}
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#007bff" }}>
                Sign Up
              </Link>
            </p>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;