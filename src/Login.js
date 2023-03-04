import AccountFields from "./AccountFields";
import React from "react";

function Login() {
  return (
    <div className="Login">
      <AccountFields action="login" />
    </div>
  );
}

export default Login;
