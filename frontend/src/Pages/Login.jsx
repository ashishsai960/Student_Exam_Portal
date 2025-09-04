import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      Swal.fire("Missing fields", "Please enter username and password.", "warning");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", res.data.username);

      await Swal.fire({
        title: "Login Successful Start Exam",
        text: `Welcome back, ${res.data.username}!`,
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      window.location.href = "/exam";
    } catch (err) {
      Swal.fire("Login failed", "Invalid username or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>
      <div className="auth-card">
        <div className="brand">
          <svg viewBox="0 0 24 24" className="cap">
            <path d="M12 2 1 7l11 5 9-4.09V17h2V7L12 2z" />
            <path d="M11 21v-6l-7-3v4c0 2.76 3.58 5 8 5Z" />
          </svg>
          <div className="brand-text">
            <h1>Welcome Back</h1>
            <p>Login to your student account</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <span className="icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5ZM3 22a9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <input
              name="username"
              placeholder="Student User Name"
              value={form.username}
              onChange={onChange}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <span className="icon">
              <svg viewBox="0 0 24 24">
                <path d="M6 10V8a6 6 0 1 1 12 0v2" />
                <rect x="4" y="10" width="16" height="10" rx="2" />
              </svg>
            </span>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
            />
          </div>

          <button className={`primary ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Signing in..." : "Login"}
            <span className="glow"></span>
          </button>
        </form>

        <div className="alt">
          New here? <a href="/register">Create an account</a>
        </div>
      </div>

      <div className="illustration">
        <div className="screen">
          <div className="bar">
            <span className="dot"></span><span className="dot"></span><span className="dot"></span>
          </div>
          <div className="lines shimmer"></div>
        </div>
        <div className="avatar"></div>
      </div>
    </div>
  );
}
