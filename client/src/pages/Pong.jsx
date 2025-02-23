import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "../../public/vite.svg";
import "./Pong.css";
import PongGame from "../componets/PongGame";

function Pong() {
  const [count, setCount] = useState(0);

  return (
    <>
      <PongGame></PongGame>
    </>
  );
}

export default Pong;
