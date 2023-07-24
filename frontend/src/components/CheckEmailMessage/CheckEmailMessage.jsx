import React from "react";
import "./CheckEmailMessage.css";
import ButtonBack from "../ButtonBack/ButtonBack";
import { useNavigate } from "react-router-dom";

function CheckEmailMessage({ info }) {
  const navigate = useNavigate();

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
          onClick={(e) => navigate("/")}
        >
          мемы ждут меня!
        </button>
      </div>
    </main>
  );
}

export default CheckEmailMessage;
