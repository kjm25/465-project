import React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";

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
    <div className="join-container">
      <h2>Enter Join Code</h2>
      <input
        type="text"
        className="join-input"
        maxLength={4}
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
      />

      <button className="join" onClick={handleJoin}>
        Join
      </button>
    </div>
  );
}

export default Join;
