import React from "react";
import "./SavedMeme.css";
import Navigation from "../Navigation/Navigation";
import { useState } from "react";
import icWhatsapp from "../../images/icons/ic-whatsapp.svg";
import icTelegram from "../../images/icons/ic-telegram.svg";
import icViber from "../../images/icons/ic-viber.svg";
import icGroup from "../../images/icons/ic-group.svg";
import icGlobal from "../../images/icons/ic-global.svg";
import icNote from "../../images/icons/ic-note.svg";
import icDropdown from "../../images/icons/ic-dropdown.svg";
import icDownloadToPc from "../../images/icons/ic-download-to-pc.svg";
import icGoogleDrive from "../../images/icons/ic-google-drive.svg";
import icDropbox from "../../images/icons/ic-dropbox.svg";
import icYandexDisc from "../../images/icons/ic-yandex-disc.svg";

function SavedMeme({ currentMeme, newMeme, handleDownloadMeme }) {
  const isSavedMeme = true;

  function onClick() {
    handleDownloadMeme();
  }

  return (
    <main className="saved-meme">
      <Navigation
        isSavedMeme={isSavedMeme}
        id={
          currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id
        }
      />
      <div className="saved-meme__container">
        <img
          className="saved-meme__image"
          src={
            newMeme?.image ||
            JSON.parse(localStorage.getItem("createdMeme")).image
          }
          alt="Мем."
        />
        <button onClick={onClick} className="btn saved-meme__btn-save">
          скачать мем
        </button>
      </div>
    </main>
  );
}

export default SavedMeme;
