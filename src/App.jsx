import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectMechatronics from "./pages/ProjectMechatronics";
import ProjectIntroAI from "./pages/ProjectIntroAI";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/mechatronics" element={<ProjectMechatronics />} />
        <Route path="/projects/intro-to-ai" element={<ProjectIntroAI />} />
      </Routes>
    </Router>
  );
}

export default App;