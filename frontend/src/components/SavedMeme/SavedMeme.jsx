import React, { useEffect } from "react";
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
import { useParams } from "react-router-dom";
import api from "../../utils/api";

function SavedMeme({ currentMeme, newMeme, handleDownloadMeme }) {
  const isSavedMeme = true;
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  console.log(currentMeme, newMeme, handleDownloadMeme);

  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    if (currentMeme && newMeme !== null) {
      return;
    }
    api.getCreatedMeme(id);
  }, []);

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
        <div className="saved-meme-btns-wrapper">
          <div
            onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
            className="dropdown-btn-wrapper"
            style={{ display: "flex", marginBottom: "29px" }}
          >
            <button
              className="btn"
              style={{
                width: "414px",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                marginRight: "5px",
              }}
            >
              скачать мем
            </button>
            <button
              className="btn"
              style={{
                width: "80px",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              <img
                src={icDropdown}
                alt="icon dropdown"
                style={{
                  transform: isDownloadDropdownOpen ? "rotate(180deg)" : "none",
                }}
              />
            </button>
          </div>
          {isDownloadDropdownOpen ? (
            <div className="download-options">
              <div className="download-option">
                <img src={icDownloadToPc} alt="icon download to pc" />
                <span>Скачать на устройство</span>
              </div>
              <div className="download-option">
                <img src={icGoogleDrive} alt="icon google drive" />
                <span>Загрузить на Google Drive</span>
              </div>
              <div className="download-option">
                <img src={icDropbox} alt="icon dropbox" />
                <span>Загрузить на Dropbox</span>
              </div>
              <div className="download-option">
                <img src={icYandexDisc} alt="icon yandex disc" />
                <span>Загрузить на Яндекс Диск</span>
              </div>
            </div>
          ) : null}

          <button className="btn saved-meme__btn-save">сохранить в ЛК</button>
          <div className="saved-meme-share-btns-container">
            <img src={icWhatsapp} alt="icon whatsapp" />
            <img src={icTelegram} alt="icon telegram" />
            <img src={icViber} alt="icon viber" />
            <img src={icGroup} alt="icon group" />
            <img src={icGlobal} alt="icon global" />
            <img src={icNote} alt="icon note" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default SavedMeme;
