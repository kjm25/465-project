import React from "react";
import "./GameButton.css";

function GameButton({ game, isSelected, onSelect }) {
  return (
    <button
      className={`game-button ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(game.id)}
    >
      {game.name}
    </button>
  );
}

export default GameButton;
