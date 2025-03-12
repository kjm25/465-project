import React from "react";
import { socket } from "../socket.js";

import { GoogleLogin } from "@react-oauth/google";

function GoogleSign() {
  return (
    <div className="googleContainer">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          socket.emit("google_sign", credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}

export default GoogleSign;
