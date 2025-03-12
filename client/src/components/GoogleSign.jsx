import React, { useEffect } from "react";
import { socket } from "../socket.js";

import { GoogleLogin } from "@react-oauth/google";

function GoogleSign() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        socket.emit("google_sign", credentialResponse);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      // useOneTap
    />
  );
}

export default GoogleSign;
