import React from "react";
import "./ButtonBack.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowBack } from "../../images/arrow-back.svg";

function ButtonBack() {
  const navigate = useNavigate();

  return (
    <button className="btn-back" onClick={(e) => navigate(-1)}>
      <ArrowBack className="btn-back__arrow" />
      <p className="btn-back__text">Назад</p>
    </button>
  );
}

export default ButtonBack;
