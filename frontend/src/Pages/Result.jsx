export default function Result() {
    const score = localStorage.getItem("score");
    const total = localStorage.getItem("total");
    const username = localStorage.getItem("username");
  
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h2>Exam Result</h2>
        <p><strong>{username}</strong>, your score is:</p>
        <h3>{score} / {total}</h3>
        <button onClick={() => (window.location.href = "/")}>Logout</button>
      </div>
    );
  }
  