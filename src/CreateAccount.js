import React from "react";
import AccountFields from "./AccountFields";

function CreateAccount(props) {
  return (
    <div>
      <AccountFields action="register" />
    </div>
  );
}

export default CreateAccount;
