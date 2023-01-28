import './EditorMeme.css'
import back from '../../images/back.svg'
import { Link } from 'react-router-dom'
import meme from '../../images/meme-edit.jpg'
import { useState } from 'react'

const EditorMeme = () => {

  const [textTop, setTextTop] = useState(false);
  const [textBottom, setTextBottom] = useState(false);

  return (
    <div className="editor-meme">
      <Link to="/generator-meme-frontend/" className="editor-meme__link">
        <img src={back} alt="Назад" />
      </Link>
      <h2 className="editor-meme__title">Редактор мемов</h2>
      <section className="editor-meme__hero">
        <div className="editor-meme__column_left">
          {textTop && <input className="editor__input editor__input_top" type="text" />}
          {textBottom && <input className="editor__input editor__input_bottom" type="text" />}      
          <img src={meme} alt="Мем" className="editor-meme__image" />
        </div>
        <div className="editor-meme__column_right">
          <button className="editor-meme__button editor-meme__button_top"
            type="button"
            onClick={() => setTextTop(!textTop)}>
            Текст сверху
          </button>
          <button
            className="editor-meme__button editor-meme__button_bottom"
            type="button"
            onClick={() => setTextBottom(!textBottom)}>
            Текст снизу
          </button>
        </div>
      </section>
    </div>
  )
}

export default EditorMeme
