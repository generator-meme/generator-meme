import React from "react";
import "./CheckEmailMessage.css";
import ButtonBack from "../ButtonBack/ButtonBack";

function CheckEmailMessage({ info }) {
  return (
    <main className="check-email">
      <ButtonBack />
      <div className="check-email__container">
        <h1 className="check-email__heading">{info.title}</h1>
        <p className="check-email__text" style={{ maxWidth: info.maxWidth }}>
          {info.text}
        </p>
        <button
          className="btn check-email__button"
          onClick={(e) => e.preventDefault()}
        >
          мемы ждут меня!
        </button>
      </div>
    </main>
  );
}

export default CheckEmailMessage;
