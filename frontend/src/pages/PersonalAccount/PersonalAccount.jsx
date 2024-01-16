import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./PersonalAccount.module.css";
import { useDispatch, useSelector } from "react-redux";
import useComponentVisible from "./useComponentVisible";
import MemeCollection from "../../components/MemeCollection/MemeCollection";
const PersonalAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userData = useSelector((state) => state.user.userInfo);
  //   const [isMenuOpened, setMenuOpened] = useState(false);
  const [ref, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(false);
  const handleComponentVisibility = () => {
    // const page = document.getElementsByClassName("page");
    // page.classList.remove("contrast-effect");
    const dim_element = document.getElementById("dim");
    dim_element.classList.add("dim_filter");
    const note = document.querySelector(".dim_filter");
    note.style.width = window.innerWidth + "px";
    note.style.height = window.innerHeight + "px";
    // document.body.classList.add("contrast-effect");
    setIsComponentVisible(true);
  };
  const handleName = (e) => {
    try {
      e.preventDefault();
      navigate("/me/name-change");
    } catch (err) {
      console.log(err);
    }
  };
  const handlePass = (e) => {
    try {
      e.preventDefault();
      navigate("/me/pass-change");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.personal_account}>
      <div id="dim"></div>
      <div className={styles.personal_info_all}>
        <h1>Личная информация</h1>
        <div className={styles.personal_info_change}>
          <h2>Имя пользователя</h2>
          <button
            onClick={() => handleComponentVisibility()}
            className={styles.btn_change}
          >
            Редактировать профиль
          </button>
        </div>
      </div>
      <MemeCollection />
      <div ref={ref}>
        {isComponentVisible && (
          <div className={styles.change_me_info}>
            <h4>Имя пользователя</h4>
            <button
              className={styles.btn_change}
              onClick={(e) => handleName(e)}
            >
              Изменить
            </button>
            <h4>Пароль</h4>
            <button
              className={styles.btn_change}
              onClick={(e) => handlePass(e)}
            >
              Изменить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PersonalAccount;
