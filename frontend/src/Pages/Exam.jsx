import {useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Exam.css"

export default function Exam(){
    const [questions,setQuestions]=useState([]);
    const [examId,setExamId]=useState(null)
    const [answers,setAnswers]=useState({});
    const [currentIndex,setCurrentIndex]=useState(0);
    const [timeLeft,setTimeLeft]=useState(1800)
    const [loading, setLoading]=useState(true);
    const token =localStorage.getItem("access");
    const username = localStorage.getItem("username") || "student";

    useEffect(() => {
        const fetchExam = async () => {
          try {
            const res = await axios.get("http://127.0.0.1:8000/api/exam/start/", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setQuestions(res.data.questions || []);
            setExamId(res.data.exam_id);
            setTimeLeft(res.data.time_limit || 1800);
          } catch (err) {
            Swal.fire("Session expired", "Please login again.", "info").then(() => {
              window.location.href = "/";
            });
          } finally {
            setLoading(false);
          }
        };
        fetchExam();
      }, []);
    
      useEffect(() => {
        if (loading) return;
        if (timeLeft <= 0) {
          handleSubmit(true); 
          return;
        }
        const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
        return () => clearInterval(t);
      }, [timeLeft, loading]);
    
      useEffect(() => {
        const onKey = (e) => {
          if (e.key === "ArrowRight") {
            setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
          } else if (e.key === "ArrowLeft") {
            setCurrentIndex((i) => Math.max(i - 1, 0));
          }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      }, [questions.length]);
    
      const currentQ = questions[currentIndex];
      const attempted = useMemo(() => Object.keys(answers).length, [answers]);
      const remaining = Math.max(questions.length - attempted, 0);
    
      const handleSelect = (qid, optKey) => {
        setAnswers((prev) => ({ ...prev, [qid]: optKey }));
      };
    
      const goto = (idx) => {
        setCurrentIndex(idx);
        // smooth scroll center
        document.querySelector(".qpane")?.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      const format = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      };
    
      const handleSubmit = async (auto = false) => {
        if (!auto) {
          const ok = await Swal.fire({
            title: "Submit Exam?",
            text: "You won’t be able to change answers after submitting.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Continue Writing",
            confirmButtonColor: "#0f766e",
          }).then((r) => r.isConfirmed);
          if (!ok) return;
        }
        if (!examId) {
            Swal.fire("Exam not started", "Please start the exam again.", "info");
            return;
          }
        
          const answersWithStringKeys = Object.entries(answers).reduce((acc, [k, v]) => {
            acc[String(k)] = v;
            return acc;
          }, {});
    
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/exam/submit/",
            { exam_id: examId, answers },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.setItem("score", res.data.score);
          localStorage.setItem("total", res.data.total);
          await Swal.fire({
            title: auto ? "Time Up" : "Submitted ",
            text: auto ? "Your answers were auto-submitted." : "Good job!",
            icon: "success",
            confirmButtonColor: "#2563eb",
          });
          window.location.href = "/result";
        } catch (err) {
          Swal.fire("Submission failed", "Please try again.", "error");
        }
      };
    
      const logout = () => {
        localStorage.clear();
        Swal.fire("Logged out", "See you soon!", "info").then(() => {
          window.location.href = "/";
        });
      };
    
      if (loading) return <div className="hk-loader">Loading exam…</div>;
      if (!questions.length) return <div className="hk-loader">No questions available.</div>;
    
      return (
        <div className="hk-shell">
          <header className="hk-topbar">
            <div className="hk-brand">Student Exam Portal</div>
            <div className="hk-right">
              <div className="hk-user">👤 {username}</div>
              <div className="hk-timer" title="Time Remaining">
                ⏱ {format(timeLeft)}
              </div>
              <button className="hk-ghost" onClick={logout}>Logout</button>
            </div>
          </header>
    
          <div className="hk-body">
            <aside className="hk-nav">
              <div className="hk-nav-head">Questions</div>
              <div className="hk-grid">
                {questions.map((q, i) => {
                  const attempted = answers[q.id] !== undefined;
                  const active = i === currentIndex;
                  return (
                    <button
                      key={q.id}
                      className={`hk-qpill ${active ? "active" : ""} ${attempted ? "done" : ""}`}
                      onClick={() => goto(i)}
                      title={attempted ? "Attempted" : "Not attempted"}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
    
              <div className="hk-progress">
                <div className="hk-progress-bar">
                  <div
                    className="hk-progress-fill"
                    style={{ width: `${(attempted / questions.length) * 100 || 0}%` }}
                  />
                </div>
                <div className="hk-progress-meta">
                  <span>Attempted: {attempted}</span>
                  <span>Remaining: {remaining}</span>
                </div>
              </div>
            </aside>
    
            <main className="hk-main">
              <div className="qpane">
                <div className="qheader">
                  <div className="qtitle">
                    Q{currentIndex + 1} of {questions.length}
                  </div>
                </div>
    
                <div className="qcard">
                  <div className="qtext">{currentQ.text}</div>
    
                  <div className="qoptions">
                    {Object.entries(currentQ.options).map(([key, label]) => {
                      const checked = answers[currentQ.id] === key;
                      return (
                        <label key={key} className={`qopt ${checked ? "selected" : ""}`}>
                          <input
                            type="radio"
                            name={`q-${currentQ.id}`}
                            checked={checked}
                            onChange={() => handleSelect(currentQ.id, key)}
                          />
                          <span className="qkey">{key.toUpperCase()}</span>
                          <span className="qlabel">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
    
                <div className="qnav">
                  <button
                    className="hk-ghost"
                    disabled={currentIndex === 0}
                    onClick={() => goto(currentIndex - 1)}
                  >
                    ← Previous
                  </button>
    
                  <div className="qnav-right">
                    <button
                      className="hk-ghost"
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => goto(currentIndex + 1)}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </main>
    
            <aside className="hk-side">
              <div className="s-card">
                <div className="s-title">Exam Summary</div>
                <div className="s-row"><span>Total Questions</span><b>{questions.length}</b></div>
                <div className="s-row"><span>Attempted</span><b>{attempted}</b></div>
                <div className="s-row"><span>Remaining</span><b>{remaining}</b></div>
              </div>
    
              <div className="s-card">
                <div className="s-title">Tips</div>
                <ul className="tips">
                  <li>Use ←/→ arrow keys to navigate.</li>
                  <li>Answers autosave instantly.</li>
                  <li>Keep an eye on the timer.</li>
                </ul>
              </div>
            </aside>
          </div>
    
          <footer className="hk-footer">
            <div className="hk-footer-right">
              <button className="hk-submit" onClick={() => handleSubmit(false)}>
                Submit Exam
              </button>
            </div>
          </footer>
        </div>
      );
}
