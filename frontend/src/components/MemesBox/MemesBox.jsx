import React, {useState} from "react"
import "./MemesBox.css"
import lines from "../../images/lines.png"
import lines2 from "../../images/lines2.png"
import arrowUp from "../../images/arrow-up.svg"
import Meme from "../Meme/Meme"
import { HashLink as Link } from "react-router-hash-link";

const MemesBox = ({ memes }) => {
  const [numberOfVisibleMems, setNumberOfVisibleMems] = useState(21);
  
  const addMemes = () => {
    setNumberOfVisibleMems(numberOfVisibleMems + 21);
  };

  return (
    <section className="memesbox" aria-label="Box of memes">
      <img className="memesbox__lines memesbox__lines_left" src={lines} alt="Линии." />
      <img className="memesbox__lines memesbox__lines_right" src={lines2} alt="Линии." />
      <ul className="memesbox__container">
        {memes
          .slice(0, numberOfVisibleMems)
          .map((elem, index) => {
            return <Meme image={elem.image} key={elem.id} index={index} />
        })}
      </ul>
      {memes.length > numberOfVisibleMems && (
        <button onClick={addMemes} className="memesbox__btn-show-more btn">показать больше</button>
      )
      }
      <Link to='/generator-meme#main' className="memesbox__up">
        <img className="memesbox__up-arrow" src={arrowUp} alt="Стрелка вверх." />
        <p className="memesbox__up-text" >Наверх</p>
      </Link>
  </section>
  )
}

export default MemesBox