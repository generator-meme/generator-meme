import React, { useState, useEffect } from "react";
import "./EmptyPage.css";
import { useParams, useNavigate } from "react-router-dom";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

function EmptyPage({ handleRequest, errorNavigate }) {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(false);

  useEffect(() => {
    console.log(token, uid, "useEffect");
    handleRequest(token, uid, setResponse);
  }, []);

  // вставить ниже прелоадер на длительность запроса, когда он будет готов

  return (
    <>
      <main className="empty-page"></main>
      {response && (
        <InfoTooltip
          title={response}
          buttonText="попробовать снова"
          onButtonClick={(e) => {
            navigate(errorNavigate);
          }}
        />
      )}
    </>
  );
}

export default EmptyPage;
