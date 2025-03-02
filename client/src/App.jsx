import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Pong from "./pages/Pong.jsx";
import GameSelect from "./pages/GameSelect.jsx";
import Join from "./pages/Join.jsx";
import { socket } from "./socket";

function App() {
  const [count, setCount] = useState(0);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  socket.on("hello", (data) => {
    // console.log(data);

    console.log("hello");
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pong" element={<Pong />} />
        <Route path="/gameselect" element={<GameSelect />} />
        <Route path="/join" element={<Join />}></Route>
      </Routes>
    </>
  );
}

export default App;
