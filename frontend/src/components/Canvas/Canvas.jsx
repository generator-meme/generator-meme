import back from '../../images/back.svg'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import arrowNav from '../../images/arrow-nav.svg'
import './Canvas.css'

const Canvas = ({ memes }) => {
  const { id } = useParams();
  const currentMeme = memes[id];
  const memeImage = new Image()
  const [image, setImage] = useState(memeImage)
  const canvas = useRef(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [color, setColor] = useState(null)
  const [topFontSize, setTopFontSize] = useState(50)
  const [bottomFontSize, setBottomFontSize] = useState(50)

  useEffect(() => {
    const memeImage = new Image()
    memeImage.src = currentMeme.image
    memeImage.onload = () => setImage(memeImage)
  }, [])

  const fillStyle = (color) => {
    setColor(color.target.value);
  }

  function changeFontSize (size, setFontFunction) {
    setFontFunction(size);
  }

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.drawImage(image, 0, 0)

    ctx.font = `${bottomFontSize}px Comic Sans MS`
    ctx.fillStyle = color
    ctx.textAlign = 'center'

    bottomText.split('\n').reverse().forEach(function (t, i) {
      ctx.fillText(t, image.width / 2, image.height - i * bottomFontSize - 10, image.width);
    });

  }, [image, canvas, fillStyle, bottomText, bottomFontSize])

  useEffect(() => {
    const topFontctx = canvas.current.getContext('2d')
    topFontctx.font = `${topFontSize}px Comic Sans MS`
    topFontctx.fillStyle = color
    topFontctx.textAlign = 'center'

    topText.split('\n').forEach(function (t, i) {
      topFontctx.fillText(t, image.width / 2,40 + i * topFontSize, image.width);
    });

  }, [topText, topFontSize, bottomText, bottomFontSize, fillStyle])
  
  return (
    <>
    <nav className="editor-meme__nav">
    <Link to="/generator-meme/" className="editor-meme__link">
      Главная
    </Link>
    <img src={arrowNav} />
    <span className="editor-meme__span">Готовый мем</span>
    </nav>
    <div className="editor" style={{ height: image.height + 300}}>
      <div className="editor__image-box">
        <Link to="/generator-meme/">
          <img className="editor__back" src={back}/>
        </Link>
        <h1 className="editor__title">Редактор мемов</h1>
        <div className="editor__canvas">
          <canvas
            className="editor__image"
            ref={canvas}
            width={image.width}
            height={image.height}
          />
        </div>
      </div>
      <div className="editor__text-box">
        <div className="editor__text-control-panel">
          <input type="color" onChange={e => fillStyle(e)} className="editor__color" />
          <input type="range" onChange={e => changeFontSize(e.target.value, setTopFontSize)} min="10" max="72" defaultValue="50" step="1"/>
        </div>
        <textarea
          className="editor__text"
          type="text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          placeholder="Текст сверху"
          width={image.width}
        />
        <br />
        <div className="editor__text-control-panel">
          <input type="color" onChange={e => fillStyle(e)} className="editor__color" />
          <input type="range" onChange={e => changeFontSize(e.target.value, setBottomFontSize)} min="10" max="72" defaultValue="50" step="1"/>
        </div>
        <textarea
          className="editor__text"
          type="text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          placeholder="Текст снизу"
        />
      </div>
    </div>
    </>

  )
}

export default Canvas