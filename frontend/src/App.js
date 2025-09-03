import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Exam from "./Pages/Exam.jsx";
import Result from "./Pages/Result.jsx";

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/exam" element={<Exam/>} />
        <Route path="/result" element={<Result/>} />
      </Routes>
    </Router>
  )
}

export default App;
