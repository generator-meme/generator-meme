import Meme from '../Meme/Meme'
import meme from '../../images/meme-image.png'
import { memes } from '../../utils/constants'
import human from '../../images/human.png'
import lines from '../../images/lines.png'
import lines2 from '../../images/lines2.png'
import help from '../../images/help.png'
import arrowTop from '../../images/arrow-top.svg'
import './Main.css'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <div className="main">
      <img className="main__human" src={human} alt="human" />
      <img className="main__lines main__lines_left" src={lines} alt="lines" />
      <img className="main__lines main__lines_right" src={lines2} alt="lines" />
      <h1 className="main__title">Генератор мемов</h1>
      <Link to="/generator-meme/canvas" className="main__link">
        <div className="main__text-box">
          <h3 className="main__text-advice">
            Выберите шаблон для создания мема или
          </h3>
          <div className="main__btn-block">
            <button className="main__btn">Загрузите изображение</button>
            <img className="main__btn_help" src={help} alt={'help text'} />
          </div>
        </div>
      </Link>
      <div className="main__memebox">
        {memes.map((elem) => (
          <Meme image={meme} key={elem} />
        ))}
      </div>
      <button className="main__btn main__btn_show-more">Показать больше</button>
    </div>
  )
}

export default Main
