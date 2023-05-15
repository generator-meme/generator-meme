import React, { useState, useRef, useEffect, useMemo } from "react";
import cat from "../../images/cat.png";
// import help from '../../images/help.png'
import "./Main.css";
import MemesBox from "../MemesBox/MemesBox.jsx";
import { useNavigate } from "react-router-dom";
import ScrollPositionSaver from "../ScrollPositionSaver/ScrollPositionSaver";
import { v4 as uuidv4 } from "uuid";
import { SearchPanel } from "../SearchPanel/SearchPanel";

const Main = ({ memes, setCurrentMeme, setIsNewMeme, tags }) => {
  const navigate = useNavigate();
  const file = useRef();
  const [numberOfVisibleMems, setNumberOfVisibleMems] = useState(21);
  const [filterMemes, setFilterMemes] = useState(memes);

  useEffect(() => {
    setFilterMemes(memes);
  }, [memes]);

  const onChange = (event) => {
    if (event.target.files[0].size > 400000) {
      alert("Вес изображения не должен превышать 400 КБ");
      return;
    }
    const currentFile = event.target.files[0];
    if (event.target.closest("form").checkValidity()) {
      const myCurrentMeme = {
        id: uuidv4(),
        image: URL.createObjectURL(currentFile),
      };
      setCurrentMeme(myCurrentMeme);
      setIsNewMeme(true);
      localStorage.removeItem("currentMeme"); // удаление прошлых данных, чтобы не возникло наслоения прошлого текущего мема и этого, изображение пользователя не сможет сохраниться, тк нет запроса на сервер
      navigate(`/${myCurrentMeme.id}`);
    }
  };

  return (
    <main>
      <ScrollPositionSaver
        pageName={"Main"}
        numberOfVisibleMems={numberOfVisibleMems}
        setNumberOfVisibleMems={setNumberOfVisibleMems}
      />
      <section className="main" aria-label="Main part">
        <img className="main__cat" src={cat} alt="Кот." />
        <h1 className="main__title">Генератор мемов</h1>
        <div className="main__text-box">
          <p className="main__text-advice">
            Выберите шаблон для создания мема или загрузите&nbsp;
          </p>
          <form className="main__form">
            <label className="main__label">
              свое изображение
              <input
                ref={file}
                type="file"
                accept="image/png, image/jpeg, image/gif"
                name="file"
                onChange={(event) => onChange(event)}
                className="main__invisible-input"
              />
            </label>
          </form>
        </div>
      </section>
      <section className="search">
        <SearchPanel
          tags={tags}
          setFilterMemes={setFilterMemes}
          initMemes={memes}
        ></SearchPanel>
      </section>

      <MemesBox
        memes={filterMemes}
        setCurrentMeme={setCurrentMeme}
        numberOfVisibleMems={numberOfVisibleMems}
        setNumberOfVisibleMems={setNumberOfVisibleMems}
        setIsNewMeme={setIsNewMeme}
      />
    </main>
  );
};

export default Main;
