import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Pong from "./pages/Pong.jsx";
import GameSelect from "./pages/GameSelect.jsx";
import Join from "./pages/Join.jsx";
import Lobby from "./pages/Lobby.jsx";
import { socket } from "./socket";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";

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
      <GoogleOAuthProvider clientId="297333757125-jbb9kbght6ff9upr80dvfuik1j2fpiht.apps.googleusercontent.com">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pong" element={<Pong />} />
          <Route path="/gameselect" element={<GameSelect />} />
          <Route path="/join" element={<Join />}></Route>
          <Route path="/lobby/:roomID" element={<Lobby />}></Route>
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
