import { useEffect, useState } from "react";
import "./PongGame.css";
import { socket } from "../socket.js";

function PongGame() {
  const [redPos, setRedPos] = useState(50);
  const [bluePos, setBluePos] = useState(50);
  const [ballPos, setBallPos] = useState([50, 50, 0, 0]); // xPos, yPos, xVel, yVel
  const [score, setScore] = useState([0, 0]);
  const [red, setRed] = useState(false);
  const [winner, setWinner] = useState("");

  const moveUp = (prevPos) => Math.max(prevPos - 5, 0);
  const moveDown = (prevPos) => Math.min(prevPos + 5, 100);
  const isCollision = function (paddlePos, ballPos) {
    const hitboxWidth = 19;
    const fraction = paddlePos / 100;
    const lowerBound = paddlePos - hitboxWidth * fraction;
    const upperBound = lowerBound + hitboxWidth;

    return ballPos >= lowerBound && ballPos <= upperBound;
  };

  useEffect(() => {
    let setPos;
    if (red) {
      setPos = setRedPos;
    } else {
      setPos = setBluePos;
    }

    const handlePress = (event) => {
      if (event.key === "ArrowDown") {
        socket.emit("pongDown");
        setPos(moveDown);
      } else if (event.key === "ArrowUp") {
        socket.emit("pongUp");
        setPos(moveUp);
      }
    };

    document.addEventListener("keydown", handlePress);

    return () => {
      document.removeEventListener("keydown", handlePress);
    };
  }, [red]);

  useEffect(() => {
    const ballUpdate = () => {
      if (winner !== "") return; //return if game over
      setBallPos((prevBallPos) => {
        let newState = prevBallPos.slice();

        //update velocity based on hitting a wall or a player
        if (
          prevBallPos[0] + prevBallPos[2] <= 4 &&
          isCollision(redPos, prevBallPos[1])
          // redPos - prevBallPos[1] >= -5 &&
          // redPos - prevBallPos[1] <= 12
        )
          newState[2] = Math.abs(prevBallPos[2]);
        else if (
          prevBallPos[0] + prevBallPos[2] >= 96 &&
          isCollision(bluePos, prevBallPos[1])
          // bluePos - prevBallPos[1] >= -5 &&
          // bluePos - prevBallPos[1] <= 12
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
  }, [bluePos, redPos, winner]);

  useEffect(() => {
    //SetBallPosition to its new place based on velocity. First check if someone has won.
    setBallPos((prevBall) => {
      if (prevBall[0] < 0) {
        setScore((prevScore) => {
          const newScore = [...prevScore];
          newScore[1] += 1;
          return newScore;
        });
        return [25, 50, 1, prevBall[3]];
      } else if (prevBall[0] > 100) {
        setScore((prevScore) => {
          const newScore = [...prevScore];
          newScore[0] += 1;
          return newScore;
        });
        return [25, 50, 1, prevBall[3]];
      }
      return prevBall;
    });
  }, [ballPos]);

  //set up socket.io in use effect for componet mounting
  useEffect(() => {
    socket.on("color", (side) => {
      if (side === "red") setRed(true);
      else setRed(false);
    });

    socket.on("color", (side) => {
      if (side === "red") setRed(true);
      else setRed(false);
    });

    socket.on("pongDown", () => {
      if (red) setBluePos(moveDown);
      else setRedPos(moveDown);
    });

    socket.on("pongUp", () => {
      if (red) setBluePos(moveUp);
      else setRedPos(moveUp);
    });

    socket.on("pongGameState", (gameState) => {
      setBallPos(gameState.ballPos.slice());
      setScore(gameState.score.slice());
      setBluePos(gameState.bluePos);
      setRedPos(gameState.redPos);
      if (gameState.score[0] >= 7) {
        setWinner("red");
        socket.emit("leaveRoom");
      } //red wins
      else if (gameState.score[1] >= 7) {
        setWinner("blue");
        socket.emit("leaveRoom");
      } //blue wins
    });

    return () => {
      socket.removeAllListeners("color");
      socket.removeAllListeners("pongDown");
      socket.removeAllListeners("Up");
      socket.removeAllListeners("pongGameState");
    };
  }, [red]);

  if (winner !== "") {
    return (
      <>
        <div className="scoreboard">
          <h2>
            Score: {score[0]} - {score[1]}
          </h2>
          <h2>{`${winner} wins!`}</h2>
          <button onClick={() => window.location.replace("/")}>
            Return to Menu
          </button>
        </div>
      </>
    );
  } else {
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
