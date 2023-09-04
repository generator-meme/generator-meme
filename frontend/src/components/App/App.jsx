import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { loadUserInfo } from "../../services/actions/userActions";
import Header from "../Header/Header";
import Main from "../../pages/Main/Main";
import Team from "../../pages/Team/Team";
import CanvasPreloader from "../../pages/CanvasPreloader/CanvasPreloader";
import SavedMeme from "../../pages/SavedMeme/SavedMeme";
import Registration from "../../pages/Registration/Registration";
import Login from "../../pages/Login/Login";
import AuthUsingSocialNetworks from "../../pages/AuthUsingSocialNetworks/AuthUsingSocialNetworks";
import CheckEmailMessage from "../../pages/CheckEmailMessage/CheckEmailMessage";
import { optionsList, checkEmailMessage } from "../../utils/constants";
import AuthActivation from "../../pages/AuthActivation/AuthActivation";
import ResetPassword from "../../pages/ResetPassword/ResetPassword";
import ResetPassordConfirm from "../../pages/ResetPassordConfirm/ResetPassordConfirm";
import Footer from "../Footer/Footer";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import Preloader from "../Preloader/Preloader";
import { loadCategoriesOptions } from "../../services/actions/filtrationActions";
import { loadAllMemeTemplates } from "../../services/actions/allMemeTemplatesActions";

const App = () => {
  const { meme } = useSelector((state) => state.saveMeme);
  const [newMeme, setNewMeme] = useState(null);
  const [isNewMeme, setIsNewMeme] = useState(false);
  const [imageNotFoundOpen, setImageNotFoundOpen] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn, userInfo } = useSelector((state) => state.user);
  const isPreloaderActive = useSelector((state) => state.preloader);

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
    if (!isTokenChecked) return;
    dispatch(loadAllMemeTemplates());
  }, [isLoggedIn, isTokenChecked, dispatch]);

  useEffect(() => {
    if (Object.values(userInfo).length) return;

    dispatch(loadUserInfo());
    setIsTokenChecked(true);
  }, [isLoggedIn, dispatch, userInfo]);

  useEffect(() => {
    dispatch(loadCategoriesOptions());
  }, [dispatch]);

  if (!isTokenChecked) return null;

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route exact path="/" element={<Main setIsNewMeme={setIsNewMeme} />} />
        <Route path="/team" element={<Team />} />
        <Route
          path="/:id"
          element={
            <CanvasPreloader
              handleCreateNewMeme={handleCreateNewMeme}
              setIsNewMeme={setIsNewMeme}
              isNewMeme={isNewMeme}
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
        <Route
          path="/signin"
          element={!isLoggedIn ? <Registration /> : <Navigate to="/" replace />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/auth/social/:token/"
          element={<AuthUsingSocialNetworks />}
        />
        <Route
          path="/signin-success-message"
          element={<CheckEmailMessage info={checkEmailMessage.signinSuccess} />}
        />
        <Route path="/activate/:uid/:token/" element={<AuthActivation />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset/password/confirm/:uid/:token/"
          element={<ResetPassordConfirm />}
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
      {isPreloaderActive && <Preloader />}
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
