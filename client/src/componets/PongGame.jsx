import { useEffect, useState } from "react";
import "./PongGame.css";

function PongGame() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="scoreboard">
        <h2>Score: 0 - 0</h2>
      </div>
      <div className="outerbox">
        <PongPlayer side="blue-player" height={50}></PongPlayer>
        <PongPlayer side="red-player" height={100}></PongPlayer>
      </div>
    </>
  );
}

function PongPlayer({ side, height }) {
  useEffect(() => {
    const ele = document.querySelector(`#${side}`);
    ele.style.top = `${height}px`;
  }, [height]);

  return (
    <>
      <div className={`player ${side}`} id={side}></div>
    </>
  );
}

export default PongGame;
