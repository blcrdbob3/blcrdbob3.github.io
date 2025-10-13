import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectMechatronics from "./pages/Mechatronics.jsx";
import ProjectIntroAI from "./pages/IntroToAI.jsx";

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