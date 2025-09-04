import { useEffect, useState } from "react";
import axios from "axios";

export default function Exam() {
  const [questions, setQuestions] = useState([]);
  const [examId, setExamId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); 

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/exam/start/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions);
        setExamId(res.data.exam_id);
        setTimeLeft(res.data.time_limit);
      } catch (err) {
        alert("Could not start exam. Please login again.");
        window.location.href = "/";
      }
    };
    fetchExam();
  }, [token]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); 
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/exam/submit/",
        { exam_id: examId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("score", res.data.score);
      localStorage.setItem("total", res.data.total);
      window.location.href = "/result";
    } catch (err) {
      alert("❌ Exam submission failed.");
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!questions.length) return <div className="fullscreen">Loading exam...</div>;

  const q = questions[currentQ];
  const attemptedCount = Object.keys(answers).length;

  return (
    <div className="exam-page">
      <div className="exam-header">
        <h2>Student Exam</h2>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="exam-content">
        <div className="question-section">
          <h3>Q{currentQ + 1}: {q.text}</h3>
          {Object.entries(q.options).map(([key, val]) => (
            <div key={key} className="option">
              <label>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  checked={answers[q.id] === key}
                  onChange={() => handleOptionChange(q.id, key)}
                />
                <span>{val}</span>
              </label>
            </div>
          ))}

          <div className="nav-buttons">
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(currentQ - 1)}>Previous</button>
            )}
            {currentQ < questions.length - 1 && (
              <button onClick={() => setCurrentQ(currentQ + 1)}>Next</button>
            )}
          </div>
        </div>

        <div className="stats-section">
          <h3>Exam Progress</h3>
          <p>Total Questions: {questions.length}</p>
          <p>Attempted: {attemptedCount}</p>
          <p>Remaining: {questions.length - attemptedCount}</p>
        </div>
      </div>


      <div className="exam-footer">
        <button onClick={handleSubmit} className="submit-btn">
          Submit Exam
        </button>
      </div>
    </div>
  );
}
