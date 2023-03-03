import React from 'react';
import './Meme.css'
import { useNavigate } from 'react-router-dom';

function Meme({ elem, setCurrentMeme, setIsNewMeme }) {
  const navigate = useNavigate();

  const onClick = () => {
    setCurrentMeme(elem);
    setIsNewMeme(true);
    localStorage.setItem("currentMeme", JSON.stringify(elem));
    navigate(`/${elem.id}`)
  };

  return (
    <li className="meme" style={{ backgroundImage: `url(${elem.image})` }}>
        <button onClick={onClick} className="meme__create-btn">создать мем</button>
    </li>
  )
}

export default Meme
