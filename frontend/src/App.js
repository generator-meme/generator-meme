import React, { useEffect, useMemo, useState } from "react";
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
import InfoTooltip from "./components/InfoTooltip/InfoTooltip";

const App = () => {
  const storeApp = {
    initMemes: [],
    tempMemes: [],
    currentMeme: null,
    newMeme: null,
    isNewMeme: false,
    imageNotFoundOpen: false,
    tags: [],
  };
  const [store, setStore] = useState(storeApp);
  const [isSearchQuery, setIsSearchQuery] = useState(false);

  const handleCreateNewMeme = (memeUrl, memeId) => {
    return api
      .createNewMem(memeUrl, memeId)
      .then((newMeme) => {
        console.log(memeUrl, memeId);
        setStore({ ...store, newMeme });
        localStorage.setItem("createdMeme", JSON.stringify(newMeme));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDownloadNewMeme = () => {
    api
      .downloadNewMem(store.newMeme.id)
      .then((res) => {
        console.log(res, store.newMeme.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setCurrentMeme = (data) => {
    setStore({ ...store, currentMeme: data });
  };
  const setIsNewMeme = (data) => {
    setStore({ ...store, isNewMeme: data });
  };
  const setImageNotFoundOpen = (data) => {
    setStore({ ...store, imageNotFoundOpen: data });
  };
  const setFilteredMemes = (data) => {
    setStore({ ...store, tempMemes: [...data] });
  };

  useEffect(() => {
    api
      .getTemplates()
      .then((memes) => {
        setStore({ ...store, initMemes: [...memes] });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .getTags()
      .then((tags) => {
        setStore({ ...store, tags: [...tags] });
      })
      .catch((err) => console.log(err));
  }, []);
  const currMemes = useMemo(() => {
    return isSearchQuery ? store.tempMemes : store.initMemes;
  }, [store.tempMemes, isSearchQuery, store.initMemes]);
  console.log(currMemes);

  console.log(store);
  console.log(isSearchQuery);
  return (
    <div className="page">
      <Header />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Main
              initMemes={store.initMemes}
              memes={currMemes}
              setCurrentMeme={setCurrentMeme}
              setIsNewMeme={setIsNewMeme}
              setFilteredMemes={setFilteredMemes}
              toogleSearchFlag={setIsSearchQuery}
            />
          }
        />
        <Route
          path="/:id"
          element={
            <Canvas
              currentMeme={store.currentMeme}
              handleCreateNewMeme={handleCreateNewMeme}
              setIsNewMeme={setIsNewMeme}
              isNewMeme={store.isNewMeme}
              memes={currMemes}
              setImageNotFoundOpen={setImageNotFoundOpen}
            />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedMeme
              currentMeme={store.currentMeme}
              newMeme={store.newMeme}
              handleDownloadMeme={handleDownloadNewMeme}
            />
          }
        />
        <Route path="/font" element={<FontFamilyOptions />} />
      </Routes>
      <Footer />
      {storeApp.imageNotFoundOpen && (
        <InfoTooltip
          title="Личные изображения не сохраняется при перезагрузке, пожалуйста, вернитесь к выбору изображения"
          onClose={setImageNotFoundOpen}
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
