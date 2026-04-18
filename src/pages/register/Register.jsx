import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.scss";
import propic from "./propic.jpg";

const AUTH_URL = "http://127.0.0.1:8000";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Handle submit (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    // ✅ Validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // ✅ FIX: Send JSON (NOT query params)
      const res = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Registration failed");
        return;
      }

      // ✅ Success
      alert("Registration Successful");
      navigate("/login");

    } catch (err) {
      setError("Server error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="right">
        <img src={propic} alt="Register" />
      </div>

      <div className="left">
        <form onSubmit={handleSubmit}>
          <div className="wrapper">
            <h1>Sign Up</h1>

            {/* Username (optional for now) */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>

            {error && (
              <div
                style={{
                  backgroundColor: "#ffe0e0",
                  color: "#d8000c",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                {error}
              </div>
            )}

            <p style={{ textAlign: "center" }}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;