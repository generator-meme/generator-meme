import "./Footer.css";
import { NavLink, useLocation } from "react-router-dom";

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
    </div>
  );
};

export default Footer;
