import { Link } from 'react-router-dom'
import React from 'react';
import './Meme.css'

function Meme({ image, index }) {
  return (
    <li className="meme" style={{ backgroundImage: `url(${image})` }}>
      <Link to={`/generator-meme/${index}`}>
        <button className="meme__create-btn">Создать мем</button>
      </Link>
    </li>
  )
}

export default Meme
