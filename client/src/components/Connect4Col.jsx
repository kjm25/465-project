import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import "./Connect4Col.css";

function Connect4Col({ col, data, turn }) {
  useEffect(() => {}, []);

  return (
    <>
      <div className="d-flex flex-column">
        <button
          className={`btn ${turn ? "disabled btn-dark" : "btn-primary"}`}
          onClick={() => socket.emit("Connect4Drop", col)}
        >
          Drop
        </button>
        <Connect4Cell colorValue={data[0]} />
        <Connect4Cell colorValue={data[1]} />
        <Connect4Cell colorValue={data[2]} />
        <Connect4Cell colorValue={data[3]} />
        <Connect4Cell colorValue={data[4]} />
        <Connect4Cell colorValue={data[5]} />
      </div>
    </>
  );
}

function Connect4Cell({ colorValue }) {
  const [color, setColor] = useState("");

  useEffect(() => {
    if (colorValue === 0) setColor("white");
    else if (colorValue === 1) setColor("red");
    else if (colorValue === 2) setColor("yellow");
  }, [colorValue]);
  return (
    <>
      <div className="outer-cell">
        <div className={`cell ${color}`}></div>
      </div>
    </>
  );
}

export default Connect4Col;
