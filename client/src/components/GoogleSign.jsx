import React from "react";

import { GoogleLogin } from "@react-oauth/google";

function GoogleSign() {
  return (
    <div className="googleContainer">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}

export default GoogleSign;
