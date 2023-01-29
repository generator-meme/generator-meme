import { Link } from 'react-router-dom'
import './Meme.css'

const Meme = ({ image }) => {
  return (
    <div className="meme" style={{ backgroundImage: `url(${image})` }}>
      <Link to="/generator-meme/canvas">
        <button className="meme__create-btn">Создать мем</button>
      </Link>
    </div>
  )
}

export default Meme
