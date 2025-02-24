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
        <PongPlayer side="red-player" height={10}></PongPlayer>
      </div>
    </>
  );
}

function PongPlayer({ side, height }) {
  useEffect(() => {
    height *= 85 / 100; //each player is 15% of the box; correct so 100 height is bottom with 0 still being top.
    const ele = document.querySelector(`#${side}`);
    ele.style.top = `${height}%`;
  }, [height]);

  return (
    <>
      <div className={`player ${side}`} id={side}></div>
    </>
  );
}

export default PongGame;
