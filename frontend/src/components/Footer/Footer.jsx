import "./Footer.css";
import { NavLink, useLocation } from "react-router-dom";

<<<<<<< HEAD
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
=======
const Footer = () => {
  const { pathname } = useLocation();

  return (
    <div className="footer">
      {pathname === "/" ? (
        <NavLink
          end
          to="/team"
          className={({ isActive }) =>
            `footer__link-team
        ${isActive ? "footer__link-team--active" : ""}`
          }
        >
          Команда
        </NavLink>
      ) : null}
>>>>>>> test
    </div>
  );
};

export default Footer;
