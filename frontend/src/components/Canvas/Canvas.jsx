import back from '../../images/back.svg'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import arrowNav from '../../images/arrow-nav.svg'
// import photo from '../../images/meme-edit.jpg'
import textLeft from '../../images/icons/align-left.png'
import textRight from '../../images/icons/align-right.png'
import textCenter from '../../images/icons/align-center.png'
import textBold from '../../images/icons/bold.png'
import textItalic from '../../images/icons/italic.png'
import './Canvas.css'

const Canvas = ({ currentMeme }) => {
  // const { id } = useParams();
  // const currentMeme = memes.find((mem)=> {
  //   return mem.id.includes(id);
  // });
  console.log(currentMeme);
  const memeImage = new Image()
  const [image, setImage] = useState(memeImage)
  const canvas = useRef(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [color, setColor] = useState(null)
  const [topFontSize, setTopFontSize] = useState(50)
  const [bottomFontSize, setBottomFontSize] = useState(50)
  const [bottomFontFamily, setBottomFontFamily] = useState('Comic Sans MS')
  const [bottomFontPosition, setBottomFontPosition] = useState('center')
  const [bottomFontWeight, setBottomFontWeight] = useState('normal')
  const [bottomFontStyle, setBottomFontStyle] = useState('normal')
  const [topFontFamily, setTopFontFamily] = useState('Comic Sans MS')
  const [topFontPosition, setTopFontPosition] = useState('center')
  const [topFontWeight, setTopFontWeight] = useState('normal')
  const [topFontStyle, setTopFontStyle] = useState('normal')

  useEffect(() => {
    // const memeImage = new Image()
    memeImage.src = currentMeme.image
  }, [currentMeme, memeImage])

  const fillStyle = (color) => {
    setColor(color.target.value);
  }

  function changeFontSize (size, setFontFunction) {
    setFontFunction(size);
  }

  function increaseSize (size, setFontFunction) {
    setFontFunction(size + 1);
  }

  function decreaseSize (size, setFontFunction) {
    setFontFunction(size - 1);
  }


  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.drawImage(image, 0, 0)

    ctx.font = `${bottomFontStyle} ${bottomFontWeight} ${bottomFontSize}px ${bottomFontFamily}`
    ctx.fillStyle = color
    ctx.textAlign = bottomFontPosition
  

    bottomText.split('\n').reverse().forEach(function (t, i) {
      ctx.fillText(t, image.width / 2, image.height - i * bottomFontSize - 10, image.width);
    });

  }, [image, canvas, fillStyle, bottomText, bottomFontSize])

  useEffect(() => {
    const topFontctx = canvas.current.getContext('2d')
    topFontctx.font = `${topFontStyle} ${topFontWeight} ${topFontSize}px ${topFontFamily}`
    topFontctx.fillStyle = color
    topFontctx.textAlign = topFontPosition

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
          <button onClick={e => increaseSize(topFontSize, setTopFontSize)} className="icon-size">A+</button>
          <button onClick={e => decreaseSize(topFontSize, setTopFontSize)} className="icon-size">A-</button>
          <button onClick={e => setTopFontPosition('end')}>
            <img src={textLeft} alt="Текст слева" className="icon" />
          </button>
          <button onClick={e => setTopFontPosition('center')}>
            <img src={textCenter} alt="Текст по середине" className="icon" />
          </button>
          <button onClick={e => setTopFontPosition('start')}>
            <img src={textRight} alt="Текст справа" className="icon" />
          </button>
          <button onClick={e => setTopFontWeight('bold')}>
            <img src={textBold} alt="Жирный текст" className="icon" />
          </button>
          <button onClick={e => setTopFontStyle('italic')}>
            <img src={textItalic} alt="Курсивный текст" className="icon" />
          </button>
          <select>
            <option onClick={e => setTopFontFamily('Comic Sans MS')}>Comic Sans MS</option>
            <option onClick={e => setTopFontFamily('Arial')}>Arial</option>
            <option onClick={e => setTopFontFamily('Serif')}>Serif</option>
          </select>
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
          <button onClick={e => increaseSize(bottomFontSize, setBottomFontSize)} className="icon-size">A+</button>
          <button onClick={e => decreaseSize(bottomFontSize, setBottomFontSize)} className="icon-size">A-</button>
          <button onClick={e => setBottomFontPosition('end')}>
            <img src={textLeft} alt="Текст слева" className="icon" />
          </button>
          <button onClick={e => setBottomFontPosition('center')}>
            <img src={textCenter} alt="Текст по середине" className="icon" />
          </button>
          <button onClick={e => setBottomFontPosition('start')}>
            <img src={textRight} alt="Текст справа" className="icon" />
          </button>
          <button onClick={e => setBottomFontWeight('bold')}>
            <img src={textBold} alt="Жирный текст" className="icon" />
          </button>
          <button onClick={e => setBottomFontStyle('italic')}>
            <img src={textItalic} alt="Курсивный текст" className="icon" />
          </button>
          <select>
            <option onClick={e => setBottomFontFamily('Comic Sans MS')}>Comic Sans MS</option>
            <option onClick={e => setBottomFontFamily('Arial')}>Arial</option>
            <option onClick={e => setBottomFontFamily('Serif')}>Serif</option>
          </select>
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