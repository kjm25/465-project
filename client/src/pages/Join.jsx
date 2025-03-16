import React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import "./Join.css";

function Join() {
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (joinCode.length === 4) {
      socket.emit("joinRoom", joinCode);
      navigate(`/lobby/${joinCode.toUpperCase()}`);
    } else {
      alert("Please enter a valid 4-character join code.");
    }
  };

  return (
    <>
      <h1 className="game-font h1">Enter Join Code</h1>
      <div className="join-container">
        <input
          type="text"
          className="form-control-lg"
          id="join"
          maxLength={4}
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />

        <button className="btn btn-lg btn-success" onClick={handleJoin}>
          <label htmlFor="join">Join</label>
        </button>
      </div>
    </>
  );
}

export default Join;
