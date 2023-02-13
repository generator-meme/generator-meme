import React from "react";
import "./SavedMeme.css";
import Navigation from "../Navigation/Navigation";
// import { meme } from "../../utils/constants";

function SavedMeme ({ currentMeme, newMeme }) {
  const isSavedMeme = true;

  return (
    <main className="saved-meme">
      <Navigation isSavedMeme={isSavedMeme} id={currentMeme.id} />
      <div className="saved-meme__container">
        <img className="saved-meme__image" src={newMeme.image} alt="Мем." />
        <button className="saved-meme__btn-save btn">скачать мем</button>
      </div>
    </main>
  )
};

export default SavedMeme;