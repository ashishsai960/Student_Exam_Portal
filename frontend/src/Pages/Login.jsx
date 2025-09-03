import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", res.data.username);
      window.location.href = "/exam";
    } catch (err) {
      alert("❌ Login failed: " + err.response?.data?.error || "Try again.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
