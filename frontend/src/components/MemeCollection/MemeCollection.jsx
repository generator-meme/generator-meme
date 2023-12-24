import api from "../../utils/api";
import "./MemeColection.css";
import Tag from "./Tag";
import { getCookie } from "../../utils/cookie";
import { useState, useEffect, useCallback, useMemo, useReducer } from "react";
import { ReactComponent as SearchButton } from "../../images/search-btn.svg";
import button_delete from "../../images/cross-delete.png";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";
import { useDispatch, useSelector } from "react-redux";
import { getAllMyMemeCollections } from "../../services/actions/allMemeCollectionActions";

export default function MemeCollection() {
  const [savedMemes, setSavedMemes] = useState({});
  const [search, setSearch] = useState("");
  const [searchID, setSearchID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const a = useSelector((state) => state.allMyCollectionMemes.myMemes);
  console.log(a);
  let isTagsShown = false;
  let sortByDate = false;
  const [memesPerPageGloabl, setMemesPerPageGlobal] = useState(1);
  // const debouncedValue = useDebounce(search); //на случай если появится желание сделать отправку на сервер без кнопки "Сортировать"
  let amountOfPages = 1;
  // const [amountOfPages, setAmountOfPages] = useState(1)
  // const [pages, setPages] = useState([])
  const [toReverseMemes, setToReverseMemes] = useState(false);
  let pages = [];
  const adjustWidth = () => {
    let memes_per_page = 9 * memesPerPageGloabl;
    switch (true) {
      case window.screen.width <= 1480 && window.screen.width > 1080:
        memes_per_page = 4 * memesPerPageGloabl;
        break;
      case window.screen.width <= 1080 && window.screen.width > 750:
        memes_per_page = 2 * memesPerPageGloabl;
        isTagsShown = false;
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
  let memesPerPage = adjustWidth();
  amountOfPages = Math.ceil(savedMemes?.count / memesPerPage);
  // let new_pages = [];
  for (let i = 1; i <= amountOfPages; i++) {
    pages.push(i);
  }
  // pages = new_pages;

  useEffect(() => {
    dispatch(getAllMyMemeCollections());
  }, []);

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
      searchID,
      (currentPage - 1) * memesPerPage,
      toReverseMemes ? "-added_at" : "added_at"
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
    console.log();
    await api.deleteMemeFromMyCollection(meme_id, savedToken); //удаление перманетно, до появления корзины
    ShowFirstPageOfSavedMemes(searchID, (currentPage - 1) * memesPerPage);
  };
  const ShowFirstPageOfSavedMemes = async (
    //делает запрос на сервер для подгрузки коллекции мемов
    search_text = "",
    offset = 0,
    ordering = "-added_at"
  ) => {
    const savedToken = getCookie("token");
    const result = await api.getMemesInMyCollection(
      search_text,
      memesPerPage,
      offset,
      "true",
      savedToken,
      ordering
    );
    console.log(result);
    setSavedMemes(result);
  };
  // подгружает вторую подборку мемов в зависимости от offset
  const goToPage = (e, page) => {
    console.log(page);
    e.preventDefault();
    ShowFirstPageOfSavedMemes(search, (page - 1) * memesPerPage);
    setCurrentPage(page);
  };

  const SortEverything = async (e) => {
    //не пойму как действует сортировка
    e.preventDefault();
    if (search !== "") {
      console.log(search);
      const template = await api.getTagsWithQueryName(search);
      console.log(template);
      const template_query = template?.map((tag) => {
        console.log("fff");
        setSearchID(...(tag?.id + ","));
      });
    }
    // console.log(template,template_query)
    // setSearchID(template_query);
    console.log(searchID);
    // s
  };
  console.log(searchID);

  /*  const [amountOfPages, setAmountOfPages] = useState(1)
  // let pages = [];
  const [pages, setPages] = useState([]) */

  //  setMemesPerPage(adjustWidth())
  useEffect(() => {
    console.log("ferst");
    ShowFirstPageOfSavedMemes();
    //
  }, [searchID, currentPage]);

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
        {a?.map((res) => (
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
