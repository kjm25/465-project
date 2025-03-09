import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="home-container">
      <h1 className="title">Welcome to GamePlace</h1>
      <div className="selection-container">
        <div className="page-link">
          <Link to="/gameselect">Host Game</Link>
        </div>
        <div className="page-link">
          <Link to="/join">Join Lobby</Link>
        </div>
      </div>
    </main>
  );
}

export default Home;
