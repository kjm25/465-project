import { useState } from "react";
import { Link } from "react-router-dom";
import GameSelect from "../components/GameSelect";
import "./Home.css";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <GameSelect />
      </div>
      <div>
        <Link to="./pong">Link to the Pong Page (Test)</Link>
      </div>
    </>
  );
}

export default Home;
