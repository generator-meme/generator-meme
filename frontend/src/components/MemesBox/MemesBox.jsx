import React, { useState, useEffect } from "react";
import "./MemesBox.css";
import arrowUp from "../../images/arrow-up.svg";
import Meme from "../Meme/Meme";
import { HashLink as Link } from "react-router-hash-link";
import { useSelector } from "react-redux";
import { selectAllMemeTemplates } from "../../services/selectors/allMemeTemplatesSelectors";
import { Tab } from "../Tab/Tab";
import burgerIcon from "../../images/icons/burger_icon.svg";

const MemesBox = ({
  numberOfVisibleMems,
  setNumberOfVisibleMems,
  setIsNewMeme,
}) => {
  const memeTemplates = useSelector(selectAllMemeTemplates);
  const [scrollTop, setScrollTop] = useState(null);

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

  return (
    <>
      {memeTemplates.length > 0 && (
        <section
          className="memesbox"
          aria-label="Box of memes"
          id="memes-start"
        >
          <div className="box">
            <div className="tab_container">
              <div className="tabs">
                <Tab text={"Популярные"} param={""}></Tab>
                <Tab text={"Новинки"} param={"-published_at"}></Tab>
                <Tab text={"Рандом"} param={"random"}></Tab>
                <Tab text={"Избранные"}></Tab>
              </div>
              <div className="burger_icon">
                <img src={burgerIcon} alt="BurgerIcon" />
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
