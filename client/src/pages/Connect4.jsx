import React from "react";
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
  const [data, setData] = UseState(startingData);

  return (
    <>
      <Connect4Col col={1} data={data[0]} />
      <Connect4Col col={2} data={data[1]} />
      <Connect4Col col={3} data={data[2]} />
      <Connect4Col col={4} data={data[3]} />
      <Connect4Col col={5} data={data[4]} />
      <Connect4Col col={6} data={data[5]} />
      <Connect4Col col={7} data={data[6]} />
    </>
  );
}

export default Connect4;
