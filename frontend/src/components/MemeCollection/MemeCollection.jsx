import api from "../../utils/api";
import styles from "./MemeColection.module.css";
import {
  addPage,
  getPage,
} from "../../services/actions/collectionFiltrationActions";
import Tag from "./Tag";
import { getCookie } from "../../utils/cookie";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { ReactComponent as SearchButton } from "../../images/search-btn.svg";
import button_delete from "../../images/cross-delete.png";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMemeFromMyCollection,
  getAllMyMemeCollections,
  setAllMemeCollectionsEmpty,
} from "../../services/actions/allMemeCollectionActions";
import {
  changeFlag,
  clearQueryParam,
  searchTag,
  addOrdering,
  addLimit,
  addOffset,
} from "../../services/actions/collectionFiltrationActions";
import { TagLists } from "../TagLists/TagLists";
import { PaginationList } from "../PaginationList/PaginationList";
import { useNavigate } from "react-router-dom";
import { BLOCK_SAVE_BUTTON_TO_COLLECTION } from "../../services/actions/savedMemeActions";

export default function MemeCollection() {
  const [search, setSearch] = useState("");
  const { tags } = useSelector((state) => state.getTags);
  const dispatch = useDispatch();
  const myMemes = useSelector((state) => state.allMyCollectionMemes.myMemes);
  console.log(myMemes);
  const { template_tag, offset, ordering, only_my, limit } = useSelector(
    (state) => state.collectionFiltration.queryParam
  );
  const { flag } = useSelector((state) => state.collectionFiltration);
  const [reverse, setReverse] = useState(false);
  let isTagsShown = true;
  let sortByDate = true;
  const [page, setPage] = useState(1);
  const [widthScreen, setWidthScreen] = useState(window.screen.width);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllMyMemeCollections());
  }, [template_tag, offset, ordering, only_my, limit, dispatch, flag]);

  useEffect(() => {
    let pageArray = [];
    const pageC = Math.ceil(myMemes?.count / memesPerPage);
    for (let i = 1; i <= pageC; i++) {
      pageArray.push(i);
    }
    if (!pageArray) {
      return [];
    }
    let tempPages = pageArray;
    const slicedArrayes = sliceArrayIntoGroups(tempPages, 5);
    dispatch(getPage(slicedArrayes));
    // dispatch(addPage(0));
  }, [myMemes]);

  const memesPerPage = useMemo(() => {
    let memes_per_page = 9 * page;
    switch (true) {
      case window.screen.width <= 1480 && window.screen.width > 1080:
        memes_per_page = 4 * page;
        break;
      case window.screen.width <= 1080 && window.screen.width > 750:
        memes_per_page = 2 * page;
        // isTagsShown = false;
        break;
      case window.screen.width <= 750 && window.screen.width > 350:
        memes_per_page = 4 * page;
        // isTagsShown = true;
        // sortByDate = true;
        break;
      default:
        break;
    }
    return memes_per_page;
  }, []);

  function sliceArrayIntoGroups(arr, size) {
    if (arr.length === 0) {
      return arr;
    }
    return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
  }

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
    dispatch(clearQueryParam());
    console.log(limit, offset);
    if (searchString === "") {
      dispatch(changeFlag()); //триггер для вызова useEffect
      console.log("in empty search");
      return;
    }
    if (searchString !== "noID") {
      dispatch(searchTag(searchString));
      dispatch(addPage(0));
    } else {
      dispatch(setAllMemeCollectionsEmpty());
    }
    dispatch(addPage(0));
    // console.log(page * limit);
    // dispatch(addLimit(addOffset(page * limit)));
  };
  const reverseMemes = () => {
    setReverse(!reverse);
    ordering === "added_at"
      ? dispatch(addOrdering("-added_at"))
      : dispatch(addOrdering("added_at"));
  };

  const goToPage = (e, page) => {
    console.log((page - 1) * limit);
    e.preventDefault();
    dispatch(addOffset((page - 1) * limit));
  };

  const handleGoToMeme = (id) => {
    navigate(`/saved/${id}`);
  };
  return (
    <div className={styles.meme_collection}>
      <div className={styles.header_row}>
        <h1>Коллекция мемов</h1>
        <div className={styles.search_component}>
          <input
            onChange={handleChangeSearch}
            value={search}
            className={`${styles.text_style} ${styles.search_input}`}
            placeholder="Поиск"
          />
          <button
            className={`${styles.search_button} ${styles.btn_no_bg}`}
            onClick={(e) => SortEverything(e)}
          >
            <SearchButton />
          </button>
        </div>
        {sortByDate && (
          <button
            className={`${styles.sortByDate} ${styles.btn_no_bg}`}
            onClick={(e) => reverseMemes(e)}
          >
            По дате
            <div
              className={
                reverse ? styles.unreverse_array : styles.reverse_array
              }
            >
              <ArrowDown />
            </div>
          </button>
        )}
        {!isTagsShown && (
          <div className={`${styles.text_style} ${styles.btn_no_bg}`}>
            Сортировать
          </div>
        )}
      </div>
      <div className={styles.memes_container}>
        {myMemes?.results?.map((res) => {
          return (
            <>
              <div className={styles.one_meme}>
                <button
                  onClick={(e) => {
                    dispatch(deleteMemeFromMyCollection(res.meme.id));
                  }}
                  className={`${styles.delete_btn} ${styles.btn_no_bg}`}
                >
                  <img
                    className={styles.cross}
                    src={button_delete}
                    alt="delete"
                  />
                </button>
                <img
                  className={styles.saved_meme_img}
                  src={res.meme.image}
                  alt=""
                  onClick={() => {
                    handleGoToMeme(res.meme.id);
                    dispatch({ type: BLOCK_SAVE_BUTTON_TO_COLLECTION });
                  }}
                />
                <TagLists elem={res.meme.template}></TagLists>
              </div>
            </>
          );
        })}
      </div>

      <PaginationList goToPage={goToPage}></PaginationList>
    </div>
  );
}
