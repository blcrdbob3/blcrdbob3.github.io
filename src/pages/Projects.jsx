import { Link } from "react-router-dom";
import "../styles/base.css";
import "../styles/projects.css";

export default function Projects() {
  return (
    <div>
      <h1 className="page-title"># projects</h1>
      <ul>
        <li><Link to="/projects/mechatronics">Mechatronics</Link></li>
        <li><Link to="/projects/intro-to-ai">Intro to AI</Link></li>
      </ul>
    </div>
  );
}
