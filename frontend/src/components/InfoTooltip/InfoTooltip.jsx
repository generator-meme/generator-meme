import React, { useEffect } from "react";
import "./InfoTooltip.css";

function InfoTooltip({ title, buttonText, onClose }) {
  return (
    <div
      className="info-tooltip info-tooltip_opened"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose(false);
        }
      }}
    >
      <div className="info-tooltip__container">
        <p className="info-tooltip__heading">{title}</p>
        <button
          className="btn info-tooltip__badd utton"
          onClick={(e) => onClose(false)}
        >
          {buttonText}
        </button>
        <button
          className="info-tooltip__close-button"
          onClick={(e) => onClose(false)}
        ></button>
      </div>
    </div>
  );
}

export default InfoTooltip;
