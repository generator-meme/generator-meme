import { Link } from 'react-router-dom'
import React from 'react';
import './Meme.css'

function Meme({ image }) {
  return (
    <li className="meme" style={{ backgroundImage: `url(${image})` }}>
      <Link to="/generator-meme/edit">
        <button className="meme__create-btn">Создать мем</button>
      </Link>
    </li>
  )
}

export default Meme
