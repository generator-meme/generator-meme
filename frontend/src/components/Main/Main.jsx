import React, { useState, useRef } from 'react'
import cat from '../../images/cat.png'
import help from '../../images/help.png'
import './Main.css'
import MemesBox from '../MemesBox/MemesBox.jsx'
import { useNavigate } from 'react-router-dom'
import ScrollPositionSaver from '../ScrollPositionSaver/ScrollPositionSaver';
import { v4 as uuidv4 } from 'uuid';

const Main = ({ memes, setCurrentMeme, setIsNewMeme }) => {
  const navigate = useNavigate();
  const file = useRef();
  const [numberOfVisibleMems, setNumberOfVisibleMems] = useState(21);
  
  const onChange = (event) => {
    const currentFile = event.target.files[0];
    if (event.target.closest("form").checkValidity()) {
      const myCurrentMeme = {
        id: uuidv4(),
        image: URL.createObjectURL(currentFile),
      };
      setCurrentMeme(myCurrentMeme);
      setIsNewMeme(true);
      // localStorage.setItem("currentMeme", JSON.stringify(myCurrentMeme)); надо удалить все данные в локалстораджа
      navigate(`/${myCurrentMeme.id}`);
    };
  };

  return (
    <main >
      <ScrollPositionSaver pageName={'Main'} numberOfVisibleMems={numberOfVisibleMems} setNumberOfVisibleMems={setNumberOfVisibleMems}/>
      <section className="main" aria-label="Main part">
        <img className="main__cat" src={cat} alt="Кот." />
        <h1 className="main__title">Генератор мемов</h1>
        <div className="main__text-box">
          <p className="main__text-advice">
            Выберите шаблон для создания мема или загрузите&nbsp;
          </p>
          <form>
            <label className="main__label">
              свое изображение
              <input
                ref={file}
                type="file"
                accept="image/png, image/jpeg, image/gif"
                name="file"
                onChange={event => onChange(event)}
                className="main__invisible-input"
              />
            </label>
          </form>
        </div>
          {/* <p className="main__text-advice">
            Выберите шаблон для создания мема или загрузите&nbsp;
            <span className="main__future-input">свое изображение</span>
          </p> */}
          {/* 
          <div className="main__text-box">
            <h3 className="main__text-advice">
              Выберите шаблон для создания мема или 
            </h3>
            <div className="main__btn-block">
              <button onClick={onClick} className="main__btn btn">загрузите изображение</button>
              <img className="main__btn_help" src={help} alt='Подсказка.' />
            </div>
          </div>
          */}
      </section>

      <MemesBox memes={memes} setCurrentMeme={setCurrentMeme} numberOfVisibleMems={numberOfVisibleMems} setNumberOfVisibleMems={setNumberOfVisibleMems} setIsNewMeme={setIsNewMeme} />

    </main>
  )
}

export default Main
