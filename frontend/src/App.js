import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import Canvas from "./components/Canvas/Canvas";
import SavedMeme from "./components/SavedMeme/SavedMeme";
import api from "./utils/api";
import "./App.css";
import FontFamilyOptions from "./components/FontFamilyOptions/FontFamilyOptions";
import { optionsList } from "./utils/constants.js";

const App = () => {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [newMeme, setNewMeme] = useState(null);
  const [isNewMeme, setIsNewMeme] = useState(false);

  function handleCreateNewMeme(memeUrl, memeId) {
    return api
      .createNewMem(memeUrl, memeId)
      .then((res) => {
        console.log(res);
        setNewMeme(res);
        localStorage.setItem("createdMeme", JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDownloadNewMeme() {
    api
      .downloadNewMem(newMeme.id)
      .then((res) => {
        console.log(res, newMeme.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
          element={
            <Main
              memes={memes}
              setCurrentMeme={setCurrentMeme}
              setIsNewMeme={setIsNewMeme}
            />
          }
        />
        <Route
          path="/:id"
          element={
            <Canvas
              currentMeme={currentMeme}
              handleCreateNewMeme={handleCreateNewMeme}
              setIsNewMeme={setIsNewMeme}
              isNewMeme={isNewMeme}
            />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedMeme
              currentMeme={currentMeme}
              newMeme={newMeme}
              handleDownloadMeme={handleDownloadNewMeme}
            />
          }
        />
        <Route path="/font" element={<FontFamilyOptions />} />
      </Routes>
      <Footer />
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
