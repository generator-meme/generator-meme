import React, { useState, useRef } from "react";
import cat from "../../images/cat.png";
// import help from '../../images/help.png'
import "./Main.css";
import MemesBox from "../../components/MemesBox/MemesBox";
import { useNavigate } from "react-router-dom";
import ScrollPositionSaver from "../../components/ScrollPositionSaver/ScrollPositionSaver";
import { v4 as uuidv4 } from "uuid";
import { SearchPanel } from "../../components/SearchPanel/SearchPanel";
import { useDispatch } from "react-redux";

const Main = ({ setIsNewMeme }) => {
  const navigate = useNavigate();
  const file = useRef();
  const [startOfVisibleMems, setStartOfVisibleMems] = useState(0);

  const onChange = (event) => {
    if (event.target.files[0].size > 400000) {
      alert("Вес изображения не должен превышать 400 КБ");
      return;
    }
    const currentFile = event.target.files[0];
    if (event.target.closest("form").checkValidity()) {
      //возвращает сам элемент или родителя с таким селектором
      const myCurrentMeme = {
        id: uuidv4(), // added id
        image: URL.createObjectURL(currentFile),
      };

      setIsNewMeme(true);
      localStorage.removeItem("currentMeme"); // удаление прошлых данных, чтобы не возникло наслоения прошлого текущего мема и этого, изображение пользователя не сможет сохраниться, тк нет запроса на сервер
      navigate(`/${myCurrentMeme.id}`);
    }
  };

  return (
    <main>
      <ScrollPositionSaver
        pageName={"Main"}
        numberOfVisibleMems={startOfVisibleMems}
        setNumberOfVisibleMems={setStartOfVisibleMems}
      />
      <section className="main" aria-label="Main part">
        <img className="main__cat" src={cat} alt="Кот." />
        <h1 className="main__title">Генератор мемов</h1>
        <div className="main__text-box">
          <p className="main__text-advice">
            Выберите шаблон для создания мема или загрузите&nbsp;
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
          </p>
        </div>
      </section>
      <section className="search">
        <SearchPanel></SearchPanel>
      </section>
      <MemesBox
        startOfVisibleMems={startOfVisibleMems}
        setStartOfVisibleMems={setStartOfVisibleMems}
        setIsNewMeme={setIsNewMeme}
      />
    </main>
  );
};

export default Main;
