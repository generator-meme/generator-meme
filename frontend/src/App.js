import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import MainLayout from "./components/MainLayout/MainLayout";
import Canvas from "./components/Canvas/Canvas";
import SavedMeme from "./components/SavedMeme/SavedMeme";
import api from "./utils/api";
import "./App.css";

const App = () => {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [newMeme, setNewMeme] = useState(null);

  function handleCreateNewMeme(memeUrl, memeId) {
    return api
      .createNewMem(memeUrl, memeId)
      .then((res) => {
        console.log(res);
        setNewMeme(res);
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

  // console.log(newMeme);

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="/generator-meme" element={<MainLayout />}>
          <Route
            index
            element={<Main memes={memes} setCurrentMeme={setCurrentMeme} />}
          />
          <Route
            path=":id"
            element={
              <Canvas
                currentMeme={currentMeme}
                handleCreateNewMeme={handleCreateNewMeme}
              />
            }
          />
          <Route
            path="saved"
            element={
              <SavedMeme
                currentMeme={currentMeme}
                newMeme={newMeme}
                handleDownloadMeme={handleDownloadNewMeme}
              />
            }
          />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
