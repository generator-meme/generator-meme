import React from "react";
import "./AuthenticationInputValid.css";

function AuthenticationInputValid({ error, value }) {
  return (
    <div
      className={`authentication__input-valid ${
        !error?.length && value.length
          ? "authentication__input-valid-visible"
          : ""
      }`}
    ></div>
  );
}

export default AuthenticationInputValid;
