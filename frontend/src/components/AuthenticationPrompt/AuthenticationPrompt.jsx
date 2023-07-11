import React from "react";
import "./AuthenticationPrompt.css";

function AuthenticationPrompt({ errorName, spanName, isItSignIn }) {
  return (
    <span
      className={`authentication__input-prompt ${
        errorName?.length > 1
          ? "authentication__input-prompt_type_error"
          : "authentication__input-prompt_type_normal"
      }`}
    >
      {errorName?.length > 1 ? errorName : isItSignIn ? spanName : null}
    </span>
  );
}

export default AuthenticationPrompt;
