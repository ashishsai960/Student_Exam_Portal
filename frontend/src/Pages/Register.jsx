import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Register.css";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      Swal.fire("Missing fields", "Please fill all fields.", "warning");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/api/auth/register/", form);
      Swal.fire({
        title: "Welcome 🎉",
        text: "Registration successful! Please login.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      }).then(() => (window.location.href = "/"));
    } catch (err) {
      Swal.fire(
        "Registration failed",
        err.response?.data?.error || "Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-wrap">
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>

      <div className="reg-card">
        <div className="brand">
          <svg viewBox="0 0 24 24" className="cap">
            <path d="M12 2 1 7l11 5 9-4.09V17h2V7L12 2z" />
            <path d="M11 21v-6l-7-3v4c0 2.76 3.58 5 8 5Z" />
          </svg>
          <div className="brand-text">
            <h1>Online Exam Platform</h1>
            <p>Create your student account</p>
          </div>
        </div>

        <form className="reg-form" onSubmit={handleSubmit}>
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
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2 8 6 8-6" />
              </svg>
            </span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
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
              autoComplete="new-password"
            />
          </div>

          <button className={`primary ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
            <span className="glow"></span>
          </button>
        </form>

        <div className="alt">
          Already have an account? <a href="/">Login</a>
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
