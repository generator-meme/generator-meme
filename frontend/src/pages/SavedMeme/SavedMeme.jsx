import React, { useEffect, useRef } from "react";
import styles from "./SavedMeme.module.css";
import Navigation from "../../components/Navigation/Navigation";
import { useState } from "react";
import icWhatsapp from "../../images/icons/ic-whatsapp.svg";
import icTelegram from "../../images/icons/ic-telegram.svg";
import icViber from "../../images/icons/ic-viber.svg";
import icGlobal from "../../images/icons/ic-global.svg";
import icNote from "../../images/icons/ic-note.svg";
import icDownloadToPc from "../../images/icons/ic-download-to-pc.svg";
import icGoogleDrive from "../../images/icons/ic-google-drive.svg";
import icDropbox from "../../images/icons/ic-dropbox.svg";
import icYandexDisc from "../../images/icons/ic-yandex-disc.svg";
import icNotWorkedAddGroup from "../../images/icons/group-add_not_worked_now.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vector_387 from "../../images/vector_387.svg";
import {
  BLOCK_SAVE_BUTTON_TO_COLLECTION,
  getMemeByIdAction,
} from "../../services/actions/savedMemeActions";
import {
  TelegramShareButton,
  ViberShareButton,
  WhatsappShareButton,
} from "react-share";
import Prompt from "../../components/Prompt/Prompt";
import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
import {
  CLEARNEWMEME,
  SET_NEWMEME_FALSE,
} from "../../services/actions/memeActions";
function SavedMeme() {
  const { meme, blockSaveButton } = useSelector((state) => state.saveMeme);
  const { isLoggedIn } = useSelector((state) => state.user);
  const { createdMeme } = useSelector((state) => state.meme);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const memeRef = useRef(null);
  const navigate = useNavigate();
  const initState = {
    copyImage: false,
    copyUrl: false,
  };
  const [stateOfCopyToClipboard, setStateOfCopyToClipboard] =
    useState(initState);

  const handleDownloadNewMeme = () => {
    api
      .downloadNewMem(meme.id)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

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
  //write to canvas to download image

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(document.location.href);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  //copy URl
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
  //copy image to clipboard

  useEffect(() => {
    dispatch(getMemeByIdAction(id));
    dispatch({ type: CLEARNEWMEME });
    dispatch({ type: SET_NEWMEME_FALSE });
  }, []);

  const closeDropDownMenuWhenChouse = () => {
    setTimeout(() => {
      setIsDownloadDropdownOpen(false);
    }, 200);
  };

  const saveMemeToPersonalAccount = async () => {
    if (blockSaveButton || !isLoggedIn) {
      return;
    }
    const savedToken = getCookie("token");
    const meme_id = createdMeme.id;

    try {
      await api.addMemeToMyCollection(meme_id, savedToken);
      localStorage.setItem("savedMemeId", meme_id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveMemeToMyCollection = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    if (blockSaveButton) {
      return;
    }
    saveMemeToPersonalAccount();
    dispatch({ type: BLOCK_SAVE_BUTTON_TO_COLLECTION });
  };

  return (
    !!meme && (
      <main className={styles.saved_meme}>
        {location.state === null ? null : (
          //if redirected from another page then reductor return null
          <Navigation
            isSavedMeme={true}
            id={JSON.parse(localStorage.getItem("currentMeme")).id}
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
                  handleDownloadNewMeme();
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
                    handleDownloadNewMeme();
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

            <button
              className={`btn ${styles.saved_meme_btn} ${
                blockSaveButton || id === localStorage.getItem("savedMemeId")
                  ? "btn_blocked"
                  : null
              }`}
              // className={`btn ${styles.saved_meme__btn_save}`}
              onClick={handleSaveMemeToMyCollection}
            >
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
                    setStateOfCopyToClipboard({
                      ...stateOfCopyToClipboard,
                      copyUrl: true,
                      copyImage: false,
                    });
                  }}
                />
                <Prompt
                  text={
                    stateOfCopyToClipboard.copyUrl
                      ? "ССЫЛКА СКОПИРОВАНА"
                      : "ПОДЕЛИТЬСЯ URL"
                  }
                ></Prompt>
              </div>
              <div className={styles.icon}>
                <img
                  className={styles.icon_img}
                  onClick={() => {
                    copyToClipboard(memeRef.current.src);
                    setStateOfCopyToClipboard({
                      ...stateOfCopyToClipboard,
                      copyImage: true,
                      copyUrl: false,
                    });
                  }}
                  src={icNote}
                  alt="icon note"
                />
                <Prompt
                  text={
                    stateOfCopyToClipboard.copyImage
                      ? "МЕМ СКОПИРОВАН"
                      : "СКОПИРОВАТЬ В БУФЕР ОБМЕНА"
                  }
                ></Prompt>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  );
}

export default SavedMeme;
