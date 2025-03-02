import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

function Join() {
  const [joinCode, setJoinCode] = useState("");
  const handleJoin = () => {};
  return (
    <div className="join-container">
      <h2>Enter Join Code</h2>
      <input type="text" className="join-input" maxLength={4} />

      <button className="join" onClick={handleJoin}>
        Join
      </button>
    </div>
  );
}

export default Join;
