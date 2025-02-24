import { useEffect, useState } from "react";
import "./PongGame.css";

function PongGame() {
  const [redPos, setRedPos] = useState(50);
  const [bluePos, setBluePos] = useState(50);
  const [ballPos, setBallPos] = useState([25, 50, 1, 1]); // xPos, yPos, xVel, yVel
  const [score, setScore] = useState([0, 0]);
  const [red, setRed] = useState(false);

  useEffect(() => {
    let setPos;
    if (red) {
      setPos = setRedPos;
    } else {
      setPos = setBluePos;
    }

    const handleUp = (event) => {
      if (event.key === "ArrowUp") {
        setPos((prevPos) => Math.max(prevPos - 5, 0));
      }
    };

    const handleDown = (event) => {
      if (event.key === "ArrowDown") {
        setPos((prevPos) => Math.min(prevPos + 5, 100));
      }
    };

    document.addEventListener("keydown", handleUp);
    document.addEventListener("keydown", handleDown);

    return () => {
      document.removeEventListener("keydown", handleUp);
      document.removeEventListener("keydown", handleDown);
    };
  }, [red]);

  useEffect(() => {
    const ballUpdate = () => {
      setBallPos((prevBallPos) => {
        let newState = prevBallPos.slice();

        //update velocity based on hitting a wall or a player
        if (
          prevBallPos[0] + prevBallPos[2] <= 4 &&
          redPos - prevBallPos[1] >= -5 &&
          redPos - prevBallPos[1] <= 12
        )
          newState[2] = Math.abs(prevBallPos[2]);
        else if (
          prevBallPos[0] + prevBallPos[2] >= 96 &&
          bluePos - prevBallPos[1] >= -5 &&
          bluePos - prevBallPos[1] <= 12
        )
          newState[2] = -Math.abs(prevBallPos[2]);

        if (prevBallPos[1] + prevBallPos[3] <= 0)
          newState[3] = Math.abs(prevBallPos[3]);
        else if (prevBallPos[1] + prevBallPos[3] >= 100)
          newState[3] = -Math.abs(prevBallPos[3]);

        newState[0] = prevBallPos[0] + prevBallPos[2]; //update postions based on velocity
        newState[1] = prevBallPos[1] + prevBallPos[3];

        return newState;
      });
    };

    const ballInterval = setInterval(ballUpdate, 30);

    return () => {
      clearInterval(ballInterval);
    };
  }, [bluePos, redPos]);

  useEffect(() => {
    setBallPos((prevBall) => {
      if (prevBall[0] < 0) {
        // red wins
        setScore((prevScore) => {
          const newScore = [...prevScore];
          newScore[0] += 0.5; //bug this gets run twice - quick fix
          return newScore;
        });
        return [25, 50, 1, prevBall[3]];
      } else if (prevBall[0] > 100) {
        // blue wins
        setScore((prevScore) => {
          const newScore = [...prevScore];
          newScore[1] += 0.5;
          return newScore;
        });
        return [25, 50, -1, prevBall[3]];
      }
      return prevBall;
    });
  }, [ballPos]);

  return (
    <>
      <div className="scoreboard">
        <h2>
          Score: {score[0]} - {score[1]}
        </h2>
      </div>
      <div className="outerbox">
        <PongPlayer side="blue-player" height={bluePos}></PongPlayer>
        <PongPlayer side="red-player" height={redPos}></PongPlayer>
        <PongBall Xpos={ballPos[0]} Ypos={ballPos[1]}></PongBall>
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
