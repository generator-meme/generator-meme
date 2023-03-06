import React from "react";
import "./SavedMeme.css";
import Navigation from "../Navigation/Navigation";

function SavedMeme ({ currentMeme, newMeme, handleDownloadMeme }) {
  const isSavedMeme = true;

  function onClick () {
    handleDownloadMeme();
  };

  return (
    <main className="saved-meme">
      <Navigation isSavedMeme={isSavedMeme} id={currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id} />
      <div className="saved-meme__container">
        <img className="saved-meme__image" src={newMeme?.image || JSON.parse(localStorage.getItem("createdMeme")).image} alt="Мем." />
        <button onClick={onClick} className="btn saved-meme__btn-save">скачать мем</button>
      </div>
    </main>
  )
};

export default SavedMeme;