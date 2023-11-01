import React, { useEffect, useRef } from "react";
import styles from "./SavedMeme.module.css";
import Navigation from "../../components/Navigation/Navigation";
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
import icNotWorkedAddGroup from "../../images/icons/group-add_not_worked_now.svg";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vector_387 from "../../images/vector_387.svg";
import { getMemeByIdAction } from "../../services/actions/savedMemeActions";
import {
  TelegramShareButton,
  ViberShareButton,
  WhatsappShareButton,
} from "react-share";
import Prompt from "../../components/Prompt/Prompt";

function SavedMeme({ currentMeme, handleDownloadMeme }) {
  const { meme } = useSelector((state) => state.saveMeme);
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
      await navigator.clipboard.writeText(document.location.href);
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

  const setImageInMeta = async (src, width, height) => {
    const image = await writeToCanvasCustomParam(src, width, height);
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
      document
        .querySelector('meta[name="meme_image"]')
        .setAttribute("content", reader.result);
      document
        .querySelector('meta[name="twitter:image"]')
        .setAttribute("content", reader.result);
      document
        .querySelector('meta[name="twitter_url"]')
        .setAttribute("content", reader.result);
    }


  };

  const writeToCanvasCustomParam = (src, width, height) => {
    return new Promise((res) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = src;

      img.onload = () => {
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let newWidth, newHeight, offsetX, offsetY;
  
        if (imgRatio > canvasRatio) {
          newWidth = width;
          newHeight = width / imgRatio;
          offsetX = 0;
          offsetY = (height - newHeight) / 2;
        } else {
          newWidth = height * imgRatio;
          newHeight = height;
          offsetX = (width - newWidth) / 2;
          offsetY = 0;
        }
  
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
        canvas.toBlob((blob) => {
          res(blob);
        }, "image/png");
      };
    });
  };
  useEffect(() => {
    // document.querySelector('meta[name="meme_image"]').setAttribute("content", meme?.image);
    // document.querySelector('meta[name="twitter:image"]').setAttribute("content", meme?.image);
    // document.querySelector('meta[name="twitter_url"]').setAttribute("content", meme?.image);
    setImageInMeta(meme?.image, 1200, 627);

    return () => {
      document
        .querySelector('meta[name="meme_image"]')
        .setAttribute("content", "%PUBLIC_URL%/logo.png");
      document
        .querySelector('meta[name="twitter:image"]')
        .setAttribute("content", "%PUBLIC_URL%/logo.png");
      document
        .querySelector('meta[name="twitter_url"]')
        .setAttribute("content", "%PUBLIC_URL%/logo.png");
    };
  }, [meme]);

  const closeDropDownMenuWhenChouse = () => {
    setTimeout(() => {
      setIsDownloadDropdownOpen(false);
    }, 200);
  };

  return (
    !!meme && (
      <main className={styles.saved_meme}>
        {location.state === null ? null : (
          <Navigation
            isSavedMeme={isSavedMeme}
            id={
              currentMeme?.id ||
              JSON.parse(localStorage.getItem("currentMeme")).id
            }
          />
        )}

        <div
          className={styles.saved_meme__container}
          onClick={() => {
            if (isDownloadDropdownOpen) {
              closeDropDownMenuWhenChouse();
            }
          }}
        >
          <img
            className={styles.saved_meme__image}
            ref={memeRef}
            src={meme.image}
            alt="Мем."
          />
          <div className={styles.saved_meme_btns_wrapper}>
            <div className={styles.dropdown_btn_wrapper}>
              <button
                className={`btn ${styles.saved_meme_btn}`}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                onClick={() => {
                  handleDownloadMeme();
                }}
              >
                скачать мем
              </button>
              <button
                onClick={() =>
                  setIsDownloadDropdownOpen(!isDownloadDropdownOpen)
                }
                className={`btn ${styles.saved_meme_arrow_btn}`}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <img
                  src={vector_387}
                  alt="icon dropdown"
                  style={{
                    transform: isDownloadDropdownOpen
                      ? "rotate(180deg)"
                      : "none",
                  }}
                />
              </button>
            </div>
            {isDownloadDropdownOpen ? (
              <div className={styles.download_options}>
                <div
                  className={styles.download_option}
                  onClick={() => {
                    handleDownloadMeme();
                  }}
                >
                  <img src={icDownloadToPc} alt="icon download to pc" />
                  <span>Скачать на устройство</span>
                </div>
                <div
                  className={styles.download_option}
                  style={{ color: "#9B9B9B" }}
                >
                  <img src={icGoogleDrive} alt="icon google drive" />
                  <span>Загрузить на Google Drive</span>
                </div>
                <div
                  className={styles.download_option}
                  style={{ color: "#9B9B9B" }}
                >
                  <img src={icDropbox} alt="icon dropbox" />
                  <span>Загрузить на Dropbox</span>
                </div>
                <div
                  className={styles.download_option}
                  style={{ color: "#9B9B9B" }}
                >
                  <img src={icYandexDisc} alt="icon yandex disc" />
                  <span>Загрузить на Яндекс Диск</span>
                </div>
              </div>
            ) : null}

            <button className={`btn ${styles.saved_meme__btn_save}`}>
              сохранить в ЛК
            </button>
            <div className={styles.saved_meme_share_btns_container}>
              <div className={styles.icon}>
                <WhatsappShareButton url={document.location.href}>
                  <img
                    className={styles.icon_img}
                    src={icWhatsapp}
                    alt="icon whatsapp"
                  />
                </WhatsappShareButton>
              </div>
              <div className={styles.icon}>
                <TelegramShareButton url={document.location.href}>
                  <img
                    className={styles.icon_img}
                    src={icTelegram}
                    alt="icon telegram"
                  />
                </TelegramShareButton>
              </div>
              <div className={styles.icon}>
                <ViberShareButton url={document.location.href}>
                  <img
                    className={styles.icon_img}
                    src={icViber}
                    alt="icon viber"
                  />
                </ViberShareButton>
              </div>
              <div className={styles.icon}>
                <img
                  className={styles.icon_img}
                  src={icNotWorkedAddGroup}
                  alt="icon group"
                  style={{ opacity: "50%" }}
                />

                <Prompt text={"В РАЗРАБОТКЕ"}></Prompt>
              </div>
              <div className={styles.icon}>
                <img
                  className={styles.icon_img}
                  src={icGlobal}
                  alt="icon global"
                  onClick={() => {
                    copyURL();
                  }}
                />
                <Prompt text={"ПОДЕЛИТЬСЯ URL"}></Prompt>
              </div>
              <div className={styles.icon}>
                <img
                  className={styles.icon_img}
                  onClick={() => {
                    copyToClipboard(memeRef.current.src);
                  }}
                  src={icNote}
                  alt="icon note"
                />
                <Prompt text={"СКОПИРОВАТЬ В БУФЕР ОБМЕНА"}></Prompt>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  );
}

export default SavedMeme;
