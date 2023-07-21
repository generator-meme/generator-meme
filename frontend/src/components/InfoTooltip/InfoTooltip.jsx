import React, { useEffect } from "react";
import "./InfoTooltip.css";

function InfoTooltip({ title, buttonText, onButtonClick }) {
  return (
    <div
      className="info-tooltip info-tooltip_opened"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onButtonClick();
        }
      }}
    >
      <div className="info-tooltip__container">
        <p className="info-tooltip__heading">{title}</p>
        <button
          className="btn info-tooltip__button"
          onClick={(e) => onButtonClick()}
        >
          {buttonText}
        </button>
        <button
          className="info-tooltip__close-button"
          onClick={(e) => onButtonClick()}
        ></button>
      </div>
    </div>
  );
}

export default InfoTooltip;
