import React from "react";
import "./SavedMeme.css";
import Navigation from "../Navigation/Navigation";
import { meme } from "../../utils/constants";

function SavedMeme () {
  const isSavedMeme = true;

  return (
    <main className="saved-meme">
      <Navigation isSavedMeme={isSavedMeme}/>
      <div className="saved-meme__container">
        <img className="saved-meme__image" src={meme.image} alt="Мем." />
        <button className="saved-meme__btn-save btn">скачать мем</button>
      </div>
    </main>
  )
};

export default SavedMeme;