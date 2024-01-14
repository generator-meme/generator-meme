import api from "../../utils/api";
import "./MemeColection.css";
import Tag from "./Tag";
import { getCookie } from "../../utils/cookie";
import { useState, useEffect, useCallback, useMemo, useReducer } from "react";
import { ReactComponent as SearchButton } from "../../images/search-btn.svg";
import button_delete from "../../images/cross-delete.png";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMemeFromCollection,
  deleteMemeFromMyCollection,
  getAllMyMemeCollections,
  setAllMemeCollectionsEmpty,
} from "../../services/actions/allMemeCollectionActions";
import {
  changeFlag,
  clearQueryParam,
  searchTag,
  addOrdering,
} from "../../services/actions/collectionFiltrationActions";

export default function MemeCollection() {
  const [savedMemes, setSavedMemes] = useState({});
  const [search, setSearch] = useState("");
  const [searchID, setSearchID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { tags } = useSelector((state) => state.getTags);
  const dispatch = useDispatch();
  const myMemes = useSelector((state) => state.allMyCollectionMemes.myMemes);
  const { template_tag, offset, ordering, only_my, limit } = useSelector(
    (state) => state.collectionFiltration.queryParam
  );
  const { flag } = useSelector((state) => state.collectionFiltration);
  let isTagsShown = true;
  let sortByDate = true;
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
  }, [template_tag, offset, ordering, only_my, limit, dispatch, flag]);

  const stringToSearch = () => {
    if (search === "") {
      return "";
    }
    const tempTags = tags;
    const tagId = tempTags.find((tag) => {
      return tag.name === search;
    });
    return tagId ? tagId.id : "noID";
  };

  const handleChangeSearch = (e) => {
    const search_string = e.target.value;
    const query_string = search_string.replaceAll(" ", ",");
    setSearch(query_string);
  };

  const SortEverything = (e) => {
    e.preventDefault();
    const searchString = stringToSearch();

    if (searchString === "") {
      dispatch(clearQueryParam());
      dispatch(changeFlag()); //триггер для вызова useEffect
      return;
    }
    if (searchString !== "noID") {
      dispatch(searchTag(searchString));
    } else {
      dispatch(setAllMemeCollectionsEmpty());
    }
  };
  const reverseMemes = () => {
    if (ordering === "added_at") {
      dispatch(addOrdering("-added_at"));
    } else dispatch(addOrdering("added_at"));
  };
  /*  const [amountOfPages, setAmountOfPages] = useState(1)
  // let pages = [];
  const [pages, setPages] = useState([]) */

  //  setMemesPerPage(adjustWidth())
  // useEffect(() => {

  //   ShowFirstPageOfSavedMemes();
  //   //
  // }, [searchID, currentPage]);

  return (
    <div className="meme_collection">
      <div className="header-row">
        <h1>Коллекция мемов</h1>
        <div className="search-component">
          <input
            onChange={handleChangeSearch}
            value={search}
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
        {myMemes?.results?.map((res) => (
          <>
            <div className="one_meme">
              <button
                onClick={(e) => {
                  dispatch(deleteMemeFromMyCollection(res.meme.id));
                }}
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
            <button
              className="btn-no-bg"
              // onClick={(e) => goToPage(e, page)}
            >
              {page}
            </button>
          ))}
        </div>
      ) : (
        <>
          {savedMemes?.count >= memesPerPage && (
            <button
              className="pages btn-no-bg"
              // onClick={(e) => showMore(e)}
            >
              Показать больше
            </button>
          )}
        </>
      )}
    </div>
  );
}
const handleReverseMemesCollection = () => {};
// const showMore = (e) => {
//   e.preventDefault();
//   setMemesPerPageGlobal((memesPerPage *= 2));
//   ShowFirstPageOfSavedMemes();
// };
// const reverseMemes = (e) => {
//   e.preventDefault();
//   //  const [ toReverseMemes, setToReverseMemes] = useState(false);
//   setToReverseMemes(!toReverseMemes);
//   ShowFirstPageOfSavedMemes(
//     searchID,
//     (currentPage - 1) * memesPerPage,
//     toReverseMemes ? "-added_at" : "added_at"
//   );

//   const svgArr = document.getElementById("transformed");
//   if (toReverseMemes) {
//     svgArr.style.transform = "rotate(180deg)";
//     svgArr.style.color = "#AC52D1";
//   } else {
//     svgArr.style.transform = "rotate(0deg)";
//     svgArr.style.color = "black";
//   }
// };
// const deleteMemeFromCollection = async (meme_id) => {
//   const savedToken = getCookie("token");
//   console.log();
//   await api.deleteMemeFromMyCollection(meme_id, savedToken); //удаление перманетно, до появления корзины
//   ShowFirstPageOfSavedMemes(searchID, (currentPage - 1) * memesPerPage);
// };
// const ShowFirstPageOfSavedMemes = async (
//   //делает запрос на сервер для подгрузки коллекции мемов
//   search_text = "",
//   offset = 0,
//   ordering = "-added_at"
// ) => {
//   const savedToken = getCookie("token");
//   const result = await api.getMemesInMyCollection(
//     search_text,
//     memesPerPage,
//     offset,
//     "true",
//     savedToken,
//     ordering
//   );
//   console.log(result);
//   setSavedMemes(result);
// };
// подгружает вторую подборку мемов в зависимости от offset
// const goToPage = (e, page) => {
//   e.preventDefault();
//   ShowFirstPageOfSavedMemes(search, (page - 1) * memesPerPage);
//   setCurrentPage(page);
// };
