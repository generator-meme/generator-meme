import React, { useEffect, useState } from "react";
import "./CheckEmailMessage.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowBack } from "../../images/arrow-back.svg";

function CheckEmailMessage({ info }) {
  const navigate = useNavigate();
  return (
    <main className="check-email">
      <button
        className="check-email__btn-back"
        onClick={(e) => navigate(info.back)}
      >
        <ArrowBack />
        <p className="check-email__text-back">Назад</p>
      </button>
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
