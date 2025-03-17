import React, { useEffect, useState } from "react";
import Connect4Col from "../components/Connect4Col";
import { socket } from "../socket";

function Connect4() {
  const startingData = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  const [data, setData] = useState(startingData);
  const [turn, setTurn] = useState(false);
  const [player0, setPlayer0] = useState(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    socket.on("connect4GameState", (gameState) => {
      setData(gameState.data);
      setTurn(gameState.player0Turn === player0);
    });

    return () => {
      socket.removeAllListeners("connect4GameState");
    };
  }, [player0]);

  useEffect(() => {
    socket.on("connect4Player0", (isPlayer0) => setPlayer0(isPlayer0));

    return () => {
      socket.removeAllListeners("connect4Player0");
    };
  }, []);

  return (
    <>
      <main className="d-flex justify-content-center">
        <div>
          <Connect4Header turn={turn} player0={player0}></Connect4Header>
          <div className="d-flex">
            <Connect4Col col={0} data={data[0]} turn={turn} />
            <Connect4Col col={1} data={data[1]} turn={turn} />
            <Connect4Col col={2} data={data[2]} turn={turn} />
            <Connect4Col col={3} data={data[3]} turn={turn} />
            <Connect4Col col={4} data={data[4]} turn={turn} />
            <Connect4Col col={5} data={data[5]} turn={turn} />
            <Connect4Col col={6} data={data[6]} turn={turn} />
          </div>
        </div>
      </main>
    </>
  );
}

function Connect4Header({ turn, player0 }) {
  const getColor = function (turn, player0) {
    if (player0) return turn ? "text-danger" : "text-warning";
    else return turn ? "text-warning" : "text-danger";
  };

  return (
    <>
      <h1 className={"text-center m-3 " + getColor(turn, player0)}>
        {turn ? "Your turn" : "Opponent's turn"}
      </h1>
    </>
  );
}

export default Connect4;
