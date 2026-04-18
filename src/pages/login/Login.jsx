import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.scss";
import propic from "./propic.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Handle login
  const handleSubmit = async (e) => {
  e.preventDefault();

  const { email, password } = formData;

  if (!email || !password) {
    setError("Please fill in all fields");
    return;
  }

  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || "Login failed");
      return;
    }

    // ✅ store token
    localStorage.setItem("token", data.access_token);

    // ✅ success
    navigate("/home");

  } catch (err) {
    setError("Server error");
  }
};

  return (
    <div className="login">
      {/* RIGHT SIDE IMAGE */}
      <div className="right">
        <img src={propic} alt="Login Visual" />
      </div>

      {/* LEFT SIDE FORM */}
      <div className="left">
        <form onSubmit={handleSubmit}>
          <div className="wrapper">
            <h1>Sign In</h1>

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            {/* BUTTON */}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* ERROR MESSAGE */}
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

            {/* REGISTER LINK */}
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