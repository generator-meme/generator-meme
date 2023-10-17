import api from "../../utils/api";
import "./MemeColection.css";
import Tag from "./Tag";
import { getCookie } from "../../utils/cookie";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ReactComponent as SearchButton } from "../../images/search-btn.svg";
import button_delete from "../../images/cross-delete.png";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";

export default function MemeCollection() {
  const [savedMemes, setSavedMemes] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  var isTagsShown = false;
  var sortByDate = false;
  const [memesPerPageGloabl, setMemesPerPageGlobal] = useState(1);
  // const debouncedValue = useDebounce(search); //на случай если появится желание сделать отправку на сервер без кнопки "Сортировать"
  var amountOfPages = 1;
  // const [amountOfPages, setAmountOfPages] = useState(1)
  // const [pages, setPages] = useState([])
  const [toReverseMemes, setToReverseMemes] = useState(false);
  var pages = [];
  const adjustWidth = () => {
    var memes_per_page = 9 * memesPerPageGloabl;
    switch (true) {
      case window.screen.width <= 1480 && window.screen.width > 1080:
        memes_per_page = 4 * memesPerPageGloabl;
        break;
      case window.screen.width <= 1080 && window.screen.width > 750:
        memes_per_page = 2 * memesPerPageGloabl;
        isTagsShown = true;

        break;
      case window.screen.width <= 750 && window.screen.width > 350:
        memes_per_page = 4 * memesPerPageGloabl;
        isTagsShown = true;
        sortByDate = true;
        break;
      default:
        break;
    }
    return memes_per_page;
  };
  var memesPerPage = adjustWidth();
  amountOfPages = Math.ceil(savedMemes?.count / memesPerPage);
  // var new_pages = [];
  for (let i = 1; i <= amountOfPages; i++) {
    pages.push(i);
  }
  // pages = new_pages;

  const handleChangeSearch = (e) => {
    const search_string = e.target.value;
    const query_string = search_string.replaceAll(" ", ",");
    setSearch(query_string);
  };
  const showMore = (e) => {
    e.preventDefault();
    setMemesPerPageGlobal((memesPerPage *= 2));
    ShowFirstPageOfSavedMemes();
  };
  const reverseMemes = (e) => {
    e.preventDefault();
    //  const [ toReverseMemes, setToReverseMemes] = useState(false);
    setToReverseMemes(!toReverseMemes);
    ShowFirstPageOfSavedMemes(
      search,
      (currentPage - 1) * memesPerPage,
      toReverseMemes // спросить в обратную сторону почему offset=-1 не работает
    );
    const svgArr = document.getElementById("transformed");

    if (toReverseMemes) {
      svgArr.style.transform = "rotate(180deg)";
      svgArr.style.color = "#AC52D1";
    } else {
      svgArr.style.transform = "rotate(0deg)";
      svgArr.style.color = "black";
    }
  };
  const deleteMemeFromCollection = async (meme_id) => {
    const savedToken = getCookie("token");
    await api.deleteMemeFromMyCollection(meme_id, savedToken); //удаление перманетно, до появления корзины
    ShowFirstPageOfSavedMemes(search, (currentPage - 1) * memesPerPage);
  };
  const ShowFirstPageOfSavedMemes = async (
    search_text = "",
    offset = 0,
    reverse = false
  ) => {
    const savedToken = getCookie("token");
    const result = await api.getMemesInMyCollection(
      search_text,
      memesPerPage,
      offset,
      "true",
      savedToken
    );
    setSavedMemes(result);
    if (reverse) {
      const reversedMemesObj = Object.assign({}, result);
      reversedMemesObj.results = [...result?.results].reverse();
      setSavedMemes(reversedMemesObj);
    }
  };
  const goToPage = (e, page) => {
    e.preventDefault();
    ShowFirstPageOfSavedMemes(search, (page - 1) * memesPerPage);
    setCurrentPage(page);
  };
  const SortEverything = (e) => {
    e.preventDefault();
    ShowFirstPageOfSavedMemes(search, 0);
  };

  /*  const [amountOfPages, setAmountOfPages] = useState(1)
  // var pages = [];
  const [pages, setPages] = useState([]) */

  //  setMemesPerPage(adjustWidth())
  useEffect(() => {
    ShowFirstPageOfSavedMemes();
    //
  }, []);

  return (
    <div className="meme_collection">
      <div className="header-row">
        <h1>Коллекция мемов</h1>
        <div className="search-component">
          <input
            onChange={handleChangeSearch}
            // value={search}
            id="search-input"
            className="text-style"
            placeholder="Поиск"
          />
          <button
            className="search-button btn-no-bg"
            onClick={(e) => SortEverything(e)}
          >
            <SearchButton />
          </button>
        </div>
        {sortByDate && (
          <button
            className="sortByDate btn-no-bg"
            onClick={(e) => reverseMemes(e)}
          >
            По дате
            <div id="transformed">
              <ArrowDown />
            </div>
          </button>
        )}
        {!isTagsShown && (
          <div className="btn-no-bg text-style">Сортировать</div>
        )}
      </div>

      <div className="memes_container">
        {savedMemes?.results?.map((res) => (
          <>
            <div className="one_meme">
              <button
                onClick={(e) => deleteMemeFromCollection(res.meme.id)}
                className="delete-btn btn-no-bg"
              >
                <img className="cross" src={button_delete} alt="delete" />
              </button>
              <img className="saved_meme_img" src={res.meme.image} alt="" />
              <Tag meme={res.meme} />
            </div>
          </>
        ))}
      </div>
      {!sortByDate ? (
        <div className="pages">
          {pages.map((page) => (
            <button className="btn-no-bg" onClick={(e) => goToPage(e, page)}>
              {page}
            </button>
          ))}
        </div>
      ) : (
        <>
          {savedMemes?.count >= memesPerPage && (
            <button className="pages btn-no-bg" onClick={(e) => showMore(e)}>
              Показать больше
            </button>
          )}
        </>
      )}
    </div>
  );
}
