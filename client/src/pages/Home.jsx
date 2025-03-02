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
          <Link to="/gameselect">Link To Game Select (Test)</Link>
        </div>
        <div className="page-link">
          <Link to="/join">Link to Join Lobby (Test)</Link>
        </div>
      </div>
    </main>
  );
}

export default Home;
