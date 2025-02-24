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
        <PongBall Xpos={100} Ypos={100}></PongBall>
        <PongPlayer side="red-player" height={10}></PongPlayer>
      </div>
    </>
  );
}

function PongPlayer({ side, height }) {
  useEffect(() => {
    const ele = document.querySelector(`#${side}`);
    let calcHeight = height * (85 / 100); //each player is 15% of the box; correct so 100 height is bottom with 0 still being top.
    ele.style.top = `${calcHeight}%`;
  }, [height]);

  return (
    <>
      <div className={`player ${side}`} id={side}></div>
    </>
  );
}

function PongBall({ Xpos, Ypos }) {
  useEffect(() => {
    const ele = document.querySelector(`#pong-ball`);
    let y = Ypos * (96 / 100);
    let x = Xpos * (97 / 100);
    ele.style.top = `${y}%`;
    ele.style.left = `${x}%`;
  }, [Xpos, Ypos]);

  return (
    <>
      <div className="pong-ball" id="pong-ball"></div>
    </>
  );
}

export default PongGame;
