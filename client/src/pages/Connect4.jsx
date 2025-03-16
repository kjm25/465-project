import React, { useState } from "react";
import Connect4Col from "../components/Connect4Col";

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
  const [turn, setTurn] = useState(true); //change to false
  const [winner, setWinner] = useState("");

  return (
    <>
      <main className="d-flex justify-content-center">
        <div className="d-flex">
          <Connect4Col col={1} data={data[0]} turn={turn} />
          <Connect4Col col={2} data={data[1]} turn={turn} />
          <Connect4Col col={3} data={data[2]} turn={turn} />
          <Connect4Col col={4} data={data[3]} turn={turn} />
          <Connect4Col col={5} data={data[4]} turn={turn} />
          <Connect4Col col={6} data={data[5]} turn={turn} />
          <Connect4Col col={7} data={data[6]} turn={turn} />
        </div>
      </main>
    </>
  );
}

export default Connect4;
