import React from "react";
import "./InfoTooltip.css";

function InfoTooltip({ title, onClose }) {

  return (
    <div className="info-tooltip info-tooltip_opened">
      <div className="info-tooltip__container">
        <h2 className="info-tooltip__heading">{title}</h2>
        <button
          className="info-tooltip__close-button button"
          onClick={e => onClose(false)}
        ></button>
      </div>
    </div>
  );
}

export default InfoTooltip;
