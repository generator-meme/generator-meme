import React, { useState, useEffect } from "react";
import "./EmptyPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { authorisation } from "../../utils/autorisation";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

function EmptyPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(false);

  const activateAccount = async (uid, token) => {
    try {
      await authorisation.activateAccount(uid, token);
      navigate("/login");
    } catch (err) {
      if (err.detail) {
        setResponse(err.detail);
      } else {
        setResponse("Что-то пошло не так, попробуйте зарегистрироваться снова");
      }
    }
  };

  useEffect(() => {
    activateAccount(uid, token);
  }, []);

  return (
    <>
      <main className="empty-page"></main>
      {response && (
        <InfoTooltip
          title={response}
          buttonText="зарегистрироваться снова"
          onButtonClick={(e) => {
            navigate("/signin");
          }}
        />
      )}
    </>
  );
}

export default EmptyPage;
