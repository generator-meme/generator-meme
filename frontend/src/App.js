import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import CanvasPreloader from "./components/CanvasPreloader/CanvasPreloader";
import SavedMeme from "./components/SavedMeme/SavedMeme";
import Team from "./components/Team/Team";
import api from "./utils/api";
import "./App.css";
import {
  optionsList,
  checkEmailMessage,
  pageResetPasswordStepOneInfo,
  pageResetPasswordStepTwoInfo,
} from "./utils/constants.js";
import InfoTooltip from "./components/InfoTooltip/InfoTooltip";
import Registration from "./components/Registration/Registration";
import Login from "./components/Login/Login";
import ResetForm from "./components/ResetForm/ResetForm";
// import ResetPassword from "./components/ResetPassword/ResetPassword";
import CheckEmailMessage from "./components/CheckEmailMessage/CheckEmailMessage";
import EmptyPage from "./components/EmptyPage/EmptyPage";
import { useSelector } from "react-redux";

const App = () => {
  const [memes, setMemes] = useState([]);
  const { meme } = useSelector((state) => state.savedMeme);
  const [newMeme, setNewMeme] = useState(null);
  const [isNewMeme, setIsNewMeme] = useState(false);
  const [imageNotFoundOpen, setImageNotFoundOpen] = useState(false);

  const handleCreateNewMeme = (memeUrl, memeId) => {
    return api
      .createNewMem(memeUrl, memeId)
      .then((res) => {
        // console.log(memeUrl, memeId);
        setNewMeme(res);

        localStorage.setItem("createdMeme", JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDownloadNewMeme = () => {
    api
      .downloadNewMem(meme.id)
      .then((res) => {
        // console.log(res, newMeme.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    api
      .getTemplates()
      .then((res) => {
        setMemes(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route
          exact
          path="/"
          element={<Main memes={memes} setIsNewMeme={setIsNewMeme} />}
        />
        <Route path="/team" element={<Team />} />
        <Route
          path="/:id"
          element={
            <CanvasPreloader
              handleCreateNewMeme={handleCreateNewMeme}
              setIsNewMeme={setIsNewMeme}
              isNewMeme={isNewMeme}
              memes={memes}
              setImageNotFoundOpen={setImageNotFoundOpen}
            />
          }
        />
        <Route
          path="/saved/:id"
          element={
            <SavedMeme
              newMeme={newMeme}
              handleDownloadMeme={handleDownloadNewMeme}
            />
          }
        />
        <Route path="/signin" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signin-success-message"
          element={<CheckEmailMessage info={checkEmailMessage.signinSuccess} />}
        />
        <Route path="/activate/:uid/:token/" element={<EmptyPage />} />
        <Route
          path="/reset-password"
          element={<ResetForm info={pageResetPasswordStepOneInfo} />}
        />
        <Route
          path="/set-new-password"
          element={<ResetForm info={pageResetPasswordStepTwoInfo} />}
        />
        <Route
          path="/change-password-message"
          element={
            <CheckEmailMessage info={checkEmailMessage.changePasswordMessage} />
          }
        />
      </Routes>
      <Footer />
      {imageNotFoundOpen && (
        <InfoTooltip
          title="Личные изображения не сохраняются после перезагрузки. Пожалуйста,&nbsp;вернитесь&nbsp;к выбору изображения"
          buttonText="вернуться к выбору"
          onButtonClick={(e) => {
            setImageNotFoundOpen(false);
          }}
        />
      )}
      <div
        class="font-preload"
        style={{
          opacity: 0,
          backgroundColor: "transparent",
          height: 0,
          overflow: "hidden",
        }}
      >
        {optionsList.map((font, index) => {
          return (
            <span key={index}>
              <span style={{ fontFamily: font, fontWeight: 400 }}>т</span>
              <span style={{ fontFamily: font, fontWeight: 700 }}>т</span>
              <span
                style={{
                  fontFamily: font,
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                т
              </span>
              <span
                style={{
                  fontFamily: font,
                  fontWeight: 700,
                  fontStyle: "italic",
                }}
              >
                т
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default App;
