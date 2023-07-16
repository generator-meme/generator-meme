import React, { useState, useEffect, useRef } from "react";
import "./MemesBox.css";
import arrowUp from "../../images/arrow-up.svg";
import Meme from "../Meme/Meme";
import { HashLink as Link } from "react-router-hash-link";
<<<<<<< HEAD
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeGrid as Grid, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
const MemesBox = ({ setCurrentMeme, setIsNewMeme, hasNextPage, isNextPageLoading, items, loadNextPage, count}) => {

  const [memesBoxWidth, setMemesBoxWidth] = useState(window.innerWidth)
  const [columns, setColumns] = useState(3);
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index) => !!items[index]
  const memesBoxRef = useRef(null);
  const [isScrollBlocked, setIsScrollBlocked] = useState(true);
  const [isUpBtnShown, setIsUpBtnShown] = useState(false);
  const [initialScrollPos, setInitialScrollPos] = useState(3);
  // const [scrollTop, setScrollTop] = useState(null);
=======
import { useDispatch } from "react-redux";

const MemesBox = ({
  memes,
  saveNumberOfVisibleMemes,
  numberOfVisibleMems,
  setNumberOfVisibleMems,
  setIsNewMeme,
}) => {
  // console.log(memes);
  const [scrollTop, setScrollTop] = useState(null);
  const dispatch = useDispatch();
>>>>>>> test

  // const fullHeight = Math.max(
  //   document.body.scrollHeight,
  //   document.documentElement.scrollHeight,
  //   document.body.offsetHeight,
  //   document.documentElement.offsetHeight,
  //   document.body.clientHeight,
  //   document.documentElement.clientHeight
  // );
  const scrollToTop = () => {
    window.scroll(0, 0);
  }
  const handleScroll = (e) => {
    if(window.scrollY >= memesBoxRef.current.offsetTop){
      setIsScrollBlocked(false)
      setIsUpBtnShown(true)
    }
    else {
      setIsScrollBlocked(true)
      setIsUpBtnShown(false)
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    
    if(!memesBoxRef.current) return;

    setMemesBoxWidth(memesBoxRef.current.offsetWidth);
    const handleWindowResize = () => {
      setMemesBoxWidth(memesBoxRef.current.offsetWidth);
      if(memesBoxRef.current.offsetWidth >= 1480){
        setColumns(3);
      };
      if(memesBoxRef.current.offsetWidth >= 1080 && memesBoxRef.current.offsetWidth < 1480){
        setColumns(2);
      };
      if(memesBoxRef.current.offsetWidth < 1080){
        setColumns(1);
      };
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  },[]);
  const memeItem = ({
    columnIndex,
    rowIndex,
    style
  }
  ) => {
    const index = rowIndex*columns + columnIndex;
    if (!isItemLoaded(index)) {
      if(count === index){
        return null;
      }
      return (
        <div
          className="search-results__table-row table-row--loading"
          style={style}
        >{`LOADING ${index}`}</div>
      );
    } else {
      return (
        <Meme
        style={style} 
        elem={items[index]} 
        setCurrentMeme={setCurrentMeme}
        setIsNewMeme={setIsNewMeme}
        /> 
      );
    }
  };

  
  if(items.length > 0){
  return (
    <>
<<<<<<< HEAD
      <section className="memesbox" aria-label="Box of memes" id="memes-start" ref={memesBoxRef}>
        <ul className="memesbox__container">
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={itemCount}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <Grid
                    className={isScrollBlocked ? 'memesbox--blocked-scroll' : ''}
                    columnCount={columns}
                    columnWidth={memesBoxWidth/columns}
                    height={height}
                    rowCount={Math.ceil(itemCount/columns) || 0}
                    rowHeight={500}
                    onItemsRendered={(gridProps) => {
                      onItemsRendered(
                        {
                        overscanStartIndex:
                          gridProps.overscanRowStartIndex * columns,
                        overscanStopIndex:
                          gridProps.overscanRowStopIndex * columns,
                        visibleStartIndex:
                           gridProps.visibleRowStartIndex * columns,
                        visibleStopIndex:
                          gridProps.visibleRowStopIndex * columns,
                      });
                    }}
                    ref={ref}
                    width={width}
                  >
                    {memeItem}
                  </Grid>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </ul>
        <div 
          className={isUpBtnShown ? 'memebox__up-btn' : 'memebox__up-btn memebox__up-btn--hidden'}
          onClick={scrollToTop}>
          
          <img
            className="memesbox__up-arrow"
            src={arrowUp}
            alt="Стрелка вверх."
          />
          <p className="memesbox__up-text">наверх</p>
        </div>  
      </section>
=======
      {memes.length > 0 && (
        <section
          className="memesbox"
          aria-label="Box of memes"
          id="memes-start"
        >
          <ul className="memesbox__container">
            {memes.slice(0, numberOfVisibleMems).map((elem) => {
              return (
                <Meme elem={elem} key={elem.id} setIsNewMeme={setIsNewMeme} />
              );
            })}
          </ul>
          {memes.length > numberOfVisibleMems && (
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
>>>>>>> test
    </>
  );
  }
  return <h1>no results</h1>
}


export default MemesBox;
