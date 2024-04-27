import React, { useState, useEffect } from "react";
import "./MemesBox.css";
import arrowUp from "../../images/arrow-up.svg";
import Meme from "../Meme/Meme";
import { HashLink as Link } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllMemeTemplates,
  selectIsMemeTemplateAvalible,
} from "../../services/selectors/allMemeTemplatesSelectors";
import { Tab } from "../Tab/Tab";
import burgerIcon from "../../images/icons/burger_icon.svg";
import { Categories } from "../Categories/Categories";
import {
  loadAllMemeTemplates,
  setAllMemeTemplatesEmpty,
} from "../../services/actions/allMemeTemplatesActions";

import {
  addRandomId,
  setOrdering,
} from "../../services/actions/filtrationActions";

const MemesBox = ({ startOfVisibleMems, setStartOfVisibleMems }) => {
  const memeTemplates = useSelector(selectAllMemeTemplates);
  const isNewMemeAvalible = useSelector(selectIsMemeTemplateAvalible);
  const [scrollTop, setScrollTop] = useState(null);
  const dispatch = useDispatch();
  const [isHidden, setIsHidden] = useState(true);
  const [paramId, setParamId] = useState(1);
  const [tabs, setTabs] = useState([
    { text: "Популярные", isOn: true, param: "", id: 1 },
    { text: "Новинки", isOn: false, param: "-published_at", id: 2 },
    { text: "Рандом", isOn: false, param: "random", id: 3 },
  ]);
  const limit = 21;

  const fullHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  // console.log(scrollTop);
  const addMemes = () => {
    dispatch(loadAllMemeTemplates(startOfVisibleMems + limit));
    setStartOfVisibleMems(startOfVisibleMems + limit);
  };
  const handleScroll = (e) => {
    // e.preventDefault();
    setScrollTop(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleChangeOfColorTabButton = (array, id) => {
    return array.map((tab) => {
      if (tab.id === id) {
        return { ...tab, isOn: true };
      } else {
        return { ...tab, isOn: false };
      }
    }); // для отображения цвета кнопки
  };
  const clichHandleTab = (params) => {
    if (params.id === paramId && params.id !== 3) {
      //если повторно нажимаем на кнопку, кроме рандом
      return;
    }
    setStartOfVisibleMems(0); // при нажатии идет запрос с offset=0 and limit=21
    dispatch(setAllMemeTemplatesEmpty()); //обнуляем в Store все шаблоны
    setParamId(params.id); // прописываем в State id кнопки
    setTabs(handleChangeOfColorTabButton(tabs, params.id));

    if (params.param !== "random") {
      dispatch(setOrdering(params.param)); // если не рандом, то
      return;
    }

    dispatch(setOrdering(params.param));
    dispatch(addRandomId());
  };

  return (
    <>
      {memeTemplates.length >= 0 && (
        <section
          className="memesbox"
          aria-label="Box of memes"
          id="memes-start"
        >
          <div className="box">
            <div className="tab_container">
              <div className="tabs">
                {tabs.map((tab) => {
                  return (
                    <button
                      className={`tab_button ${tab.isOn ? "tab_isOn" : ""}`}
                      id={tab.id}
                      onClick={() => {
                        clichHandleTab(tab);
                      }}
                    >
                      {tab.text}
                    </button>
                  );
                })}

                <Tab></Tab>
              </div>
              <div
                className="burger_icon"
                onClick={() => {
                  setIsHidden(!isHidden);
                }}
              >
                <img
                  src={burgerIcon}
                  alt="BurgerIcon"
                  className="svg"
                  style={{
                    filter: isHidden
                      ? null
                      : "invert(38%) sepia(72%) saturate(689%) hue-rotate(218deg) brightness(87%) contrast(91%)",
                  }}
                />

                <Categories isHidden={isHidden}></Categories>
              </div>
            </div>
            <ul className="memesbox__container">
              {memeTemplates.map((elem) => {
                return <Meme elem={elem} key={elem.id} />;
              })}
            </ul>
          </div>

          {
            <button
              onClick={addMemes}
              disabled={!isNewMemeAvalible}
              className="memesbox__btn-show-more btn"
            >
              {isNewMemeAvalible ? "показать больше" : "больше мемов нет"}
            </button>
          }
          <Link
            to="/#memes-start"
            className={`
          ${
            scrollTop > window.innerHeight ? "memesbox__up_type_fixed" : ""
          } memesbox__up 
          ${
            scrollTop > fullHeight - 1.25 * window.innerHeight
              ? "memesbox__up_type_absolute"
              : ""
          }`}
          >
            <img
              className="memesbox__up-arrow"
              src={arrowUp}
              alt="Стрелка вверх."
            />
            <p className="memesbox__up-text">наверх</p>
          </Link>
        </section>
      )}
    </>
  );
};

export default MemesBox;
