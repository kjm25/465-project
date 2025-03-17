import React, { useEffect, useState } from "react";
import "./GameButton.css";

function GameButton({ game, isSelected, onSelect }) {
  const [disabled, setDisabled] = useState(false);

  // useEffect(() => {
  //   if (game.name === "BattleShip") setDisabled(true);
  //   else setDisabled(false);
  // }, [game]);

  return (
    <div className="">
      {/* <button
        className={`game-button game-button-large btn btn-lg btn-secondary ${disabled}`}
        onClick={() => onSelect(game.id)}
      > */}
      <button
        className={`game-button`}
        onClick={() => onSelect(game.id)}
        disabled={disabled}
      >
        {game.name}
      </button>
    </div>
  );
}

export default GameButton;
