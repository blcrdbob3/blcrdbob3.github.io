import { Link } from "react-router-dom";
import "../styles/terminal.css";

export default function Home() {
  return (
    <div>
      <h1>Welcome to my terminal-style site</h1>
      <nav>
        <Link to="/about">about</Link> | <Link to="/projects">projects</Link>
      </nav>
    </div>
  );
}
