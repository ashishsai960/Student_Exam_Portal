import Swal from "sweetalert2";
import "./Result.css";

export default function Result() {
    const score = localStorage.getItem("score");
    const total = localStorage.getItem("total");
    const username = localStorage.getItem("username")|| "Student";
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const pass = percent >= 40;
    const logout = () => {
        localStorage.clear();
        Swal.fire("Logged out", "See you soon!", "info").then(() => {
          window.location.href = "/";
        });
      };
      const retake = () => {
        localStorage.removeItem("score");
        localStorage.removeItem("total");
        window.location.href = "/exam";
      };
    
    const size = 160;
    const stroke = 12;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

  
    return (
        <div className="rs-shell">
          <header className="rs-topbar">
            <div className="rs-brand">Student Exam Portal</div>
            <div className="rs-right">
              <div className="rs-user">👤 {username}</div>
              <button className="rs-ghost" onClick={logout}>Logout</button>
            </div>
          </header>
    
          <div className="rs-body">
            <section className="rs-main">
              <div className="score-card">
                <div className="score-left">
                  <div className={`badge ${pass ? "pass" : "fail"}`}>
                    {pass ? "PASSED" : "FAILED"}
                  </div>
    
                  <div className="ring-wrap">
                    <svg width={size} height={size}>
                      <circle
                        className="ring-bg"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={stroke}
                      />
                      <circle
                        className="ring"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                      />
                    </svg>
                    <div className="ring-center">
                      <div className="percent">{percent}%</div>
                      <div className="sub">Score</div>
                    </div>
                  </div>
                </div>
    
                <div className="score-right">
                  <h2>Result Summary</h2>
                  <div className="kv">
                    <span>Total Questions</span><b>{total}</b>
                  </div>
                  <div className="kv">
                    <span>Correct</span><b>{score}</b>
                  </div>
                  <div className="kv">
                    <span>Incorrect</span><b>{Math.max(total - score, 0)}</b>
                  </div>
                  <div className="kv">
                    <span>Accuracy</span><b>{percent}%</b>
                  </div>
    
                  <div className="actions">
                    <button className="rs-primary" onClick={retake}>Retake Exam</button>
                    <button className="rs-ghost" onClick={() => (window.location.href = "/")}>
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
    
              <div className="tips-card">
                <div className="title">What’s next?</div>
                <ul>
                  <li>Retake the test to improve your accuracy.</li>
                  <li>Review topics where you missed answers.</li>
                  <li>Keep practicing with timed sessions.</li>
                </ul>
              </div>
            </section>
    
            <aside className="rs-side">
              <div className="side-card">
                <div className="title">Candidate</div>
                <div className="kv"><span>Name</span><b>{username}</b></div>
                <div className="kv"><span>Status</span><b className={pass ? "pass" : "fail"}>{pass ? "Pass" : "Fail"}</b></div>
                <div className="kv"><span>Score</span><b>{score}/{total}</b></div>
              </div>
    
              <div className="side-card">
                <div className="title">Exam Info</div>
                <div className="kv"><span>Mode</span><b>Online</b></div>
                <div className="kv"><span>Duration</span><b>30 min</b></div>
                <div className="kv"><span>Evaluation</span><b>Auto-graded</b></div>
              </div>
            </aside>
          </div>
        </div>
    
    );
  }
  