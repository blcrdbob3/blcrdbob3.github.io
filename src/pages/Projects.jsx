import { Link } from "react-router-dom";

export default function Projects() {
  return (
    <div>
      <h1>Projects</h1>
      <ul>
        <li><Link to="/projects/mechatronics">Mechatronics</Link></li>
        <li><Link to="/projects/intro-to-ai">Intro to AI</Link></li>
      </ul>
    </div>
  );
}
