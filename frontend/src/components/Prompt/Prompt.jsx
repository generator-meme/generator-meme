import React from "react";
import "./Prompt.css";

const Prompt = ({ text }) => {
  return (
    <div className="prompt">
      <span>{text}</span>
    </div>
  );
};

export default Prompt;
