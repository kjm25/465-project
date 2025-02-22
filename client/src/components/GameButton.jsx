import React from "react";
import "./GameButton.css";

function GameButton({ game }) {
  return (
    <>
      <button className="game-button">{game.name}</button>
    </>
  );
}

export default GameButton;
