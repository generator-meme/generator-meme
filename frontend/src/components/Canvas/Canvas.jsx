import meme from '../../images/meme-edit.jpg'
import back from '../../images/back.svg'
import React, { useState, useEffect, useRef } from 'react'
import './Canvas.css'
import { Link } from 'react-router-dom'

const Canvas = () => {
  const [image, setImage] = useState(null)
  const canvas = useRef(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [color, setColor] = useState(null)

  useEffect(() => {
    const memeImage = new Image()
    memeImage.src = meme
    memeImage.onload = () => setImage(memeImage)
  }, [])

  const fillStyle = (color) => {
    setColor(color.target.value);
  }
  useEffect(() => {
    if (image && canvas) {
      const ctx = canvas.current.getContext('2d')
      ctx.fillStyle = 'black'
      ctx.drawImage(image, 0, 0)

      ctx.font = '70px Comic Sans MS'
      ctx.fillStyle = color
      ctx.textAlign = 'center'

      ctx.fillText(topText, 250, 100)
      ctx.fillText(bottomText, 250, 550)
    }
  }, [image, canvas, topText, bottomText, fillStyle])

  const [windowSize, setWindowSize] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  })

  const detectSize = () => {
    setWindowSize({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    })
  }

  useEffect(() => {
    window.addEventListener('resize', detectSize)

    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, [windowSize])

  const vh = '1000px'

  return (
    <div className="editor" style={{ height: windowSize.winHeight }}>
      <div className="editor__image-box">
        <Link to="/generator-meme-frontend/">
          <img className="editor__back" src={back} />
        </Link>
        <h1 className="editor__title">Редактор мемов</h1>
        <div className="editor__canvas">
        <input type="color" onChange={e => fillStyle(e)} className="editor__color" />
          <canvas
            className="editor__image"
            ref={canvas}
            width={windowSize.winWidth / 2 - 30 * 2}
            height={windowSize.winWidth / 2 - 30 * 2}
          />
        </div>
      </div>
      <div className="editor__text-box">
        <input
          className="editor__text editor__text_top"
          type="text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          placeholder="Текст сверху"
        />
        <br />
        <input
          className="editor__text editor__text_bottom"
          type="text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          placeholder="Текст снизу"
        />
      </div>
    </div>
  )
}

export default Canvas
