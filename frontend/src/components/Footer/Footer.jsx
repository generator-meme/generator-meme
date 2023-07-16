import "./Footer.css";
import { NavLink } from "react-router-dom";

const Footer = ({type}) => {
  return (
    <div className={`footer footer__${type}`} >
      <NavLink
        end
        to="/team"
        className={({ isActive }) =>
        `footer__link-team
        ${isActive ? "footer__link-team--active": ""}`
        }
      >
        Команда
      </NavLink>
    </div>
  );
};

export default Footer;
