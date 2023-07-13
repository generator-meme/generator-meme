import React, { useEffect, useRef } from "react";
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
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { getMemeByIdAction } from "../../services/actions/savedMemeActions";
import {
  TelegramShareButton,
  ViberShareButton,
  WhatsappShareButton,
} from "react-share";

function SavedMeme({ currentMeme, handleDownloadMeme }) {
  const { isLoading, meme } = useSelector((state) => state.savedMeme);
  const isSavedMeme = true;
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const memeRef = useRef(null);

  const writeToCanvas = (src) => {
    return new Promise((res) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = src;
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          res(blob);
        }, "image/png");
      };
    });
  };

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copyToClipboard = async (src) => {
    const image = await writeToCanvas(src);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [image.type]: image,
        }),
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    dispatch(getMemeByIdAction(id));
  }, []);

  if (isLoading) {
    return <ColorRing></ColorRing>;
  }
  const closeDropDownMenuWhenChouse = () => {
    setTimeout(() => {
      setIsDownloadDropdownOpen(false);
    }, 200);
  };
  return (
    <main className="saved-meme">
      {location.state === null ? null : (
        <Navigation
          isSavedMeme={isSavedMeme}
          id={
            currentMeme?.id ||
            JSON.parse(localStorage.getItem("currentMeme")).id
          }
        />
      )}

      <div className="saved-meme__container">
        <img
          className="saved-meme__image"
          ref={memeRef}
          src={meme.image}
          alt="Мем."
        />
        <div className="saved-meme-btns-wrapper">
          <div className="dropdown-btn-wrapper">
            <button
              className="btn"
              style={{
                width: "414px",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                marginRight: "5px",
                fontSize: "20px",
              }}
              onClick={() => {
                handleDownloadMeme();
              }}
            >
              скачать мем
            </button>
            <button
              onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
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
            <div
              className="download-options"
              onClick={() => {
                closeDropDownMenuWhenChouse();
              }}
            >
              <div
                className="download-option"
                onClick={() => {
                  handleDownloadMeme();
                }}
              >
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
            <div>
              <WhatsappShareButton url={location.href}>
                <img src={icWhatsapp} alt="icon whatsapp" />
              </WhatsappShareButton>
            </div>
            <div>
              <TelegramShareButton url={location.href}>
                <img src={icTelegram} alt="icon telegram" />
              </TelegramShareButton>
            </div>
            <div>
              <ViberShareButton url={location.href}>
                <img src={icViber} alt="icon viber" />
              </ViberShareButton>
            </div>
            <div>
              <img src={icGroup} alt="icon group" />
            </div>
            <div>
              <img
                src={icGlobal}
                alt="icon global"
                onClick={() => {
                  copyURL();
                }}
              />
            </div>
            <div>
              <img
                onClick={() => {
                  copyToClipboard(memeRef.current.src);
                }}
                src={icNote}
                alt="icon note"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SavedMeme;
