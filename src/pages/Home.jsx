// src/pages/Home.jsx
import { Link } from "react-router-dom";
import ScrambleHover from "../components/ScrambleHover";
import Ocean from "../components/Ocean";
import "../styles/base.css";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="terminal">
        <h1 className="site-header">blcrdbob3</h1>

        <nav className="home-nav" aria-label="primary">
          <div className="menu-item">
            <Link to="/about">
              <ScrambleHover
                initial="# about"
                final="> learn more about me"
                className="scramble"
              />
            </Link>
          </div>

          <div className="menu-item">
            <Link to="/projects">
              <ScrambleHover
                initial="# projects"
                final="> awesome stuff I've made"
                className="scramble"
              />
            </Link>
          </div>
        </nav>
      </div>

      {/* 🌊 Fixed, full-width ocean container (bottom 20% of screen) */}
      <div className="ocean-container">
        <Ocean length={400} />
      </div>
    </div>
  );
}