import back from '../../images/back.svg'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from "../Navigation/Navigation";
import arrowNav from '../../images/arrow-nav.svg'
// import photo from '../../images/meme-edit.jpg'
import textLeft from '../../images/icons/align-left.png'
import textRight from '../../images/icons/align-right.png'
import textCenter from '../../images/icons/align-center.png'
import textBold from '../../images/icons/bold.png'
import textItalic from '../../images/icons/italic.png'
import './Canvas.css'

const Canvas = ({ currentMeme, handleCreateNewMeme }) => {
  const navigate = useNavigate();

  const image = useMemo(() => {
    const img = new Image();
    img.src = currentMeme.image;
    return img;
  }, [currentMeme]);

  const canvas = useRef()
  const [color, setColor] = useState(null)

  const [topText, setTopText] = useState('')
  const [topFontSize, setTopFontSize] = useState(50)
  const [topFontFamily, setTopFontFamily] = useState('Comic Sans MS')
  const [topFontPosition, setTopFontPosition] = useState('center')
  const [topFontWeight, setTopFontWeight] = useState('normal')
  const [topFontStyle, setTopFontStyle] = useState('normal')

  const [bottomText, setBottomText] = useState('')
  const [bottomFontSize, setBottomFontSize] = useState(50)
  const [bottomFontFamily, setBottomFontFamily] = useState('Comic Sans MS')
  const [bottomFontPosition, setBottomFontPosition] = useState('center')
  const [bottomFontWeight, setBottomFontWeight] = useState('normal')
  const [bottomFontStyle, setBottomFontStyle] = useState('normal')

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

  function createMeme () {
    handleCreateNewMeme(canvas.current.toDataURL(), currentMeme.id)
      .finally(()=> {
        navigate('/saved')
      });
  };

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
    <main className='main-editor'>
      <Navigation isSavedMeme={false} id={currentMeme.id} />
      <section className="editor" aria-label="Editor">
        <h1 className="editor__title">Редактор мемов</h1>
        <div className="editor__boxes">
          <canvas
              className="editor__image-box"
              ref={canvas}
              width={image.naturalWidth}
              height={image.naturalHeight}
            />
          <div className="editor__text-box">
            <div className="editor__text-control-panel">
              <input type="color" onChange={e => fillStyle(e)} className="editor__color" />
              <input type="range" onChange={e => changeFontSize(e.target.value, setTopFontSize)} min="10" max="72" defaultValue="50" step="1"/>
              <button onClick={e => increaseSize(topFontSize, setTopFontSize)} className="icon-size">A+</button>
              <button onClick={e => decreaseSize(topFontSize, setTopFontSize)} className="icon-size">A-</button>
              <button onClick={e => setTopFontPosition('start')}>
                <img src={textLeft} alt="Текст слева" className="icon" />
              </button>
              <button onClick={e => setTopFontPosition('center')}>
                <img src={textCenter} alt="Текст по середине" className="icon" />
              </button>
              <button onClick={e => setTopFontPosition('end')}>
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
        <button onClick={createMeme} className="editor__btn btn">сгенерить мем</button>
      </section>
    </main>
  )
}

export default Canvas