import { useState } from "react";
import "./PongGame.css";

function PongGame() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="scoreboard">
        <h2>Score: 0 - 0</h2>
      </div>
      <div className="outerbox">
        <PongPlayer></PongPlayer>
      </div>
    </>
  );
}

function PongPlayer() {
  return (
    <>
      <div className="player"></div>
    </>
  );
}

export default PongGame;
