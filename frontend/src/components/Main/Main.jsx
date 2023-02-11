import React from 'react'
import Meme from '../Meme/Meme'
import cat from '../../images/cat.png'
// import lines from '../../images/lines.png'
// import lines2 from '../../images/lines2.png'
import help from '../../images/help.png'
// import arrowTop from '../../images/arrow-top.svg'
import './Main.css'
import MemesBox from '../MemesBox/MemesBox.jsx'
import { useNavigate } from 'react-router-dom'

const Main = ({ memes }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/generator-meme/canvas");
  };

  return (
    <main >
      <section className="main" aria-label="Main part" id="main">
        <img className="main__cat" src={cat} alt="Кот." />
        {/* <img className="main__lines main__lines_left" src={lines} alt="lines" />
        <img className="main__lines main__lines_right" src={lines2} alt="lines" /> */}
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
      <MemesBox memes={memes} />
      {/* <ul className="main__memebox">
        {memes.map((elem, index) => {
          return <Meme image={elem.image} key={elem.id} index={index} />
        })}
      </ul>
      <button className="main__btn main__btn_show-more">Показать больше</button> */}
    </main>
  )
}

export default Main
