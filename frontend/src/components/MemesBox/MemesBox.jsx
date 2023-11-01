import React, { useState, useEffect } from "react";
import "./MemesBox.css";
import arrowUp from "../../images/arrow-up.svg";
import Meme from "../Meme/Meme";
import { HashLink as Link } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { selectAllMemeTemplates } from "../../services/selectors/allMemeTemplatesSelectors";
import { Tab } from "../Tab/Tab";
import burgerIcon from "../../images/icons/burger_icon.svg";
import { Categories } from "../Categories/Categories";
import { setOrdering } from "../../services/actions/filtrationActions";
import Prompt from "../Prompt/Prompt";

const MemesBox = ({
  numberOfVisibleMems,
  setNumberOfVisibleMems,
  setIsNewMeme,
}) => {
  const memeTemplates = useSelector(selectAllMemeTemplates);
  const [scrollTop, setScrollTop] = useState(null);
  const dispatch = useDispatch();
  const [isHidden, setIsHidden] = useState(true);

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
    setNumberOfVisibleMems(numberOfVisibleMems + 21);
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
  const [tabs, setTabs] = useState([
    { text: "Популярные", isOn: true, param: "", id: 1 },
    { text: "Новинки", isOn: false, param: "-published_at", id: 2 },
    { text: "Рандом", isOn: false, param: "random", id: 3 },
  ]);
  const clichHandleTab = (params) => {
    dispatch(setOrdering(params.param));
    const tempTabs = tabs.map((tab) => {
      if (tab.id === params.id) {
        return { ...tab, isOn: true };
      } else {
        return { ...tab, isOn: false };
      }
    });
    setTabs(tempTabs);
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
              {memeTemplates.slice(0, numberOfVisibleMems).map((elem) => {
                return (
                  <Meme elem={elem} key={elem.id} setIsNewMeme={setIsNewMeme} />
                );
              })}
            </ul>
          </div>

          {memeTemplates.length > numberOfVisibleMems && (
            <button onClick={addMemes} className="memesbox__btn-show-more btn">
              показать больше
            </button>
          )}
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
