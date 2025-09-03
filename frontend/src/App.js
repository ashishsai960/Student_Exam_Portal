import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Exam from "./pages/Exam";
import Result from "./pages/Result";

function App(){
  return (
    <Route>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/exam" element={<Exam/>} />
        <Route path="/result" element={<Result/>} />
      </Routes>
    </Route>
  )
}

export default App;
