import logo from '../../images/logo.png'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="header">
      <Link to="/generator-meme">
        <img className="header__logo" src={logo} alt="logo" />
      </Link>    
    </div>
  )
}

export default Header
