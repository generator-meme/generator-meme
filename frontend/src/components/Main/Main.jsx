import React, {useState} from 'react'
import cat from '../../images/cat.png'
import help from '../../images/help.png'
import './Main.css'
import MemesBox from '../MemesBox/MemesBox.jsx'
import { useNavigate } from 'react-router-dom'
import ScrollPositionSaver from '../ScrollPositionSaver/ScrollPositionSaver';


const Main = ({ memes, setCurrentMeme }) => {
  const navigate = useNavigate();
  const [numberOfVisibleMems, setNumberOfVisibleMems] = useState(21);
  const onClick = () => {
    navigate("/canvas");
  };
  

  return (
    <main >
      <ScrollPositionSaver pageName={'Main'} numberOfVisibleMems={numberOfVisibleMems} setNumberOfVisibleMems={setNumberOfVisibleMems}/>
      <section className="main" aria-label="Main part">
        <img className="main__cat" src={cat} alt="Кот." />
        <h1 className="main__title">Генератор мемов</h1>
        <div className="main__text-box">
          <h3 className="main__text-advice">
            Выберите шаблон для создания мема или 
          </h3>
          <div className="main__btn-block">
            <button onClick={onClick} className="main__btn btn">загрузите изображение</button>
            <img className="main__btn_help" src={help} alt='Подсказка.' />
          </div>
        </div>
      </section>
      <MemesBox memes={memes} setCurrentMeme={setCurrentMeme} numberOfVisibleMems={numberOfVisibleMems} setNumberOfVisibleMems={setNumberOfVisibleMems} />
    </main>
  )
}

export default Main
