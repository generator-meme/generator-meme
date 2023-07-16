import React from "react";
import "./FormPrompt.css";

function FormPrompt({ errorName, spanName, isVisible }) {
  return (
    <span
      className={`authentication__input-prompt ${
        errorName?.length > 1
          ? "authentication__input-prompt_type_error"
          : "authentication__input-prompt_type_normal"
      }`}
    >
      {errorName?.length > 1 ? errorName : isVisible ? spanName : null}
    </span>
  );
}

export default FormPrompt;
